import type { ITableAccessRepository } from '../../../domain/irepositories/ITableAccessRepository'
import type { ITradeRepository } from '../../../domain/irepositories/ITradeRepository'
import {
  TradeError,
  TradeRole,
  TradeSide,
  TradeStatus,
  isTradeSide,
  type TradeCharacter,
  type TradeItemInput,
  type TradeOffer,
  type TradeRoleValue,
  type TradeSideValue,
} from '../../../domain/types/Trade'

/**
 * Troca entre dois jogadores da mesma mesa.
 *
 * A oferta tem DUAS mãos e é a forma das mãos que diz o que está acontecendo:
 *
 *   from=[espada], to=[]            transferência (presente)
 *   from=[espada], to=[50 moedas]   venda
 *   from=[50 moedas], to=[espada]   compra
 *   from=[espada], to=[capa]        troca
 *
 * A oferta só EXECUTA com as DUAS confirmações. Quem edita os termos concorda
 * com o novo texto (a flag dele vai a 1) e DESFAZ a concordância do outro
 * (flag do outro vai a 0) — quem mudou a proposta precisa da concordância
 * expressa de quem vai aceitar.
 *
 * NOTA DE SEGURANÇA: como o resto do backend, não há autenticação de verdade.
 * O `actor` chega pela URL/body e é o id do DONO do personagem. São regras de
 * negócio ("esta oferta é sua?"), não segurança de verdade.
 */

export { TradeError }

/** Curto-circuito para "isto aqui é problema do cliente, não meu". */
const badRequest = (message: string, status = 400): TradeError => new TradeError(message, status)

/** Lê uma lista de itens do corpo, validando forma e quantidade. */
const readItems = (raw: unknown, label: string): TradeItemInput[] => {
  if (raw === undefined || raw === null) return []
  if (!Array.isArray(raw)) throw badRequest(`${label} deve ser uma lista de itens.`)
  return raw.map((entry, index) => {
    const item = (entry ?? {}) as Record<string, unknown>
    const itemId = typeof item.item_id === 'string' ? item.item_id.trim() : ''
    if (!itemId) throw badRequest(`${label}: item ${index + 1} está sem item_id.`)
    const quantity = Number(item.quantity ?? 1)
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw badRequest(`${label}: a quantidade de "${itemId}" tem de ser um inteiro maior que zero.`)
    }
    return { item_id: itemId, quantity }
  })
}

/**
 * Uma oferta vista por um ator: o papel dele na oferta (`role`) e os limites
 * do que ele pode fazer com ela.
 */
export interface TradeOfferContext {
  offer: TradeOffer
  role: TradeRoleValue | null
  /** O ator pode confirmar o lado dele. */
  canConfirm: boolean
  /** O ator pode editar a mão indicada. */
  canEditFrom: boolean
  canEditTo: boolean
  /** O ator pode recusar (destinatário) ou cancelar (proponente / narrador). */
  canReject: boolean
  canCancel: boolean
}

/** Carrega a oferta e monta o contexto de quem está agindo. */
const buildContext = (offer: TradeOffer, role: TradeRoleValue | null): TradeOfferContext => {
  const pending = offer.status === TradeStatus.Pending
  return {
    offer,
    role,
    canConfirm: pending && role !== null,
    // O proponente edita as DUAS mãos (é a proposta dele); o destinatário
    // edita só a própria — é a contra-proposta.
    canEditFrom: pending && role === TradeRole.Proposer,
    canEditTo: pending && role !== null,
    canReject: pending && role === TradeRole.Recipient,
    canCancel: pending && role === TradeRole.Proposer,
  }
}

export interface CreateTradeOfferInput {
  /** Quem está agindo: o id do dono do personagem. */
  actorId: string
  /** O personagem que faz a proposta. */
  proposerCharacterId: string
  /** O personagem que recebe a proposta. */
  recipientCharacterId: string
  /** O que o proponente dá. */
  from: unknown
  /** O que o destinatário dá. */
  to: unknown
  message?: string | null
}

export class CreateTradeOfferUseCase {
  constructor(
    private trades: ITradeRepository,
    private access: ITableAccessRepository
  ) {}

  async execute(input: CreateTradeOfferInput): Promise<TradeOfferContext> {
    const actorId = (input.actorId ?? '').trim()
    if (!actorId) throw badRequest('Informe quem está agindo (actor).', 401)
    if (!input.proposerCharacterId) throw badRequest('Informe o personagem que faz a proposta.')
    if (!input.recipientCharacterId) throw badRequest('Informe o personagem que recebe a proposta.')
    if (input.proposerCharacterId === input.recipientCharacterId) {
      throw badRequest('Um personagem não troca itens consigo mesmo.')
    }

    const from = readItems(input.from, 'O que o proponente dá')
    const to = readItems(input.to, 'O que o destinatário dá')
    if (from.length === 0) {
      throw badRequest('A oferta precisa de pelo menos um item do lado do proponente.')
    }
    if (from.length + to.length === 0) {
      throw badRequest('A oferta está vazia.')
    }

    const proposer = await this.loadPlayerCharacter(input.proposerCharacterId)
    const recipient = await this.loadPlayerCharacter(input.recipientCharacterId)

    if (proposer.user_id !== actorId) {
      throw badRequest('Você só pode fazer propostas com os seus personagens.', 403)
    }
    if (proposer.table_id !== recipient.table_id) {
      throw badRequest('Os dois personagens precisam estar na mesma mesa.')
    }
    if (!proposer.is_active || !recipient.is_active) {
      throw badRequest('Personagem inativo não participa de troca.')
    }

    // O proponente precisa ter o que promete.
    await this.assertPossession(proposer.id, from)

    const offer = await this.trades.create({
      id: crypto.randomUUID(),
      table_id: proposer.table_id,
      proposer_character_id: proposer.id,
      recipient_character_id: recipient.id,
      message: input.message?.trim() || null,
      items: [
        ...from.map((item) => ({ ...item, side: TradeSide.From })),
        ...to.map((item) => ({ ...item, side: TradeSide.To })),
      ],
    })

    return buildContext(offer, TradeRole.Proposer)
  }

  /** Carrega um personagem e recusa o que não é personagem de jogador. */
  private async loadPlayerCharacter(characterId: string): Promise<TradeCharacter> {
    const character = await this.trades.findCharacter(characterId)
    if (!character) throw badRequest('Personagem não encontrado.', 404)
    if (character.is_npc || !character.user_id) {
      throw badRequest('NPCs não participam de troca entre jogadores.')
    }
    return character
  }

  /** O personagem tem o que está na lista? (soma das linhas do inventário) */
  private async assertPossession(characterId: string, items: TradeItemInput[]): Promise<void> {
    const owned = await this.trades.findCharacterItems(characterId)
    const totals = new Map<string, number>()
    for (const row of owned) {
      totals.set(row.item_id, (totals.get(row.item_id) ?? 0) + row.quantity)
    }
    for (const item of items) {
      if ((totals.get(item.item_id) ?? 0) < item.quantity) {
        throw badRequest(
          `O personagem não tem ${item.quantity}× do item ${item.item_id}.`
        )
      }
    }
  }
}

export interface ListTradeOffersInput {
  actorId: string
  characterId: string
}

export class ListCharacterTradeOffersUseCase {
  constructor(
    private trades: ITradeRepository,
    private access: ITableAccessRepository
  ) {}

  async execute(input: ListTradeOffersInput): Promise<TradeOfferContext[]> {
    const actorId = (input.actorId ?? '').trim()
    if (!actorId) throw badRequest('Informe quem está agindo (actor).', 401)
    if (!input.characterId) throw badRequest('Informe o personagem.')

    const character = await this.trades.findCharacter(input.characterId)
    if (!character) throw badRequest('Personagem não encontrado.', 404)

    const ownerId = await this.access.findTableOwnerUserId(character.table_id)
    const isOwner = character.user_id === actorId || ownerId === actorId
    if (!isOwner) throw badRequest('Você só vê as ofertas dos seus personagens.', 403)

    const offers = await this.trades.findByCharacter(input.characterId)
    return offers.map((offer) => {
      const role = this.roleOf(offer, input.characterId)
      return buildContext(offer, role)
    })
  }

  private roleOf(offer: TradeOffer, characterId: string): TradeRoleValue | null {
    if (offer.proposer_character_id === characterId) return TradeRole.Proposer
    if (offer.recipient_character_id === characterId) return TradeRole.Recipient
    return null
  }
}

export interface ListTableTradeOffersInput {
  actorId: string
  tableId: string
}

export class ListTableTradeOffersUseCase {
  constructor(
    private trades: ITradeRepository,
    private access: ITableAccessRepository
  ) {}

  async execute(input: ListTableTradeOffersInput): Promise<TradeOfferContext[]> {
    const actorId = (input.actorId ?? '').trim()
    if (!actorId) throw badRequest('Informe quem está agindo (actor).', 401)
    if (!input.tableId) throw badRequest('Informe a mesa.')

    const ownerId = await this.access.findTableOwnerUserId(input.tableId)
    if (!ownerId) throw badRequest('Mesa não encontrada.', 404)
    if (ownerId !== actorId) {
      throw badRequest('Só o narrador da mesa acompanha as ofertas dela.', 403)
    }

    const offers = await this.trades.findPendingByTable(input.tableId)
    return offers.map((offer) => buildContext(offer, null))
  }
}

export interface GetTradeOfferInput {
  actorId: string
  offerId: string
  /** Personagem opcional: desambigua de que lado o ator está. */
  characterId?: string | undefined
}

export class GetTradeOfferUseCase {
  constructor(
    private trades: ITradeRepository,
    private access: ITableAccessRepository
  ) {}

  async execute(input: GetTradeOfferInput): Promise<TradeOfferContext> {
    const actorId = (input.actorId ?? '').trim()
    if (!actorId) throw badRequest('Informe quem está agindo (actor).', 401)

    const offer = await this.trades.findById(input.offerId)
    if (!offer) throw badRequest('Oferta não encontrada.', 404)

    const role = await this.roleOf(offer, actorId, input.characterId)
    if (!role) {
      const ownerId = await this.access.findTableOwnerUserId(offer.table_id)
      if (ownerId !== actorId) {
        throw badRequest('Você não participa desta oferta.', 403)
      }
    }
    return buildContext(offer, role)
  }

  /** O ator é o dono de um dos personagens? De que lado? */
  private async roleOf(
    offer: TradeOffer,
    actorId: string,
    characterId?: string | undefined
  ): Promise<TradeRoleValue | null> {
    const candidates = [offer.proposer_character_id, offer.recipient_character_id]
    for (const candidate of candidates) {
      if (characterId && candidate !== characterId) continue
      const character = await this.trades.findCharacter(candidate)
      if (!character || character.user_id !== actorId) continue
      return candidate === offer.proposer_character_id
        ? TradeRole.Proposer
        : TradeRole.Recipient
    }
    return null
  }
}

export interface EditTradeOfferInput {
  actorId: string
  offerId: string
  characterId: string
  /** A mão editada. */
  side: unknown
  /** Os itens novos da mão. */
  items: unknown
}

export class EditTradeOfferUseCase {
  constructor(
    private trades: ITradeRepository,
    private access: ITableAccessRepository
  ) {}

  async execute(input: EditTradeOfferInput): Promise<TradeOfferContext> {
    const actorId = (input.actorId ?? '').trim()
    if (!actorId) throw badRequest('Informe quem está agindo (actor).', 401)

    const offer = await this.trades.findById(input.offerId)
    if (!offer) throw badRequest('Oferta não encontrada.', 404)
    if (offer.status !== TradeStatus.Pending) {
      throw badRequest('Esta oferta já foi encerrada.', 409)
    }

    const side = this.readSide(input.side)
    const items = readItems(input.items, 'Os itens da oferta')

    const character = await this.trades.findCharacter(input.characterId)
    if (!character) throw badRequest('Personagem não encontrado.', 404)
    if (character.user_id !== actorId) {
      throw badRequest('Você só edita ofertas dos seus personagens.', 403)
    }

    const isProposer = input.characterId === offer.proposer_character_id
    const isRecipient = input.characterId === offer.recipient_character_id
    if (!isProposer && !isRecipient) {
      throw badRequest('Você não participa desta oferta.', 403)
    }
    if (!isProposer && side === TradeSide.From) {
      throw badRequest('O destinatário edita só a própria mão da oferta.')
    }

    // Quem edita a mão que É DELE precisa ter o que está oferecendo.
    if (isProposer && side === TradeSide.From) {
      await this.assertPossession(input.characterId, items)
    }
    if (isRecipient && side === TradeSide.To) {
      await this.assertPossession(input.characterId, items)
    }

    // Editar a mão `from` sem item nenhum esvazia a proposta: não faz sentido.
    if (side === TradeSide.From && items.length === 0) {
      throw badRequest('A oferta precisa de pelo menos um item do lado do proponente.')
    }

    const editor = isProposer ? TradeRole.Proposer : TradeRole.Recipient
    const updated = await this.trades.applyEdit({
      offer_id: offer.id,
      side,
      items,
      editor,
    })
    if (!updated) throw badRequest('Oferta não encontrada.', 404)

    return buildContext(updated, editor)
  }

  private readSide(raw: unknown): TradeSideValue {
    if (!isTradeSide(raw)) throw badRequest('Informe a mão editada ("from" ou "to").')
    return raw
  }

  private async assertPossession(characterId: string, items: TradeItemInput[]): Promise<void> {
    const owned = await this.trades.findCharacterItems(characterId)
    const totals = new Map<string, number>()
    for (const row of owned) {
      totals.set(row.item_id, (totals.get(row.item_id) ?? 0) + row.quantity)
    }
    for (const item of items) {
      if ((totals.get(item.item_id) ?? 0) < item.quantity) {
        throw badRequest(`O personagem não tem ${item.quantity}× do item ${item.item_id}.`)
      }
    }
  }
}

export interface ConfirmTradeOfferInput {
  actorId: string
  offerId: string
  /** O personagem com que o ator está confirmando (desambigua o lado). */
  characterId: string
}

export interface ConfirmTradeOfferOutput extends TradeOfferContext {
  /** A troca foi executada agora? */
  executed: boolean
}

export class ConfirmTradeOfferUseCase {
  constructor(
    private trades: ITradeRepository,
    private access: ITableAccessRepository
  ) {}

  async execute(input: ConfirmTradeOfferInput): Promise<ConfirmTradeOfferOutput> {
    const actorId = (input.actorId ?? '').trim()
    if (!actorId) throw badRequest('Informe quem está agindo (actor).', 401)

    const offer = await this.trades.findById(input.offerId)
    if (!offer) throw badRequest('Oferta não encontrada.', 404)
    if (offer.status !== TradeStatus.Pending) {
      throw badRequest('Esta oferta já foi encerrada.', 409)
    }

    const character = await this.trades.findCharacter(input.characterId)
    if (!character) throw badRequest('Personagem não encontrado.', 404)
    if (character.user_id !== actorId) {
      throw badRequest('Você só confirma ofertas dos seus personagens.', 403)
    }

    const isProposer = input.characterId === offer.proposer_character_id
    const isRecipient = input.characterId === offer.recipient_character_id
    if (!isProposer && !isRecipient) {
      throw badRequest('Você não participa desta oferta.', 403)
    }

    const side: TradeSideValue = isProposer ? TradeSide.From : TradeSide.To
    let updated = await this.trades.setConfirmed(offer.id, side, true)
    if (!updated) throw badRequest('Oferta não encontrada.', 404)

    // Confirmou a última parte? A troca acontece agora.
    if (updated.proposer_confirmed && updated.recipient_confirmed) {
      updated = await this.trades.execute(updated.id)
      return { ...buildContext(updated, isProposer ? TradeRole.Proposer : TradeRole.Recipient), executed: true }
    }

    return {
      ...buildContext(updated, isProposer ? TradeRole.Proposer : TradeRole.Recipient),
      executed: false,
    }
  }
}

export interface RejectTradeOfferInput {
  actorId: string
  offerId: string
  characterId: string
}

export class RejectTradeOfferUseCase {
  constructor(
    private trades: ITradeRepository,
    private access: ITableAccessRepository
  ) {}

  async execute(input: RejectTradeOfferInput): Promise<TradeOfferContext> {
    const actorId = (input.actorId ?? '').trim()
    if (!actorId) throw badRequest('Informe quem está agindo (actor).', 401)

    const offer = await this.trades.findById(input.offerId)
    if (!offer) throw badRequest('Oferta não encontrada.', 404)
    if (offer.status !== TradeStatus.Pending) {
      throw badRequest('Esta oferta já foi encerrada.', 409)
    }
    if (input.characterId !== offer.recipient_character_id) {
      throw badRequest('Só o destinatário recusa a oferta.')
    }

    const character = await this.trades.findCharacter(input.characterId)
    if (!character) throw badRequest('Personagem não encontrado.', 404)
    if (character.user_id !== actorId) {
      throw badRequest('Você só recusa ofertas dos seus personagens.', 403)
    }

    const updated = await this.trades.setStatus(offer.id, TradeStatus.Rejected)
    if (!updated) throw badRequest('Oferta não encontrada.', 404)
    return buildContext(updated, TradeRole.Recipient)
  }
}

export interface CancelTradeOfferInput {
  actorId: string
  offerId: string
  /** Opcional: o proponente cancela a própria oferta. */
  characterId?: string | undefined
}

export class CancelTradeOfferUseCase {
  constructor(
    private trades: ITradeRepository,
    private access: ITableAccessRepository
  ) {}

  async execute(input: CancelTradeOfferInput): Promise<TradeOfferContext> {
    const actorId = (input.actorId ?? '').trim()
    if (!actorId) throw badRequest('Informe quem está agindo (actor).', 401)

    const offer = await this.trades.findById(input.offerId)
    if (!offer) throw badRequest('Oferta não encontrada.', 404)
    if (offer.status !== TradeStatus.Pending) {
      throw badRequest('Esta oferta já foi encerrada.', 409)
    }

    let role: TradeRoleValue | null = null
    if (input.characterId) {
      const character = await this.trades.findCharacter(input.characterId)
      if (!character) throw badRequest('Personagem não encontrado.', 404)
      if (character.user_id === actorId && input.characterId === offer.proposer_character_id) {
        role = TradeRole.Proposer
      }
    }

    // O narrador da mesa pode desatender uma oferta parada — mas nunca
    // confirmar por um jogador.
    if (!role) {
      const ownerId = await this.access.findTableOwnerUserId(offer.table_id)
      if (ownerId !== actorId) {
        throw badRequest('Só o proponente ou o narrador cancela a oferta.', 403)
      }
    }

    const updated = await this.trades.setStatus(offer.id, TradeStatus.Cancelled)
    if (!updated) throw badRequest('Oferta não encontrada.', 404)
    return buildContext(updated, role)
  }
}
