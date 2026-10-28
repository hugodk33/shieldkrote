import { Request, Response } from 'express'
import {
  ListTableAccessUseCase,
  RevokeTableAccessUseCase,
  SaveTableAccessUseCase,
  TableAccessError,
} from '../../application/use-cases/table-access-use-cases/TableAccessUseCases'
import { TABLE_RESOURCES, AccessLevel } from '../../domain/types/TableAccess'
import { UserType, USER_TYPE_LABELS } from '../../domain/types/UserType'

/**
 * Configuração de narradores convidados de uma mesa.
 *
 * NOTA DE SEGURANÇA: o projeto não tem autenticação — não existe login, token
 * nem sessão. O `actor` chega pela query/body e é a mesma identidade "seat"
 * que o resto do app já usa (ver `lib/seat.ts` e o `?viewer=` dos endpoints de
 * visibilidade). These checks are de posse/regra de negócio, não de segurança:
 * um cliente pode forjar o `actor`. Quando a autenticação entrar, este controller
 * é o primeiro lugar a ser fechado.
 */
export class TableAccessController {
  constructor(
    private listUseCase: ListTableAccessUseCase,
    private saveUseCase: SaveTableAccessUseCase,
    private revokeUseCase: RevokeTableAccessUseCase
  ) {}

  private handle = async (res: Response, fn: () => Promise<unknown>) => {
    try {
      return res.json(await fn())
    } catch (error) {
      if (error instanceof TableAccessError) {
        return res.status(error.status).json({ error: error.message })
      }
      return res.status(500).json({ error: (error as Error)?.message ?? 'Erro inesperado' })
    }
  }

  async list(req: Request, res: Response) {
    const tableId = req.params.id as string
    const actorId = (req.query.actor ?? req.body?.actor) as string | undefined
    return this.handle(res, () => this.listUseCase.execute({ tableId, actorId: actorId ?? '' }))
  }

  async save(req: Request, res: Response) {
    const tableId = req.params.id as string
    return this.handle(res, () =>
      this.saveUseCase.execute({
        tableId,
        actorId: req.body?.actor,
        userId: req.body?.user_id,
        permissions: req.body?.permissions,
      })
    )
  }

  async revoke(req: Request, res: Response) {
    const tableId = req.params.id as string
    const userId = req.params.userId as string
    const actorId = (req.query.actor ?? req.body?.actor) as string | undefined
    return this.handle(res, () =>
      this.revokeUseCase.execute({ tableId, actorId: actorId ?? '', userId })
    )
  }

  /** Catálogo de recursos e níveis, para a tela de configuração. */
  async resources(_req: Request, res: Response) {
    return res.json({
      resources: TABLE_RESOURCES,
      levels: [AccessLevel.Read, AccessLevel.Write],
      userTypes: Object.values(UserType).map((value) => ({
        value,
        label: USER_TYPE_LABELS[value as keyof typeof USER_TYPE_LABELS],
      })),
    })
  }
}
