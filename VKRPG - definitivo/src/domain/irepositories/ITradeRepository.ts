import type {
  TradeCharacter,
  TradeCharacterItem,
  TradeItemInput,
  TradeOffer,
  TradeRoleValue,
  TradeSideValue,
  TradeStatusValue,
} from '../types/Trade'

/**
 * Persistência das ofertas de troca.
 *
 * A execução dos itens mora AQUI (e não no use case) porque só o repositório
 * tem a transação: a mudança de dono tem de ser tudo-ou-nada, senão uma
 * transferência parcial deixa o mundo inconsistente.
 */
export interface ITradeRepository {
  /** Cria a oferta já com as duas mãos preenchidas. */
  create(input: {
    id: string
    table_id: string
    proposer_character_id: string
    recipient_character_id: string
    message: string | null
    items: Array<TradeItemInput & { side: TradeSideValue }>
  }): Promise<TradeOffer>

  /** Uma oferta pelo id, com itens e nomes dos personagens. */
  findById(id: string): Promise<TradeOffer | null>

  /** Ofertas em que o personagem participa (qualquer lado), mais recentes primeiro. */
  findByCharacter(characterId: string): Promise<TradeOffer[]>

  /** Ofertas pendentes de uma mesa. */
  findPendingByTable(tableId: string): Promise<TradeOffer[]>

  /**
   * Substitui a mão de um dos lados e zera a confirmação da OUTRA parte.
   * Devolve a oferta já atualizada.
   */
  replaceSide(
    offerId: string,
    side: TradeSideValue,
    items: TradeItemInput[]
  ): Promise<TradeOffer | null>

  /**
   * Troca a mão de um lado e reescreve as confirmações: quem editou fica
   * confirmado, o outro precisa concordar de novo.
   */
  applyEdit(input: {
    offer_id: string
    side: TradeSideValue
    items: TradeItemInput[]
    /** Quem editou — decide de quem é a confirmação que fica de pé. */
    editor: TradeRoleValue
  }): Promise<TradeOffer | null>

  /** Marca a confirmação de um dos lados. */
  setConfirmed(
    offerId: string,
    side: TradeSideValue,
    confirmed: boolean
  ): Promise<TradeOffer | null>

  /** Move a oferta para um estado final (completed/rejected/cancelled). */
  setStatus(offerId: string, status: TradeStatusValue): Promise<TradeOffer | null>

  /**
   * Executa a troca: revalida posse/mesa e move os itens das duas mãos numa
   * transação atômica. Lança `TradeError` quando algo não bate.
   */
  execute(offerId: string): Promise<TradeOffer>

  /** O personagem como a troca o enxerga: dono, mesa, estado, é NPC. */
  findCharacter(characterId: string): Promise<TradeCharacter | null>

  /** O inventário do personagem, com a quantidade somada por item. */
  findCharacterItems(characterId: string): Promise<TradeCharacterItem[]>
}
