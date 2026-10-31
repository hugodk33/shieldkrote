import { describe, it, before, beforeEach, after } from 'node:test'
import { strict as assert } from 'node:assert'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * Testes da troca entre jogadores.
 *
 * O repositório abre `database.sqlite` na pasta de trabalho, então o teste
 * roda dentro de uma pasta temporária: o banco de desenvolvimento NUNCA é
 * tocado por aqui. Por isso o repositório é carregado com `require` DEPOIS do
 * `chdir` (import estático subiria antes).
 */

const TABLE_ID = '11111111-1111-4111-8111-111111111111'
const OTHER_TABLE_ID = '22222222-2222-4222-8222-222222222222'
const PROPOSER = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const RECIPIENT = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
const STRANGER = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
const NPC = '99999999-9999-4999-8999-999999999999'
const USER_PROPOSER = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'
const USER_RECIPIENT = 'ffffffff-ffff-4fff-8fff-ffffffffffff'
const USER_NARRATOR = '12121212-1212-4212-8212-121212121212'
const ITEM_SWORD = 'sword-0000-0000-0000-000000000001'
const ITEM_CAPE = 'cape-0000-0000-0000-000000000002'
const ITEM_COIN = 'coin-0000-0000-0000-000000000003'

const SCHEMA = `
CREATE TABLE game_table_characters (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  table_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE game_table_npcs (
  id TEXT PRIMARY KEY,
  character_id TEXT
);
CREATE TABLE game_table_items (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  name TEXT,
  PRIMARY KEY (id, lang)
);
CREATE TABLE game_table_character_sheets (
  id TEXT,
  lang TEXT NOT NULL DEFAULT 'pt',
  character_id TEXT,
  name TEXT
);
CREATE TABLE character_equipment (
  id TEXT PRIMARY KEY,
  character_id TEXT,
  item_id TEXT,
  quantity INTEGER DEFAULT 1,
  status TEXT,
  location TEXT,
  rendered_st INTEGER
);
CREATE TABLE trade_offers (
  id TEXT PRIMARY KEY,
  table_id TEXT NOT NULL,
  proposer_character_id TEXT NOT NULL,
  recipient_character_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  proposer_confirmed INTEGER NOT NULL DEFAULT 0,
  recipient_confirmed INTEGER NOT NULL DEFAULT 0,
  message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT
);
CREATE TABLE trade_offer_items (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL,
  side TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1
);
`

let workDir = ''
let originalCwd = ''
let db: any
let TradeRepository: any
let useCases: any
let repo: any
let access: any

/** Recria o cenário do zero: mesa, personagens, itens e ofertas. */
const resetWorld = (): void => {
  db.exec(`DELETE FROM trade_offer_items; DELETE FROM trade_offers; DELETE FROM character_equipment;`)
  db.exec(`DELETE FROM game_table_npcs; DELETE FROM game_table_characters;`)
  db.exec(`DELETE FROM game_table_items; DELETE FROM game_table_character_sheets;`)

  const addCharacter = (id: string, userId: string, tableId: string): void => {
    db.prepare(
      `INSERT INTO game_table_characters (id, user_id, table_id, is_active) VALUES (?, ?, ?, 1)`
    ).run(id, userId, tableId)
  }
  addCharacter(PROPOSER, USER_PROPOSER, TABLE_ID)
  addCharacter(RECIPIENT, USER_RECIPIENT, TABLE_ID)
  addCharacter(STRANGER, USER_RECIPIENT, OTHER_TABLE_ID)
  addCharacter(NPC, USER_NARRATOR, TABLE_ID)
  db.prepare(`INSERT INTO game_table_npcs (id, character_id) VALUES (?, ?)`).run('npc-1', NPC)

  const addItemDef = (id: string, name: string): void => {
    db.prepare(`INSERT INTO game_table_items (id, lang, table_id, name) VALUES (?, 'pt', ?, ?)`)
      .run(id, TABLE_ID, name)
  }
  addItemDef(ITEM_SWORD, 'Espada')
  addItemDef(ITEM_CAPE, 'Capa')
  addItemDef(ITEM_COIN, 'Moeda')

  db.prepare(
    `INSERT INTO game_table_character_sheets (id, lang, character_id, name) VALUES (?, 'pt', ?, ?)`
  ).run('sheet-1', PROPOSER, 'Lyra')
}

/** Insere (ou soma) um item no inventário. */
const addItem = (
  characterId: string,
  itemId: string,
  quantity: number,
  status = 'in_inventory',
  location = 'none'
): void => {
  db.prepare(
    `INSERT INTO character_equipment (id, character_id, item_id, quantity, status, location, rendered_st)
     VALUES (?, ?, ?, ?, ?, ?, NULL)`
  ).run(crypto.randomUUID(), characterId, itemId, quantity, status, location)
}

/** Lê o inventário de um personagem do jeito que o mundo o enxerga. */
const inventoryOf = (characterId: string): Array<{ item_id: string; quantity: number }> =>
  db
    .prepare(
      `SELECT item_id, SUM(COALESCE(quantity, 1)) AS quantity
         FROM character_equipment WHERE character_id = ? GROUP BY item_id`
    )
    .all(characterId) as Array<{ item_id: string; quantity: number }>

/** Estado cru das confirmações da oferta. */
const offerFlags = (offerId: string): { proposer: number; recipient: number } =>
  db
    .prepare(
      `SELECT proposer_confirmed AS proposer, recipient_confirmed AS recipient
         FROM trade_offers WHERE id = ?`
    )
    .get(offerId) as { proposer: number; recipient: number }

/** Atalho: cria uma oferta de transferência de uma espada. */
const makeOffer = async (): Promise<string> => {
  addItem(PROPOSER, ITEM_SWORD, 1)
  const create = new useCases.CreateTradeOfferUseCase(repo, access)
  const created = await create.execute({
    actorId: USER_PROPOSER,
    proposerCharacterId: PROPOSER,
    recipientCharacterId: RECIPIENT,
    from: [{ item_id: ITEM_SWORD, quantity: 1 }],
    to: [],
  })
  return created.offer.id
}

before(() => {
  originalCwd = process.cwd()
  workDir = mkdtempSync(join(tmpdir(), 'vkrpg-trade-'))
  process.chdir(workDir)

  // A conexão que o repositório usa (abre `database.sqlite` na pasta de
  // trabalho): o teste enxerga exatamente o que o repositório grava.
  db = require('../../../infra/database/database').db
  db.exec(SCHEMA)

  TradeRepository = require('../../../domain/repositories/TradeRepository').TradeRepository
  useCases = require('./TradeUseCases')
  repo = new TradeRepository()
  access = {
    findTableOwnerUserId: async (tableId: string) =>
      tableId === TABLE_ID ? USER_NARRATOR : null,
  }
})

beforeEach(() => {
  resetWorld()
})

after(() => {
  db?.close()
  process.chdir(originalCwd)
  if (workDir) rmSync(workDir, { recursive: true, force: true })
})

describe('Trade use cases', () => {
  describe('CreateTradeOfferUseCase', () => {
    it('cria a oferta com as duas mãos e o proponente já confirmado', async () => {
      addItem(PROPOSER, ITEM_SWORD, 1)
      const useCase = new useCases.CreateTradeOfferUseCase(repo, access)

      const result = await useCase.execute({
        actorId: USER_PROPOSER,
        proposerCharacterId: PROPOSER,
        recipientCharacterId: RECIPIENT,
        from: [{ item_id: ITEM_SWORD, quantity: 1 }],
        to: [],
      })

      assert.strictEqual(result.offer.status, 'pending')
      assert.strictEqual(result.offer.from.length, 1)
      assert.strictEqual(result.offer.to.length, 0)
      assert.strictEqual(result.offer.proposer_confirmed, true)
      assert.strictEqual(result.offer.recipient_confirmed, false)
      assert.strictEqual(result.role, 'proposer')
    })

    it('recusa oferta sem nenhum item do proponente', async () => {
      const useCase = new useCases.CreateTradeOfferUseCase(repo, access)
      await assert.rejects(
        () =>
          useCase.execute({
            actorId: USER_PROPOSER,
            proposerCharacterId: PROPOSER,
            recipientCharacterId: RECIPIENT,
            from: [],
            to: [{ item_id: ITEM_CAPE, quantity: 1 }],
          }),
        /pelo menos um item/i
      )
    })

    it('recusa quando o ator não é dono do personagem que faz a proposta', async () => {
      const useCase = new useCases.CreateTradeOfferUseCase(repo, access)
      await assert.rejects(
        () =>
          useCase.execute({
            actorId: USER_RECIPIENT,
            proposerCharacterId: PROPOSER,
            recipientCharacterId: RECIPIENT,
            from: [{ item_id: ITEM_SWORD, quantity: 1 }],
            to: [],
          }),
        /seus personagens/i
      )
    })

    it('recusa troca entre mesas diferentes', async () => {
      const useCase = new useCases.CreateTradeOfferUseCase(repo, access)
      await assert.rejects(
        () =>
          useCase.execute({
            actorId: USER_PROPOSER,
            proposerCharacterId: PROPOSER,
            recipientCharacterId: STRANGER,
            from: [{ item_id: ITEM_SWORD, quantity: 1 }],
            to: [],
          }),
        /mesma mesa/i
      )
    })

    it('recusa quando o proponente não tem o que promete', async () => {
      const useCase = new useCases.CreateTradeOfferUseCase(repo, access)
      await assert.rejects(
        () =>
          useCase.execute({
            actorId: USER_PROPOSER,
            proposerCharacterId: PROPOSER,
            recipientCharacterId: RECIPIENT,
            from: [{ item_id: ITEM_CAPE, quantity: 1 }],
            to: [],
          }),
        /não tem/i
      )
    })

    it('recusa NPC de participar', async () => {
      const useCase = new useCases.CreateTradeOfferUseCase(repo, access)
      await assert.rejects(
        () =>
          useCase.execute({
            actorId: USER_PROPOSER,
            proposerCharacterId: PROPOSER,
            recipientCharacterId: NPC,
            from: [{ item_id: ITEM_SWORD, quantity: 1 }],
            to: [],
          }),
        /NPC/i
      )
    })
  })

  describe('ConfirmTradeOfferUseCase', () => {
    it('muda de dono quando as duas partes confirmam', async () => {
      const offerId = await makeOffer()
      const confirm = new useCases.ConfirmTradeOfferUseCase(repo, access)

      const first = await confirm.execute({
        actorId: USER_PROPOSER,
        offerId,
        characterId: PROPOSER,
      })
      assert.strictEqual(first.executed, false)
      assert.strictEqual(first.offer.proposer_confirmed, true)

      const second = await confirm.execute({
        actorId: USER_RECIPIENT,
        offerId,
        characterId: RECIPIENT,
      })
      assert.strictEqual(second.executed, true)
      assert.strictEqual(second.offer.status, 'completed')

      const proposerItems = inventoryOf(PROPOSER).find((i) => i.item_id === ITEM_SWORD)
      const recipientItems = inventoryOf(RECIPIENT).find((i) => i.item_id === ITEM_SWORD)
      assert.strictEqual(proposerItems?.quantity ?? 0, 0)
      assert.strictEqual(recipientItems?.quantity ?? 0, 1)
    })

    it('recusa confirmar oferta de personagem que não é do ator', async () => {
      const offerId = await makeOffer()
      const confirm = new useCases.ConfirmTradeOfferUseCase(repo, access)
      await assert.rejects(
        () => confirm.execute({ actorId: USER_PROPOSER, offerId, characterId: RECIPIENT }),
        /seus personagens/i
      )
    })
  })

  describe('EditTradeOfferUseCase', () => {
    it('zera a confirmação do outro lado quando os termos mudam', async () => {
      addItem(PROPOSER, ITEM_CAPE, 1)
      addItem(RECIPIENT, ITEM_COIN, 10)
      const create = new useCases.CreateTradeOfferUseCase(repo, access)
      const created = await create.execute({
        actorId: USER_PROPOSER,
        proposerCharacterId: PROPOSER,
        recipientCharacterId: RECIPIENT,
        from: [{ item_id: ITEM_CAPE, quantity: 1 }],
        to: [{ item_id: ITEM_COIN, quantity: 5 }],
      })
      // A proposta já conta como confirmação do proponente.
      assert.deepStrictEqual(offerFlags(created.offer.id), { proposer: 1, recipient: 0 })

      const edit = new useCases.EditTradeOfferUseCase(repo, access)

      // O destinatário contra-oferta: ele fica confirmado, o proponente não.
      await edit.execute({
        actorId: USER_RECIPIENT,
        offerId: created.offer.id,
        characterId: RECIPIENT,
        side: 'to',
        items: [{ item_id: ITEM_COIN, quantity: 8 }],
      })
      assert.deepStrictEqual(offerFlags(created.offer.id), { proposer: 0, recipient: 1 })

      // O proponente muda a própria mão: a concordância do destinatário cai.
      addItem(PROPOSER, ITEM_SWORD, 1)
      await edit.execute({
        actorId: USER_PROPOSER,
        offerId: created.offer.id,
        characterId: PROPOSER,
        side: 'from',
        items: [{ item_id: ITEM_SWORD, quantity: 1 }],
      })
      assert.deepStrictEqual(offerFlags(created.offer.id), { proposer: 1, recipient: 0 })
    })

    it('não deixa o destinatário editar a mão do proponente', async () => {
      addItem(PROPOSER, ITEM_CAPE, 1)
      const create = new useCases.CreateTradeOfferUseCase(repo, access)
      const created = await create.execute({
        actorId: USER_PROPOSER,
        proposerCharacterId: PROPOSER,
        recipientCharacterId: RECIPIENT,
        from: [{ item_id: ITEM_CAPE, quantity: 1 }],
        to: [],
      })

      const edit = new useCases.EditTradeOfferUseCase(repo, access)
      await assert.rejects(
        () =>
          edit.execute({
            actorId: USER_RECIPIENT,
            offerId: created.offer.id,
            characterId: RECIPIENT,
            side: 'from',
            items: [{ item_id: ITEM_CAPE, quantity: 1 }],
          }),
        /própria mão/i
      )
    })

    it('não deixa o proponente prometer o que não tem', async () => {
      const create = new useCases.CreateTradeOfferUseCase(repo, access)
      addItem(PROPOSER, ITEM_CAPE, 1)
      const created = await create.execute({
        actorId: USER_PROPOSER,
        proposerCharacterId: PROPOSER,
        recipientCharacterId: RECIPIENT,
        from: [{ item_id: ITEM_CAPE, quantity: 1 }],
        to: [],
      })

      const edit = new useCases.EditTradeOfferUseCase(repo, access)
      await assert.rejects(
        () =>
          edit.execute({
            actorId: USER_PROPOSER,
            offerId: created.offer.id,
            characterId: PROPOSER,
            side: 'from',
            items: [{ item_id: ITEM_SWORD, quantity: 1 }],
          }),
        /não tem/i
      )
    })
  })

  describe('Execute (repositório)', () => {
    it('move a quantidade certa e apaga a linha zerada', async () => {
      addItem(PROPOSER, ITEM_COIN, 3)
      const create = new useCases.CreateTradeOfferUseCase(repo, access)
      const created = await create.execute({
        actorId: USER_PROPOSER,
        proposerCharacterId: PROPOSER,
        recipientCharacterId: RECIPIENT,
        from: [{ item_id: ITEM_COIN, quantity: 2 }],
        to: [],
      })

      const confirm = new useCases.ConfirmTradeOfferUseCase(repo, access)
      await confirm.execute({
        actorId: USER_PROPOSER,
        offerId: created.offer.id,
        characterId: PROPOSER,
      })
      const settled = await confirm.execute({
        actorId: USER_RECIPIENT,
        offerId: created.offer.id,
        characterId: RECIPIENT,
      })
      assert.strictEqual(settled.executed, true)

      const proposerCoins = inventoryOf(PROPOSER).find((i) => i.item_id === ITEM_COIN)
      const recipientCoins = inventoryOf(RECIPIENT).find((i) => i.item_id === ITEM_COIN)
      assert.strictEqual(proposerCoins?.quantity, 1)
      assert.strictEqual(recipientCoins?.quantity, 2)
    })

    it('soma na linha de inventário que já existe no destino', async () => {
      addItem(PROPOSER, ITEM_COIN, 2)
      addItem(RECIPIENT, ITEM_COIN, 5)
      const create = new useCases.CreateTradeOfferUseCase(repo, access)
      const created = await create.execute({
        actorId: USER_PROPOSER,
        proposerCharacterId: PROPOSER,
        recipientCharacterId: RECIPIENT,
        from: [{ item_id: ITEM_COIN, quantity: 2 }],
        to: [],
      })

      const confirm = new useCases.ConfirmTradeOfferUseCase(repo, access)
      await confirm.execute({
        actorId: USER_PROPOSER,
        offerId: created.offer.id,
        characterId: PROPOSER,
      })
      await confirm.execute({
        actorId: USER_RECIPIENT,
        offerId: created.offer.id,
        characterId: RECIPIENT,
      })

      const recipientCoins = inventoryOf(RECIPIENT).find((i) => i.item_id === ITEM_COIN)
      assert.strictEqual(recipientCoins?.quantity, 7)
      const lines = db
        .prepare(`SELECT COUNT(*) AS c FROM character_equipment WHERE character_id = ? AND item_id = ?`)
        .get(RECIPIENT, ITEM_COIN) as { c: number }
      assert.strictEqual(lines.c, 1)
    })

    it('desfaz tudo quando a posse muda no meio do caminho', async () => {
      const offerId = await makeOffer()
      const confirm = new useCases.ConfirmTradeOfferUseCase(repo, access)
      await confirm.execute({ actorId: USER_PROPOSER, offerId, characterId: PROPOSER })

      // O item some do proponente entre a confirmação e a execução.
      db.prepare(`DELETE FROM character_equipment WHERE character_id = ? AND item_id = ?`)
        .run(PROPOSER, ITEM_SWORD)

      await assert.rejects(
        () => confirm.execute({ actorId: USER_RECIPIENT, offerId, characterId: RECIPIENT }),
        /não tem mais/i
      )

      // A oferta continua pendente e sem confirmações: dá para renegociar.
      assert.deepStrictEqual(offerFlags(offerId), { proposer: 0, recipient: 0 })
      const recipientItems = inventoryOf(RECIPIENT).find((i) => i.item_id === ITEM_SWORD)
      assert.strictEqual(recipientItems?.quantity ?? 0, 0)
    })

    it('troca os dois lados: cada um dá o que tem', async () => {
      addItem(PROPOSER, ITEM_SWORD, 1)
      addItem(RECIPIENT, ITEM_CAPE, 1)
      const create = new useCases.CreateTradeOfferUseCase(repo, access)
      const created = await create.execute({
        actorId: USER_PROPOSER,
        proposerCharacterId: PROPOSER,
        recipientCharacterId: RECIPIENT,
        from: [{ item_id: ITEM_SWORD, quantity: 1 }],
        to: [{ item_id: ITEM_CAPE, quantity: 1 }],
      })

      const confirm = new useCases.ConfirmTradeOfferUseCase(repo, access)
      await confirm.execute({
        actorId: USER_PROPOSER,
        offerId: created.offer.id,
        characterId: PROPOSER,
      })
      await confirm.execute({
        actorId: USER_RECIPIENT,
        offerId: created.offer.id,
        characterId: RECIPIENT,
      })

      const proposerHas = inventoryOf(PROPOSER).map((i) => i.item_id)
      const recipientHas = inventoryOf(RECIPIENT).map((i) => i.item_id)
      assert.ok(!proposerHas.includes(ITEM_SWORD))
      assert.ok(proposerHas.includes(ITEM_CAPE))
      assert.ok(recipientHas.includes(ITEM_SWORD))
      assert.ok(!recipientHas.includes(ITEM_CAPE))
    })

    it('mesmo item nos dois lados não move nada', async () => {
      addItem(PROPOSER, ITEM_SWORD, 2)
      addItem(RECIPIENT, ITEM_SWORD, 1)
      const create = new useCases.CreateTradeOfferUseCase(repo, access)
      const created = await create.execute({
        actorId: USER_PROPOSER,
        proposerCharacterId: PROPOSER,
        recipientCharacterId: RECIPIENT,
        from: [{ item_id: ITEM_SWORD, quantity: 1 }],
        to: [{ item_id: ITEM_SWORD, quantity: 1 }],
      })

      const confirm = new useCases.ConfirmTradeOfferUseCase(repo, access)
      await confirm.execute({
        actorId: USER_PROPOSER,
        offerId: created.offer.id,
        characterId: PROPOSER,
      })
      const settled = await confirm.execute({
        actorId: USER_RECIPIENT,
        offerId: created.offer.id,
        characterId: RECIPIENT,
      })
      assert.strictEqual(settled.executed, true)

      // Uma espada por uma espada: cada um continua com a mesma quantidade.
      assert.strictEqual(inventoryOf(PROPOSER).find((i) => i.item_id === ITEM_SWORD)?.quantity, 2)
      assert.strictEqual(inventoryOf(RECIPIENT).find((i) => i.item_id === ITEM_SWORD)?.quantity, 1)
    })

    it('saldo líquido: só o excedente muda de mão', async () => {
      addItem(PROPOSER, ITEM_SWORD, 3)
      addItem(RECIPIENT, ITEM_SWORD, 1)
      const create = new useCases.CreateTradeOfferUseCase(repo, access)
      const created = await create.execute({
        actorId: USER_PROPOSER,
        proposerCharacterId: PROPOSER,
        recipientCharacterId: RECIPIENT,
        from: [{ item_id: ITEM_SWORD, quantity: 2 }],
        to: [{ item_id: ITEM_SWORD, quantity: 1 }],
      })

      const confirm = new useCases.ConfirmTradeOfferUseCase(repo, access)
      await confirm.execute({
        actorId: USER_PROPOSER,
        offerId: created.offer.id,
        characterId: PROPOSER,
      })
      await confirm.execute({
        actorId: USER_RECIPIENT,
        offerId: created.offer.id,
        characterId: RECIPIENT,
      })

      // 3 - 2 + 1 = 2 para o proponente; 1 - 1 + 2 = 2 para o destinatário.
      assert.strictEqual(inventoryOf(PROPOSER).find((i) => i.item_id === ITEM_SWORD)?.quantity, 2)
      assert.strictEqual(inventoryOf(RECIPIENT).find((i) => i.item_id === ITEM_SWORD)?.quantity, 2)
    })
  })

  describe('RejectTradeOfferUseCase', () => {
    it('o destinatário recusa e a oferta fica recusada', async () => {
      const offerId = await makeOffer()
      const reject = new useCases.RejectTradeOfferUseCase(repo, access)
      const result = await reject.execute({
        actorId: USER_RECIPIENT,
        offerId,
        characterId: RECIPIENT,
      })
      assert.strictEqual(result.offer.status, 'rejected')
    })

    it('o proponente não recusa (ele cancela)', async () => {
      const offerId = await makeOffer()
      const reject = new useCases.RejectTradeOfferUseCase(repo, access)
      await assert.rejects(
        () => reject.execute({ actorId: USER_PROPOSER, offerId, characterId: PROPOSER }),
        /destinatário/i
      )
    })
  })

  describe('CancelTradeOfferUseCase', () => {
    it('o narrador cancela uma oferta pendente', async () => {
      const offerId = await makeOffer()
      const cancel = new useCases.CancelTradeOfferUseCase(repo, access)
      const result = await cancel.execute({ actorId: USER_NARRATOR, offerId })
      assert.strictEqual(result.offer.status, 'cancelled')
    })

    it('o narrador não confirma por um jogador', async () => {
      const offerId = await makeOffer()
      const confirm = new useCases.ConfirmTradeOfferUseCase(repo, access)
      await assert.rejects(
        () => confirm.execute({ actorId: USER_NARRATOR, offerId, characterId: RECIPIENT }),
        /seus personagens/i
      )
    })
  })
})
