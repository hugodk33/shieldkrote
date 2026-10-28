import { describe, it, before, beforeEach, after } from 'node:test'
import { strict as assert } from 'node:assert'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * Testes das lojas por local.
 *
 * O repositório abre `database.sqlite` na pasta de trabalho, então o teste
 * roda dentro de uma pasta temporária: o banco de desenvolvimento NUNCA é
 * tocado por aqui. Por isso os repositórios são carregados com `require`
 * DEPOIS do `chdir` (import estático subiria antes).
 */

const TABLE_ID = '11111111-1111-4111-8111-111111111111'
const OTHER_TABLE_ID = '22222222-2222-4222-8222-222222222222'
const SHOP_ID = 'shop-0000-0000-0000-000000000001'
const PLAIN_ID = 'plain-0000-0000-0000-000000000002'
const ITEM_SWORD = 'sword-0000-0000-0000-000000000001'
const ITEM_POTION = 'potion-0000-0000-0000-000000000002'
const ITEM_OTHER = 'other-0000-0000-0000-000000000003'

const SCHEMA = `
CREATE TABLE table_locations (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  shop_name TEXT,
  description TEXT,
  PRIMARY KEY (id, lang)
);
CREATE TABLE game_table_items (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  location_id TEXT,
  name TEXT,
  kind TEXT,
  category TEXT,
  weight_lb REAL,
  cost INTEGER,
  currency_item_id TEXT,
  skill_id TEXT,
  dimensions TEXT,
  description TEXT,
  quality TEXT,
  condition TEXT,
  tech_level TEXT,
  subcategory TEXT,
  module_id TEXT,
  PRIMARY KEY (id, lang)
);
CREATE TABLE location_shop_items (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  location_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  price INTEGER,
  stock INTEGER DEFAULT -1,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, lang)
);
CREATE TABLE game_table_weapons (
  id TEXT PRIMARY KEY,
  lang TEXT DEFAULT 'pt',
  item_id TEXT,
  skill TEXT,
  skill_id TEXT
);
CREATE TABLE weapon_attacks (
  id TEXT PRIMARY KEY,
  weapon_id TEXT,
  name TEXT
);
CREATE TABLE game_table_armors (
  id TEXT PRIMARY KEY,
  item_id TEXT
);
CREATE TABLE item_images (
  id TEXT PRIMARY KEY,
  item_id TEXT,
  url TEXT,
  role TEXT,
  sort INTEGER
);
`

let workDir = ''
let originalCwd = ''
let db: any
let LocationShopRepository: any
let GameTableRulesRepository: any
let useCases: any
let repo: any
let rules: any

/** Recria o cenário do zero: locais e itens do catálogo. */
const resetWorld = (): void => {
  db.exec(`DELETE FROM location_shop_items; DELETE FROM game_table_items; DELETE FROM table_locations;`)

  db.prepare(
    `INSERT INTO table_locations (id, lang, table_id, shop_name, description)
     VALUES (?, 'pt', ?, ?, ?)`
  ).run(SHOP_ID, TABLE_ID, 'Ferra do Corvo', 'Uma ferraria na estrada')
  db.prepare(
    `INSERT INTO table_locations (id, lang, table_id, shop_name, description)
     VALUES (?, 'pt', ?, NULL, ?)`
  ).run(PLAIN_ID, TABLE_ID, 'Um quintal qualquer')

  const addItem = (id: string, name: string, cost: number, tableId = TABLE_ID): void => {
    db.prepare(
      `INSERT INTO game_table_items (id, lang, table_id, name, kind, cost)
       VALUES (?, 'pt', ?, ?, 'equipment', ?)`
    ).run(id, tableId, name, cost)
  }
  addItem(ITEM_SWORD, 'Espada', 500)
  addItem(ITEM_POTION, 'Poção', 50)
  addItem(ITEM_OTHER, 'Item de outra mesa', 10, OTHER_TABLE_ID)
}

/** O item do jeito que o banco o guarda. */
const itemRow = (id: string): any =>
  db.prepare(`SELECT * FROM game_table_items WHERE id = ?`).get(id)

before(() => {
  originalCwd = process.cwd()
  workDir = mkdtempSync(join(tmpdir(), 'vkrpg-shop-'))
  process.chdir(workDir)

  // A conexão que os repositórios usam (abre `database.sqlite` na pasta de
  // trabalho): o teste enxerga exatamente o que o repositório grava.
  db = require('../../../infra/database/database').db
  db.exec(SCHEMA)

  LocationShopRepository = require('../../../domain/repositories/LocationShopRepository')
    .LocationShopRepository
  GameTableRulesRepository = require('../../../domain/repositories/GameTableRulesRepository')
    .GameTableRulesRepository
  useCases = require('./LocationShopUseCases')
  repo = new LocationShopRepository()
  rules = new GameTableRulesRepository()
})

beforeEach(() => {
  resetWorld()
})

after(() => {
  db?.close()
  process.chdir(originalCwd)
  if (workDir) rmSync(workDir, { recursive: true, force: true })
})

describe('Location shop use cases', () => {
  describe('FindLocationShopUseCase', () => {
    it('devolve a loja com o nome do local e o estoque vazio', async () => {
      const useCase = new useCases.FindLocationShopUseCase(repo, rules)

      const shop = await useCase.execute({ locationId: SHOP_ID })

      assert.strictEqual(shop.location_id, SHOP_ID)
      assert.strictEqual(shop.name, 'Ferra do Corvo')
      assert.strictEqual(shop.table_id, TABLE_ID)
      assert.strictEqual(shop.lines.length, 0)
    })

    it('recusa local que não existe', async () => {
      const useCase = new useCases.FindLocationShopUseCase(repo, rules)
      await assert.rejects(() => useCase.execute({ locationId: 'nao-existe' }), /não encontrado/i)
    })

    it('recusa local que não tem nome de loja', async () => {
      const useCase = new useCases.FindLocationShopUseCase(repo, rules)
      await assert.rejects(() => useCase.execute({ locationId: PLAIN_ID }), /nome de loja/i)
    })
  })

  describe('StockLocationShopItemUseCase', () => {
    it('põe o item do catálogo na prateleira e guarda preço e estoque', async () => {
      const useCase = new useCases.StockLocationShopItemUseCase(repo, rules)

      const shop = await useCase.execute({
        locationId: SHOP_ID,
        itemId: ITEM_SWORD,
        price: 750,
        stock: 3,
      })

      assert.strictEqual(shop.lines.length, 1)
      assert.strictEqual(shop.lines[0].item.id, ITEM_SWORD)
      assert.strictEqual(shop.lines[0].price, 750)
      assert.strictEqual(shop.lines[0].stock, 3)
      assert.strictEqual(itemRow(ITEM_SWORD).location_id, SHOP_ID)
    })

    it('entrar de novo no mesmo item não duplica a prateleira', async () => {
      const useCase = new useCases.StockLocationShopItemUseCase(repo, rules)

      await useCase.execute({ locationId: SHOP_ID, itemId: ITEM_SWORD, price: 750, stock: 3 })
      const shop = await useCase.execute({ locationId: SHOP_ID, itemId: ITEM_SWORD, price: 900 })

      assert.strictEqual(shop.lines.length, 1)
      assert.strictEqual(shop.lines[0].price, 900)
    })

    it('recusa item de outra mesa', async () => {
      const useCase = new useCases.StockLocationShopItemUseCase(repo, rules)
      await assert.rejects(
        () => useCase.execute({ locationId: SHOP_ID, itemId: ITEM_OTHER }),
        /não pertence a esta mesa/i
      )
    })

    it('recusa preço negativo e estoque abaixo de -1', async () => {
      const useCase = new useCases.StockLocationShopItemUseCase(repo, rules)
      await assert.rejects(
        () => useCase.execute({ locationId: SHOP_ID, itemId: ITEM_SWORD, price: -5 }),
        /preço/i
      )
      await assert.rejects(
        () => useCase.execute({ locationId: SHOP_ID, itemId: ITEM_SWORD, stock: -9 }),
        /estoque/i
      )
    })
  })

  describe('CopyItemIntoLocationShopUseCase', () => {
    it('copia o item do catálogo para dentro da loja', async () => {
      const useCase = new useCases.CopyItemIntoLocationShopUseCase(repo, rules)

      const shop = await useCase.execute({
        locationId: SHOP_ID,
        itemId: ITEM_SWORD,
        price: 900,
        stock: 2,
      })

      assert.strictEqual(shop.lines.length, 1)
      const copy = shop.lines[0]
      assert.notStrictEqual(copy.item.id, ITEM_SWORD)
      assert.match(copy.item.name, /^Espada/)
      assert.strictEqual(copy.price, 900)
      assert.strictEqual(copy.stock, 2)
      // A cópia mora na loja; o original continua solto no catálogo.
      assert.strictEqual(itemRow(copy.item.id).location_id, SHOP_ID)
      assert.strictEqual(itemRow(ITEM_SWORD).location_id, null)
    })

    it('recusa item de outra mesa', async () => {
      const useCase = new useCases.CopyItemIntoLocationShopUseCase(repo, rules)
      await assert.rejects(
        () => useCase.execute({ locationId: SHOP_ID, itemId: ITEM_OTHER }),
        /não pertence a esta mesa/i
      )
    })
  })

  describe('EditLocationShopItemUseCase', () => {
    it('muda preço e estoque da prateleira', async () => {
      const stock = new useCases.StockLocationShopItemUseCase(repo, rules)
      await stock.execute({ locationId: SHOP_ID, itemId: ITEM_POTION, price: 50, stock: 5 })

      const useCase = new useCases.EditLocationShopItemUseCase(repo, rules)
      const shop = await useCase.execute({
        locationId: SHOP_ID,
        itemId: ITEM_POTION,
        price: 60,
        stock: 1,
      })

      assert.strictEqual(shop.lines.length, 1)
      assert.strictEqual(shop.lines[0].price, 60)
      assert.strictEqual(shop.lines[0].stock, 1)
    })

    it('recusa item que não está no estoque da loja', async () => {
      const useCase = new useCases.EditLocationShopItemUseCase(repo, rules)
      await assert.rejects(
        () => useCase.execute({ locationId: SHOP_ID, itemId: ITEM_POTION, price: 10 }),
        /não está no estoque/i
      )
    })
  })

  describe('RemoveLocationShopItemUseCase', () => {
    it('tira a peça da prateleira e devolve o item ao catálogo solto', async () => {
      const stock = new useCases.StockLocationShopItemUseCase(repo, rules)
      await stock.execute({ locationId: SHOP_ID, itemId: ITEM_POTION, price: 50, stock: 5 })

      const useCase = new useCases.RemoveLocationShopItemUseCase(repo, rules)
      const shop = await useCase.execute({ locationId: SHOP_ID, itemId: ITEM_POTION })

      assert.strictEqual(shop.lines.length, 0)
      assert.strictEqual(itemRow(ITEM_POTION).location_id, null)
    })
  })
})
