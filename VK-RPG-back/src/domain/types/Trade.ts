/**
 * Troca entre dois jogadores da mesma mesa.
 *
 * Uma oferta carrega DUAS mãos: `from` (o que o proponente dá) e `to` (o que o
 * destinatário dá). A forma da mão é o que define a operação:
 *
 *   from=[item],  to=[]           -> transferência (presente)
 *   from=[item],  to=[moeda]      -> venda
 *   from=[moeda], to=[item]       -> compra
 *   from=[itemA], to=[itemB]      -> troca
 *
 * A oferta só EXECUTA quando as DUAS partes confirmam. Quem edita os termos
 * zera a confirmação do outro lado — quem mudou a proposta precisa da concord
 * expressa de quem vai aceitar.
 */

/** Erro de regra de negócio de troca, com o status HTTP pronto para o controller. */
export class TradeError extends Error {
  readonly status: number
  constructor(message: string, status = 400) {
    super(message)
    this.name = 'TradeError'
    this.status = status
  }
}

export const TradeStatus = {
  /** Esperando confirmação das duas partes. */
  Pending: 'pending',
  /** As duas partes confirmaram e os itens já mudaram de dono. */
  Completed: 'completed',
  /** A parte destinatária recusou. */
  Rejected: 'rejected',
  /** A parte proponente ou o narrador retirou a oferta. */
  Cancelled: 'cancelled',
} as const

export type TradeStatusValue = (typeof TradeStatus)[keyof typeof TradeStatus]

export const TradeSide = {
  /** O que o proponente dá. */
  From: 'from',
  /** O que o destinatário dá. */
  To: 'to',
} as const

export type TradeSideValue = (typeof TradeSide)[keyof typeof TradeSide]

export const TRADE_STATUSES: TradeStatusValue[] = [
  TradeStatus.Pending,
  TradeStatus.Completed,
  TradeStatus.Rejected,
  TradeStatus.Cancelled,
]

export const isTradeStatus = (raw: unknown): raw is TradeStatusValue =>
  typeof raw === 'string' && (TRADE_STATUSES as string[]).includes(raw)

export const isTradeSide = (raw: unknown): raw is TradeSideValue =>
  raw === TradeSide.From || raw === TradeSide.To

/** Uma linha de item dentro de uma oferta. */
export interface TradeOfferItem {
  id: string
  offer_id: string
  side: TradeSideValue
  item_id: string
  item_name: string | null
  quantity: number
}

/** Uma oferta completa, com as duas mãos já preenchidas. */
export interface TradeOffer {
  id: string
  table_id: string
  proposer_character_id: string
  recipient_character_id: string
  status: TradeStatusValue
  proposer_confirmed: boolean
  recipient_confirmed: boolean
  message: string | null
  created_at: string | null
  updated_at: string | null
  resolved_at: string | null
  items: TradeOfferItem[]
  /** A mão do proponente (o que ele dá). */
  from: TradeOfferItem[]
  /** A mão do destinatário (o que ele dá). */
  to: TradeOfferItem[]
  /** Nome do personagem de cada lado (para a UI não precisar de JOIN). */
  proposer_name: string | null
  recipient_name: string | null
}

/** Item e quantidade que uma parte oferece. */
export interface TradeItemInput {
  item_id: string
  quantity: number
}

/** Papéis que um personagem pode ter numa oferta. */
export const TradeRole = {
  Proposer: 'proposer',
  Recipient: 'recipient',
} as const

export type TradeRoleValue = (typeof TradeRole)[keyof typeof TradeRole]

/** Oferta vista por um ator: inclui o papel dele dentro da oferta. */
export interface TradeOfferView extends TradeOffer {
  /** Papel do ator nesta oferta; `null` quando ele não participa. */
  role: TradeRoleValue | null
}

/** Personagem como a troca o enxerga: dono, mesa, estado e se é NPC. */
export interface TradeCharacter {
  id: string
  user_id: string | null
  table_id: string
  is_active: boolean
  is_npc: boolean
}

/** Uma linha do inventário com a quantidade somada. */
export interface TradeCharacterItem {
  item_id: string
  quantity: number
}
