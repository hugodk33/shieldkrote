import { Request, Response } from 'express'
import {
  CancelJoinRequestUseCase,
  GetJoinStatusUseCase,
  GetMembershipUseCase,
  LeaveTableUseCase,
  ListJoinCandidatesUseCase,
  ListJoinRequestsUseCase,
  ListTableMembersUseCase,
  RemoveTableMemberUseCase,
  RequestTableJoinUseCase,
  ResolveJoinRequestUseCase,
  SetMemberMutedUseCase,
  type JoinAction,
} from '../../application/use-cases/table-join-use-cases/TableJoinUseCases'
import { TableAccessError } from '../../application/use-cases/table-access-use-cases/TableAccessUseCases'
import { JOIN_ROLES } from '../../domain/types/TableJoin'

/**
 * Entrada numa mesa com pré-aprovação.
 *
 * NOTA DE SEGURANÇA: sem autenticação (igual ao TableAccessController). O
 * `user`/`actor` chega pela URL/body e qualquer cliente pode forjá-lo. Estas
 * checagens são de regra de negócio — o dono aprova, o tipo do usuário bate com
 * o papel — não de segurança. Quando a autenticação entrar, este controller é um
 * dos primeiros a fechar.
 */
export class TableJoinController {
  constructor(
    private requestUseCase: RequestTableJoinUseCase,
    private statusUseCase: GetJoinStatusUseCase,
    private candidatesUseCase: ListJoinCandidatesUseCase,
    private listUseCase: ListJoinRequestsUseCase,
    private resolveUseCase: ResolveJoinRequestUseCase,
    private cancelUseCase: CancelJoinRequestUseCase,
    private membersUseCase: ListTableMembersUseCase,
    private muteUseCase: SetMemberMutedUseCase,
    private removeMemberUseCase: RemoveTableMemberUseCase,
    private leaveUseCase: LeaveTableUseCase,
    private membershipUseCase: GetMembershipUseCase
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

  /** Catálogo de papéis, para o front montar a landing page. */
  async roles(_req: Request, res: Response) {
    return res.json({ roles: JOIN_ROLES })
  }

  /** O usuário se convida: cria/reabre a solicitação pendente. */
  async request(req: Request, res: Response) {
    const tableId = req.params.id as string
    const userId = (req.body?.user_id ?? req.body?.user ?? req.query.user) as string | undefined
    return this.handle(res, () =>
      this.requestUseCase.execute({
        tableId,
        userId: userId ?? '',
        role: req.body?.role,
        message: req.body?.message ?? null,
      })
    )
  }

  /** Estado de quem consulta: pedido pendente, já jogador, já aprovado. */
  async status(req: Request, res: Response) {
    const tableId = req.params.id as string
    const userId = req.query.user as string | undefined
    const actorId = (req.query.actor ?? req.query.user) as string | undefined
    return this.handle(res, () =>
      this.statusUseCase.execute({ tableId, userId, actorId })
    )
  }

  /** Quem ainda pode entrar nesta mesa, dado o papel. */
  async candidates(req: Request, res: Response) {
    const tableId = req.params.id as string
    const role = req.query.role
    return this.handle(res, () => this.candidatesUseCase.execute({ tableId, role }))
  }

  /** O dono lista as solicitações da mesa. */
  async list(req: Request, res: Response) {
    const tableId = req.params.id as string
    const actorId = (req.query.actor ?? req.body?.actor) as string | undefined
    return this.handle(res, () =>
      this.listUseCase.execute({ tableId, actorId: actorId ?? '' })
    )
  }

  /** O dono aprova ou recusa uma solicitação. */
  async resolve(req: Request, res: Response) {
    const tableId = req.params.id as string
    const userId = req.params.userId as string
    const action = req.body?.action as JoinAction | undefined
    return this.handle(res, () =>
      this.resolveUseCase.execute({
        tableId,
        actorId: req.body?.actor,
        userId,
        action: action ?? 'approve',
        permissions: req.body?.permissions,
      })
    )
  }

  /** O próprio usuário cancela o pedido pendente. */
  async cancel(req: Request, res: Response) {
    const tableId = req.params.id as string
    const userId = req.params.userId as string
    return this.handle(res, () => this.cancelUseCase.execute({ tableId, userId }))
  }

  /* ============================================================
     Elenco da mesa — leitura e gestão pelo dono
     ============================================================ */

  /** O dono lista quem está vinculado (dono, co-narradores e jogadores). */
  async members(req: Request, res: Response) {
    const tableId = req.params.id as string
    const actorId = (req.query.actor ?? req.body?.actor) as string | undefined
    return this.handle(res, () =>
      this.membersUseCase.execute({ tableId, actorId: actorId ?? '' })
    )
  }

  /** O dono silencia/libera as ações de um jogador. */
  async mute(req: Request, res: Response) {
    const tableId = req.params.id as string
    const userId = req.params.userId as string
    return this.handle(res, () =>
      this.muteUseCase.execute({
        tableId,
        actorId: req.body?.actor,
        userId,
        muted: Boolean(req.body?.muted),
      })
    )
  }

  /** O dono tira o jogador da mesa (desativa a ficha). */
  async removeMember(req: Request, res: Response) {
    const tableId = req.params.id as string
    const userId = req.params.userId as string
    const actorId = (req.query.actor ?? req.body?.actor) as string | undefined
    return this.handle(res, () =>
      this.removeMemberUseCase.execute({ tableId, actorId: actorId ?? '', userId })
    )
  }

  /** O próprio jogador sai da mesa (auto-remoção). */
  async leave(req: Request, res: Response) {
    const tableId = req.params.id as string
    const userId = (req.body?.user_id ?? req.body?.user) as string | undefined
    return this.handle(res, () => this.leaveUseCase.execute({ tableId, userId: userId ?? '' }))
  }

  /** O jogador consulta o próprio vínculo (é jogador? está silenciado?). */
  async membership(req: Request, res: Response) {
    const tableId = req.params.id as string
    const userId = req.query.user as string | undefined
    return this.handle(res, () => this.membershipUseCase.execute({ tableId, userId }))
  }
}
