import { Request, Response } from 'express'
import {
  CancelTradeOfferUseCase,
  ConfirmTradeOfferUseCase,
  CreateTradeOfferUseCase,
  EditTradeOfferUseCase,
  GetTradeOfferUseCase,
  ListCharacterTradeOffersUseCase,
  ListTableTradeOffersUseCase,
  RejectTradeOfferUseCase,
} from '../../application/use-cases/trade-use-cases/TradeUseCases'
import { TradeError } from '../../domain/types/Trade'
import { publishTable } from '../../infra/realtime/TableEvents'

/**
 * Troca entre jogadores.
 *
 * NOTA DE SEGURANÇA: como o resto do backend, não há autenticação de verdade.
 * O `actor` chega pela URL/body e é o id do DONO do personagem — é regra de
 * negócio ("esta oferta é sua?"), não segurança. Quando a autenticação entrar,
 * este controller é um dos primeiros a fechar.
 */
export class TradeController {
  constructor(
    private createUseCase: CreateTradeOfferUseCase,
    private listCharacterUseCase: ListCharacterTradeOffersUseCase,
    private listTableUseCase: ListTableTradeOffersUseCase,
    private getUseCase: GetTradeOfferUseCase,
    private editUseCase: EditTradeOfferUseCase,
    private confirmUseCase: ConfirmTradeOfferUseCase,
    private rejectUseCase: RejectTradeOfferUseCase,
    private cancelUseCase: CancelTradeOfferUseCase
  ) {}

  private handle = async (res: Response, fn: () => Promise<unknown>) => {
    try {
      return res.json(await fn())
    } catch (error) {
      if (error instanceof TradeError) {
        return res.status(error.status).json({ error: error.message })
      }
      return res.status(500).json({ error: (error as Error)?.message ?? 'Erro inesperado' })
    }
  }

  /** O ator pode estar na query (leitura) ou no body (escrita). */
  private actorOf(req: Request): string {
    const fromQuery = req.query?.actor
    const fromBody = req.body?.actor
    const value = typeof fromQuery === 'string' && fromQuery.trim() ? fromQuery : fromBody
    return typeof value === 'string' ? value.trim() : ''
  }

  private characterOf(req: Request): string {
    const fromQuery = req.query?.character_id
    const fromBody = req.body?.character_id
    const value = typeof fromQuery === 'string' && fromQuery.trim() ? fromQuery : fromBody
    return typeof value === 'string' ? value.trim() : ''
  }

  /** O jogador propõe a troca. */
  async create(req: Request, res: Response) {
    return this.handle(res, async () => {
      const result = await this.createUseCase.execute({
        actorId: this.actorOf(req),
        proposerCharacterId: (req.body?.proposer_character_id ?? this.characterOf(req)) as string,
        recipientCharacterId: (req.body?.recipient_character_id ?? '') as string,
        from: req.body?.from,
        to: req.body?.to,
        message: req.body?.message ?? null,
      })
      publishTable(result.offer.table_id, 'trade')
      return result
    })
  }

  /** As ofertas em que o personagem participa. */
  async listByCharacter(req: Request, res: Response) {
    return this.handle(res, () =>
      this.listCharacterUseCase.execute({
        actorId: this.actorOf(req),
        characterId: (req.params.characterId ?? '') as string,
      })
    )
  }

  /** As ofertas pendentes da mesa (olho do narrador). */
  async listByTable(req: Request, res: Response) {
    return this.handle(res, () =>
      this.listTableUseCase.execute({
        actorId: this.actorOf(req),
        tableId: (req.params.tableId ?? '') as string,
      })
    )
  }

  /** Uma oferta específica. */
  async get(req: Request, res: Response) {
    return this.handle(res, () =>
      this.getUseCase.execute({
        actorId: this.actorOf(req),
        offerId: (req.params.id ?? '') as string,
        characterId: this.characterOf(req) || undefined,
      })
    )
  }

  /** Edita os termos de uma mão da oferta. */
  async edit(req: Request, res: Response) {
    return this.handle(res, async () => {
      const result = await this.editUseCase.execute({
        actorId: this.actorOf(req),
        offerId: (req.params.id ?? '') as string,
        characterId: this.characterOf(req),
        side: req.body?.side,
        items: req.body?.items,
      })
      publishTable(result.offer.table_id, 'trade')
      return result
    })
  }

  /** Confirma o lado do ator; com as duas confirmações a troca fecha. */
  async confirm(req: Request, res: Response) {
    return this.handle(res, async () => {
      const result = await this.confirmUseCase.execute({
        actorId: this.actorOf(req),
        offerId: (req.params.id ?? '') as string,
        characterId: this.characterOf(req),
      })
      publishTable(result.offer.table_id, 'trade')
      return result
    })
  }

  /** O destinatário recusa a oferta. */
  async reject(req: Request, res: Response) {
    return this.handle(res, async () => {
      const result = await this.rejectUseCase.execute({
        actorId: this.actorOf(req),
        offerId: (req.params.id ?? '') as string,
        characterId: this.characterOf(req),
      })
      publishTable(result.offer.table_id, 'trade')
      return result
    })
  }

  /** O proponente (ou o narrador) retira a oferta. */
  async cancel(req: Request, res: Response) {
    return this.handle(res, async () => {
      const result = await this.cancelUseCase.execute({
        actorId: this.actorOf(req),
        offerId: (req.params.id ?? '') as string,
        characterId: this.characterOf(req) || undefined,
      })
      publishTable(result.offer.table_id, 'trade')
      return result
    })
  }
}
