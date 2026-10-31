import type { ITradeRepository } from '../irepositories/ITradeRepository'
import { db } from '../../infra/database/database'
import { assertCharacterNotMuted } from './playerMuteGuard'
import {
  TradeError,
  TradeRole,
  TradeSide,
  TradeStatus,
  isTradeSide,
  type TradeCharacter,
  type TradeCharacterItem,
  type TradeItemInput,
  type TradeOffer,
  type TradeOfferItem,
  type TradeRoleValue,
  type TradeSideValue,
  type TradeStatusValue,
} from '../types/Trade'

/**
 * Trocas entre jogadores.
 *
 * Duas coisas FEBEM aqui e não no use case:
 *
 *  1. A TRANSAÇÃO. A mudança de dono de um item é tudo-ou-nada — trocar a
 *     espada e falhar na moeda deixaria o mundo inconsistente.
 *  2. A CONTA DE QUANTIDADE. `character_equipment` não tem unicidade em
 *     (character_id, item_id): o mesmo item pode estar em várias linhas. Por
 *     isso a posse é a SOMA das linhas e a saída dobra um item por vez até
 *     agotar. (O `moveEquipmentStash` legado só olha a primeira linha — não
 *     serve aqui.)
 */

/**
 * Silenciar um jogador congela as AÇÕES dele na sessão (postar ação, enfileirar,
 * encerrar turno) — o equipamento que ele carrega continua sendo dele. Por isso
 * a troca NÃO passa por `assertCharacterNotMuted`, igual a
 * `transferGameCharacterEquipment` e `sellGameCharacterEquipment`. Virar aqui é
 * uma linha: o guarda está em `assertMutedAllows`.
 */
const MUTE_BLOCKS_TRADE = false

const assertMutedAllows = (characterId: string): void => {
  if (!MUTE_BLOCKS_TRADE) return
  assertCharacterNotMuted(characterId)
}

type RawOfferRow = {
  id: string
  table_id: string
  proposer_character_id: string
  recipient_character_id: string
  status: string
  proposer_confirmed: number
  recipient_confirmed: number
  message: string | null
  created_at: string | null
  updated_at: string | null
  resolved_at: string | null
}

type RawItemRow = {
  id: string
  offer_id: string
  side: string
  item_id: string
  item_name: string | null
  quantity: number
}

/** Nome do personagem: `game_table_character_sheets` tem uma linha por idioma. */
const characterName = (characterId: string): string | null => {
  const row = db
    .prepare(
      `SELECT name
         FROM game_table_character_sheets
        WHERE character_id = ?
        ORDER BY CASE lang WHEN 'pt' THEN 0 ELSE 1 END, lang
        LIMIT 1`
    )
    .get(characterId) as { name?: string } | undefined
  return row?.name ?? null
}

const SELECT_OFFER = `
  SELECT
    o.id,
    o.table_id,
    o.proposer_character_id,
    o.recipient_character_id,
    o.status,
    o.proposer_confirmed,
    o.recipient_confirmed,
    o.message,
    o.created_at,
    o.updated_at,
    o.resolved_at
  FROM trade_offers o
`

/**
 * Nome do item: `game_table_items` também tem chave (id, lang), então o nome
 * vem por subconsulta — um JOIN normal duplicaria a linha.
 */
const itemNameFor = (itemId: string): string | null => {
  const row = db
    .prepare(
      `SELECT name
         FROM game_table_items
        WHERE id = ?
        ORDER BY CASE lang WHEN 'pt' THEN 0 ELSE 1 END, lang
        LIMIT 1`
    )
    .get(itemId) as { name?: string } | undefined
  return row?.name ?? null
}

const normalizeStatus = (raw: string): TradeStatusValue =>
  raw === TradeStatus.Completed
    ? TradeStatus.Completed
    : raw === TradeStatus.Rejected
      ? TradeStatus.Rejected
      : raw === TradeStatus.Cancelled
        ? TradeStatus.Cancelled
        : TradeStatus.Pending

const toItem = (row: RawItemRow): TradeOfferItem => ({
  id: row.id,
  offer_id: row.offer_id,
  side: isTradeSide(row.side) ? row.side : TradeSide.From,
  item_id: row.item_id,
  item_name: row.item_name,
  quantity: row.quantity ?? 1,
})

const toOffer = (row: RawOfferRow, items: TradeOfferItem[]): TradeOffer => ({
  id: row.id,
  table_id: row.table_id,
  proposer_character_id: row.proposer_character_id,
  recipient_character_id: row.recipient_character_id,
  status: normalizeStatus(row.status),
  proposer_confirmed: Boolean(row.proposer_confirmed),
  recipient_confirmed: Boolean(row.recipient_confirmed),
  message: row.message,
  created_at: row.created_at,
  updated_at: row.updated_at,
  resolved_at: row.resolved_at,
  items,
  from: items.filter((item) => item.side === TradeSide.From),
  to: items.filter((item) => item.side === TradeSide.To),
  proposer_name: characterName(row.proposer_character_id),
  recipient_name: characterName(row.recipient_character_id),
})

export class TradeRepository implements ITradeRepository {
  private itemsOf(offerIds: string[]): Map<string, TradeOfferItem[]> {
    const map = new Map<string, TradeOfferItem[]>()
    if (offerIds.length === 0) return map
    const placeholders = offerIds.map(() => '?').join(',')
    const rows = db
      .prepare(
        `SELECT id, offer_id, side, item_id, item_name, quantity
           FROM trade_offer_items
          WHERE offer_id IN (${placeholders})
          ORDER BY rowid`
      )
      .all(...offerIds) as RawItemRow[]
    for (const row of rows) {
      const list = map.get(row.offer_id) ?? []
      list.push(toItem(row))
      map.set(row.offer_id, list)
    }
    return map
  }

  private hydrate(rows: RawOfferRow[]): TradeOffer[] {
    const items = this.itemsOf(rows.map((r) => r.id))
    return rows.map((row) => toOffer(row, items.get(row.id) ?? []))
  }

  async create(input: {
    id: string
    table_id: string
    proposer_character_id: string
    recipient_character_id: string
    message: string | null
    items: Array<TradeItemInput & { side: TradeSideValue }>
  }): Promise<TradeOffer> {
    const insertOffer = db.prepare(`
      INSERT INTO trade_offers (
        id, table_id, proposer_character_id, recipient_character_id,
        status, proposer_confirmed, recipient_confirmed, message,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'pending', 1, 0, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)
    const insertItem = db.prepare(`
      INSERT INTO trade_offer_items (id, offer_id, side, item_id, item_name, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const save = db.transaction(() => {
      insertOffer.run(
        input.id,
        input.table_id,
        input.proposer_character_id,
        input.recipient_character_id,
        input.message
      )
      for (const item of input.items) {
        insertItem.run(
          crypto.randomUUID(),
          input.id,
          item.side,
          item.item_id,
          itemNameFor(item.item_id),
          item.quantity
        )
      }
    })
    save()

    const offer = await this.findById(input.id)
    if (!offer) throw new TradeError('Não foi possível registrar a oferta.', 500)
    return offer
  }

  async findById(id: string): Promise<TradeOffer | null> {
    const row = db.prepare(`${SELECT_OFFER} WHERE o.id = ?`).get(id) as RawOfferRow | undefined
    if (!row) return null
    const items = this.itemsOf([row.id])
    return toOffer(row, items.get(row.id) ?? [])
  }

  async findByCharacter(characterId: string): Promise<TradeOffer[]> {
    const rows = db
      .prepare(
        `${SELECT_OFFER}
          WHERE o.proposer_character_id = ? OR o.recipient_character_id = ?
          ORDER BY o.created_at DESC`
      )
      .all(characterId, characterId) as RawOfferRow[]
    return this.hydrate(rows)
  }

  async findPendingByTable(tableId: string): Promise<TradeOffer[]> {
    const rows = db
      .prepare(
        `${SELECT_OFFER}
          WHERE o.table_id = ? AND o.status = 'pending'
          ORDER BY o.created_at DESC`
      )
      .all(tableId) as RawOfferRow[]
    return this.hydrate(rows)
  }

  async replaceSide(
    offerId: string,
    side: TradeSideValue,
    items: TradeItemInput[]
  ): Promise<TradeOffer | null> {
    const swap = db.transaction(() => {
      db.prepare(`DELETE FROM trade_offer_items WHERE offer_id = ? AND side = ?`).run(offerId, side)
      const insert = db.prepare(`
        INSERT INTO trade_offer_items (id, offer_id, side, item_id, item_name, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const item of items) {
        insert.run(
          crypto.randomUUID(),
          offerId,
          side,
          item.item_id,
          itemNameFor(item.item_id),
          item.quantity
        )
      }
      db.prepare(`UPDATE trade_offers SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(offerId)
    })
    swap()
    return this.findById(offerId)
  }

  /**
   * Troca a mão e reescreve as confirmações: quem editou fica confirmado e o
   * outro precisa concordar de novo — os termos mudaram, a concordância antiga
   * não vale mais.
   */
  async applyEdit(input: {
    offer_id: string
    side: TradeSideValue
    items: TradeItemInput[]
    editor: TradeRoleValue
  }): Promise<TradeOffer | null> {
    const editorColumn = input.editor === TradeRole.Proposer ? 'proposer_confirmed' : 'recipient_confirmed'
    const otherColumn = input.editor === TradeRole.Proposer ? 'recipient_confirmed' : 'proposer_confirmed'

    const edit = db.transaction(() => {
      db.prepare(`DELETE FROM trade_offer_items WHERE offer_id = ? AND side = ?`).run(
        input.offer_id,
        input.side
      )
      const insert = db.prepare(`
        INSERT INTO trade_offer_items (id, offer_id, side, item_id, item_name, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const item of input.items) {
        insert.run(
          crypto.randomUUID(),
          input.offer_id,
          input.side,
          item.item_id,
          itemNameFor(item.item_id),
          item.quantity
        )
      }
      db.prepare(
        `UPDATE trade_offers
            SET ${editorColumn} = 1, ${otherColumn} = 0, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
      ).run(input.offer_id)
    })
    edit()

    return this.findById(input.offer_id)
  }

  async setConfirmed(
    offerId: string,
    side: TradeSideValue,
    confirmed: boolean
  ): Promise<TradeOffer | null> {
    const column = side === TradeSide.From ? 'proposer_confirmed' : 'recipient_confirmed'
    db.prepare(
      `UPDATE trade_offers SET ${column} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).run(confirmed ? 1 : 0, offerId)
    return this.findById(offerId)
  }

  async setStatus(offerId: string, status: TradeStatusValue): Promise<TradeOffer | null> {
    db.prepare(
      `UPDATE trade_offers
          SET status = ?, updated_at = CURRENT_TIMESTAMP,
              resolved_at = CASE WHEN ? = 'pending' THEN NULL ELSE CURRENT_TIMESTAMP END
        WHERE id = ?`
    ).run(status, status, offerId)
    return this.findById(offerId)
  }

  async findCharacter(characterId: string): Promise<TradeCharacter | null> {
    const row = db
      .prepare(`SELECT id, user_id, table_id, is_active FROM game_table_characters WHERE id = ?`)
      .get(characterId) as
      | { id: string; user_id: string | null; table_id: string; is_active: number }
      | undefined
    if (!row) return null
    const npc = db
      .prepare(`SELECT 1 AS ok FROM game_table_npcs WHERE character_id = ? LIMIT 1`)
      .get(characterId)
    return {
      id: row.id,
      user_id: row.user_id,
      table_id: row.table_id,
      is_active: row.is_active === 1,
      is_npc: Boolean(npc),
    }
  }

  async findCharacterItems(characterId: string): Promise<TradeCharacterItem[]> {
    const rows = db
      .prepare(
        `SELECT item_id, SUM(COALESCE(quantity, 1)) AS quantity
           FROM character_equipment
          WHERE character_id = ?
          GROUP BY item_id`
      )
      .all(characterId) as Array<{ item_id: string; quantity: number }>
    return rows.map((row) => ({ item_id: row.item_id, quantity: row.quantity ?? 0 }))
  }

  /** Posse total de um item: soma das linhas do personagem. */
  private ownedQuantity(characterId: string, itemId: string): number {
    const row = db
      .prepare(
        `SELECT COALESCE(SUM(COALESCE(quantity, 1)), 0) AS qty
           FROM character_equipment
          WHERE character_id = ? AND item_id = ?`
      )
      .get(characterId, itemId) as { qty: number }
    return row?.qty ?? 0
  }

  /**
   * Retira `qty` unidades do personagem, linha por linha até agotar.
   * A linha que zera é apagada (o item sai do equipamento); a que sobra
   * mantém o próprio status (quem está empunhando 2 adagas e entrega 1
   * continua empunhando 1).
   */
  private takeFrom(characterId: string, itemId: string, qty: number): void {
    const rows = db
      .prepare(
        `SELECT id, COALESCE(quantity, 1) AS quantity
           FROM character_equipment
          WHERE character_id = ? AND item_id = ?
          ORDER BY rowid`
      )
      .all(characterId, itemId) as Array<{ id: string; quantity: number }>

    let remaining = qty
    for (const row of rows) {
      if (remaining <= 0) break
      if (row.quantity <= remaining) {
        db.prepare(`DELETE FROM character_equipment WHERE id = ?`).run(row.id)
        remaining -= row.quantity
      } else {
        db.prepare(`UPDATE character_equipment SET quantity = ? WHERE id = ?`).run(
          row.quantity - remaining,
          row.id
        )
        remaining = 0
      }
    }
    if (remaining > 0) {
      throw new TradeError('A posse do item mudou antes de a troca fechar.', 409)
    }
  }

  /**
   * Entrega `qty` unidades ao personagem. Soma numa linha de inventário
   * existente; se não houver uma, cria uma nova. Uma linha equipada/wielded
   * NÃO é reaproveitada: o item recebido entra no inventário, sem virar a
   * empunhadura de quem recebe.
   */
  private giveTo(characterId: string, itemId: string, qty: number): void {
    const target = db
      .prepare(
        `SELECT id, COALESCE(quantity, 1) AS quantity
           FROM character_equipment
          WHERE character_id = ? AND item_id = ?
            AND status = 'in_inventory' AND location = 'none'
          ORDER BY rowid
          LIMIT 1`
      )
      .get(characterId, itemId) as { id: string; quantity: number } | undefined

    if (target) {
      db.prepare(`UPDATE character_equipment SET quantity = ? WHERE id = ?`).run(
        target.quantity + qty,
        target.id
      )
      return
    }
    db.prepare(
      `INSERT INTO character_equipment (id, character_id, item_id, quantity, status, location, rendered_st)
       VALUES (?, ?, ?, ?, 'in_inventory', 'none', NULL)`
    ).run(crypto.randomUUID(), characterId, itemId, qty)
  }

  async execute(offerId: string): Promise<TradeOffer> {
    const offer = await this.findById(offerId)
    if (!offer) throw new TradeError('Oferta não encontrada.', 404)
    if (offer.status !== TradeStatus.Pending) {
      throw new TradeError('Esta oferta já foi encerrada.', 409)
    }
    if (!offer.proposer_confirmed || !offer.recipient_confirmed) {
      throw new TradeError('As duas partes precisam confirmar a oferta.', 409)
    }

    // Quem dá o quê: 'from' sai do proponente, 'to' sai do destinatário.
    const from = offer.items.filter((i) => i.side === TradeSide.From)
    const to = offer.items.filter((i) => i.side === TradeSide.To)

    // Revalidação ANTES de mexer em qualquer item: mesa, posse e personagens.
    // Se algo não bate, as confirmações caem para que a oferta volte a ser
    // renegociável em vez de travar num estado impossível.
    try {
      for (const characterId of [offer.proposer_character_id, offer.recipient_character_id]) {
        const character = db
          .prepare(`SELECT id, table_id, user_id FROM game_table_characters WHERE id = ?`)
          .get(characterId) as
          | { id: string; table_id: string; user_id: string | null }
          | undefined
        if (!character) throw new TradeError('Um dos personagens não existe mais.', 409)
        if (character.table_id !== offer.table_id) {
          throw new TradeError('Um dos personagens não está mais nesta mesa.', 409)
        }
        if (!character.user_id) {
          throw new TradeError('Só personagens de jogadores podem trocar itens.', 409)
        }
        const isNpc = db
          .prepare(`SELECT 1 FROM game_table_npcs WHERE character_id = ? LIMIT 1`)
          .get(characterId)
        if (isNpc) {
          throw new TradeError('NPCs não participam de trocas entre jogadores.', 409)
        }
        assertMutedAllows(characterId)
      }

      for (const item of from) {
        if (this.ownedQuantity(offer.proposer_character_id, item.item_id) < item.quantity) {
          throw new TradeError(
            `O proponente não tem mais ${item.quantity}× ${item.item_name ?? item.item_id}.`,
            409
          )
        }
      }
      for (const item of to) {
        if (this.ownedQuantity(offer.recipient_character_id, item.item_id) < item.quantity) {
          throw new TradeError(
            `O destinatário não tem mais ${item.quantity}× ${item.item_name ?? item.item_id}.`,
            409
          )
        }
      }
    } catch (error) {
      // Devolve a oferta para "renegociável": as duas confirmações caem.
      db.prepare(
        `UPDATE trade_offers
            SET proposer_confirmed = 0, recipient_confirmed = 0, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
      ).run(offerId)
      throw error
    }

    const move = db.transaction(() => {
      // Saldo líquido por item: o que SOBRA de cada lado depois de descontar
      // o que o outro lado dá. Assim o MESMO item nos dois lados (troca de
      // uma espada por outra espada) não vira uma entrega e devolução: o
      // item simplesmente não se move e continua equipado como estava.
      const flow = new Map<string, { amount: number; item_name: string | null }>()
      const add = (itemId: string, amount: number, itemName: string | null): void => {
        const current = flow.get(itemId) ?? { amount: 0, item_name: itemName }
        current.amount += amount
        current.item_name = current.item_name ?? itemName
        flow.set(itemId, current)
      }
      for (const item of from) add(item.item_id, item.quantity, item.item_name)
      for (const item of to) add(item.item_id, -item.quantity, item.item_name)

      for (const [itemId, entry] of flow) {
        if (entry.amount === 0) continue
        if (entry.amount > 0) {
          // Sobrou do proponente: sai dele e entra no destinatário.
          this.takeFrom(offer.proposer_character_id, itemId, entry.amount)
          this.giveTo(offer.recipient_character_id, itemId, entry.amount)
        } else {
          // Sobrou do destinatário: sai dele e entra no proponente.
          const amount = Math.abs(entry.amount)
          this.takeFrom(offer.recipient_character_id, itemId, amount)
          this.giveTo(offer.proposer_character_id, itemId, amount)
        }
      }
      db.prepare(
        `UPDATE trade_offers
            SET status = 'completed', updated_at = CURRENT_TIMESTAMP, resolved_at = CURRENT_TIMESTAMP
          WHERE id = ?`
      ).run(offerId)
    })
    move()

    const settled = await this.findById(offerId)
    if (!settled) throw new TradeError('A troca foi executada, mas a oferta sumiu.', 500)
    return settled
  }
}
