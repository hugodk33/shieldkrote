import type { ILocationShopRepository } from '../irepositories/ILocationShopRepository'
import { db } from '../../infra/database/database'
import type {
  LocationShop,
  LocationShopEntry,
  LocationShopEntryInput,
  LocationShopItem,
  LocationShopLine,
} from '../types/LocationShop'

/**
 * Lojas por local.
 *
 * O estoque NÃO é uma tabela própria: a prateleira é o próprio item do
 * catálogo apontado para o local (`game_table_items.location_id`). Por isso
 * `findLines` parte do item e faz LEFT JOIN da entrada de loja, que só
 * carrega o que a loja define por cima do item (preço, estoque, observações).
 *
 * Itens ligados ao local sem entrada na loja continuam aparecendo — o
 * estoque é o conjunto do que está na prateleira, e a entrada só ajusta o
 * preço e a quantidade.
 */

type Row = Record<string, any>

const toItem = (row: Row): LocationShopItem => ({
  id: row.id,
  lang: row.lang ?? null,
  table_id: row.table_id ?? null,
  location_id: row.location_id ?? null,
  name: row.name ?? '',
  kind: row.kind ?? null,
  category: row.category ?? null,
  weight_lb: row.weight_lb ?? null,
  cost: row.cost ?? null,
  currency_item_id: row.currency_item_id ?? null,
  description: row.description ?? null,
  quality: row.quality ?? null,
  condition: row.condition ?? null,
})

export class LocationShopRepository implements ILocationShopRepository {
  async findShop(locationId: string): Promise<LocationShop | null> {
    const location: Row | undefined = db
      .prepare(
        `SELECT id, lang, table_id, shop_name, description
         FROM table_locations
         WHERE id = ?
         LIMIT 1`
      )
      .get(locationId) as Row | undefined
    if (!location) return null

    return {
      location_id: location.id,
      table_id: location.table_id ?? null,
      name: location.shop_name ?? null,
      description: location.description ?? null,
      lang: location.lang ?? 'pt',
      lines: await this.findLines(locationId),
    }
  }

  async findLines(locationId: string): Promise<LocationShopLine[]> {
    const rows = db
      .prepare(
        `SELECT
           i.*,
           e.id AS entry_id,
           e.price AS entry_price,
           e.stock AS entry_stock,
           e.notes AS entry_notes
         FROM game_table_items i
         LEFT JOIN location_shop_items e
           ON e.item_id = i.id
          AND e.location_id = i.location_id
          AND e.lang = i.lang
         WHERE i.location_id = ?
         ORDER BY i.name COLLATE NOCASE ASC`
      )
      .all(locationId) as Row[]

    return rows.map((row) => ({
      item: toItem(row),
      entry_id: row.entry_id ?? null,
      price: row.entry_id ? (row.entry_price ?? null) : null,
      stock: row.entry_id ? (row.entry_stock ?? -1) : -1,
      notes: row.entry_id ? (row.entry_notes ?? null) : null,
    }))
  }

  async upsertEntry(
    input: LocationShopEntryInput & { table_id?: string | null; lang?: string }
  ): Promise<LocationShopEntry> {
    const lang = input.lang ?? 'pt'
    const price = input.price ?? null
    const stock = input.stock ?? -1
    const notes = input.notes ?? null

    const existing: Row | undefined = db
      .prepare(
        `SELECT id FROM location_shop_items
         WHERE location_id = ? AND item_id = ? AND lang = ?
         LIMIT 1`
      )
      .get(input.location_id, input.item_id, lang) as Row | undefined

    if (existing) {
      db.prepare(
        `UPDATE location_shop_items
         SET price = ?, stock = ?, notes = ?, table_id = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND lang = ?`
      ).run(price, stock, notes, input.table_id ?? null, existing.id, lang)
    } else {
      db.prepare(
        `INSERT INTO location_shop_items
           (id, lang, table_id, location_id, item_id, price, stock, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      ).run(
        crypto.randomUUID(),
        lang,
        input.table_id ?? null,
        input.location_id,
        input.item_id,
        price,
        stock,
        notes
      )
    }

    const row: Row | undefined = db
      .prepare(
        `SELECT * FROM location_shop_items
         WHERE location_id = ? AND item_id = ? AND lang = ?
         LIMIT 1`
      )
      .get(input.location_id, input.item_id, lang) as Row | undefined

    return {
      id: row!.id,
      lang: row!.lang,
      table_id: row!.table_id ?? null,
      location_id: row!.location_id,
      item_id: row!.item_id,
      price: row!.price ?? null,
      stock: row!.stock ?? -1,
      notes: row!.notes ?? null,
      created_at: row!.created_at ?? null,
      updated_at: row!.updated_at ?? null,
    }
  }

  async removeEntry(locationId: string, itemId: string): Promise<void> {
    db.prepare(
      `DELETE FROM location_shop_items WHERE location_id = ? AND item_id = ?`
    ).run(locationId, itemId)
  }

  async findItem(itemId: string): Promise<LocationShopItem | null> {
    const row: Row | undefined = db
      .prepare(`SELECT * FROM game_table_items WHERE id = ? LIMIT 1`)
      .get(itemId) as Row | undefined
    return row ? toItem(row) : null
  }

  async bindItemToLocation(itemId: string, locationId: string): Promise<void> {
    db.prepare(`UPDATE game_table_items SET location_id = ? WHERE id = ?`).run(locationId, itemId)
  }

  async unbindItem(itemId: string): Promise<void> {
    db.prepare(`UPDATE game_table_items SET location_id = NULL WHERE id = ?`).run(itemId)
  }
}
