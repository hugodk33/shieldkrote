import type { ITableAccessRepository } from '../../../domain/irepositories/ITableAccessRepository'
import type { ITableJoinRequestRepository } from '../../../domain/irepositories/ITableJoinRequestRepository'
import type { IUserRepository } from '../../../domain/irepositories/IUserRepository'
import {
  AccessLevel,
  TABLE_RESOURCES,
  type PermissionMap,
} from '../../../domain/types/TableAccess'
import {
  JoinRole,
  JoinStatus,
  TableMemberRole,
  isJoinRole,
  roleAllowedForUserType,
  type JoinRoleValue,
  type TableJoinCandidate,
  type TableJoinRequest,
  type TableMember,
} from '../../../domain/types/TableJoin'
import { UserType } from '../../../domain/types/UserType'
import { TableAccessError, assertTableOwner, normalizePermissions } from '../table-access-use-cases/TableAccessUseCases'

/**
 * Fluxo de entrada com pré-aprovação.
 *
 * Reaproveita `TableAccessError` e `assertTableOwner` do fluxo de acesso para
 * que o controller trate os dois igual. Reusar o erro é intencional: para quem
 * consome a API, "não posso entrar nesta mesa" e "não posso mexer no acesso
 * desta mesa" são o mesmo tipo de recusa de regra.
 */

/** Concessão de mesa inteira em escrita, usada ao aprovar um co-narrador. */
const fullWritePermissions = (): PermissionMap => {
  const out: PermissionMap = {}
  for (const resource of TABLE_RESOURCES) out[resource] = AccessLevel.Write
  return out
}

const normalizeRole = (raw: unknown): JoinRoleValue => {
  if (!isJoinRole(raw)) {
    throw new TableAccessError('Papel inválido: use "player" ou "co_narrator".')
  }
  return raw
}

export interface RequestTableJoinInput {
  tableId: string
  /** Quem está pedindo para entrar. Sem auth, chega pela URL/body. */
  userId: string
  role: unknown
  message?: string | null
}

export class RequestTableJoinUseCase {
  constructor(
    private joins: ITableJoinRequestRepository,
    private access: ITableAccessRepository,
    private users: IUserRepository
  ) {}

  async execute(input: RequestTableJoinInput): Promise<TableJoinRequest> {
    if (!input.tableId) throw new TableAccessError('Informe a mesa.', 400)
    if (!input.userId) throw new TableAccessError('Informe quem está pedindo para entrar.', 401)
    const role = normalizeRole(input.role)

    const ownerId = await this.access.findTableOwnerUserId(input.tableId)
    if (!ownerId) throw new TableAccessError('Mesa não encontrada.', 404)
    if (ownerId === input.userId) {
      throw new TableAccessError('Você já é o narrador dono desta mesa.')
    }

    const user = await this.users.findById(input.userId)
    if (!user) throw new TableAccessError('Usuário não encontrado.', 404)
    if (!roleAllowedForUserType(role, user.type)) {
      throw new TableAccessError(
        role === JoinRole.Player
          ? 'Só usuários do tipo "Jogador" podem entrar como jogadores.'
          : 'O papel de co-narrador é para narradores (titular ou convidado).',
        403
      )
    }

    return this.joins.save({
      id: crypto.randomUUID(),
      table_id: input.tableId,
      user_id: input.userId,
      role,
      message: input.message?.trim() || null,
    })
  }
}

export interface GetJoinStatusInput {
  tableId: string
  /** Quem consulta; vazio devolve só o estado da mesa. */
  userId?: string | undefined
  /** Quem está agindo — só para decidir `canManage`. */
  actorId?: string | undefined
}

export interface GetJoinStatusOutput {
  tableId: string
  ownerId: string
  canManage: boolean
  isPlayer: boolean
  hasGrant: boolean
  request: TableJoinRequest | null
}

export class GetJoinStatusUseCase {
  constructor(
    private joins: ITableJoinRequestRepository,
    private access: ITableAccessRepository,
    private users: IUserRepository
  ) {}

  async execute(input: GetJoinStatusInput): Promise<GetJoinStatusOutput> {
    const ownerId = await this.access.findTableOwnerUserId(input.tableId)
    if (!ownerId) throw new TableAccessError('Mesa não encontrada.', 404)

    const actor = input.actorId ? await this.users.findById(input.actorId) : null
    const canManage = Boolean(
      actor && (ownerId === actor.id || actor.type === UserType.Admin)
    )

    if (!input.userId) {
      return { tableId: input.tableId, ownerId, canManage, isPlayer: false, hasGrant: false, request: null }
    }

    const [request, isPlayer, grant] = await Promise.all([
      this.joins.find(input.tableId, input.userId),
      this.joins.isPlayer(input.tableId, input.userId),
      this.access.findGrant(input.tableId, input.userId),
    ])

    return {
      tableId: input.tableId,
      ownerId,
      canManage,
      isPlayer,
      hasGrant: Boolean(grant),
      request,
    }
  }
}

export interface ListJoinCandidatesInput {
  tableId: string
  role: unknown
}

export class ListJoinCandidatesUseCase {
  constructor(
    private joins: ITableJoinRequestRepository,
    private access: ITableAccessRepository,
    private users: IUserRepository
  ) {}

  async execute(input: ListJoinCandidatesInput): Promise<TableJoinCandidate[]> {
    const role = normalizeRole(input.role)
    const ownerId = await this.access.findTableOwnerUserId(input.tableId)
    if (!ownerId) throw new TableAccessError('Mesa não encontrada.', 404)

    const [everyone, playerIds, grants] = await Promise.all([
      this.users.findAll(),
      this.joins.listPlayerIds(input.tableId),
      this.access.findByTable(input.tableId),
    ])

    const placed = new Set<string>([ownerId, ...playerIds, ...grants.map((g) => g.user_id)])
    return everyone
      .filter((u) => !placed.has(u.id) && roleAllowedForUserType(role, u.type))
      .map((u) => ({ id: u.id, username: u.username, email: u.email, type: u.type }))
  }
}

export interface ListJoinRequestsInput {
  tableId: string
  actorId: string
}

export interface ListJoinRequestsOutput {
  tableId: string
  ownerId: string
  canManage: boolean
  requests: TableJoinRequest[]
}

export class ListJoinRequestsUseCase {
  constructor(
    private joins: ITableJoinRequestRepository,
    private access: ITableAccessRepository,
    private users: IUserRepository
  ) {}

  async execute(input: ListJoinRequestsInput): Promise<ListJoinRequestsOutput> {
    const ownerId = await assertTableOwner(
      this.access,
      this.users,
      input.tableId,
      input.actorId
    )
    const requests = await this.joins.findByTable(input.tableId)
    return { tableId: input.tableId, ownerId, canManage: true, requests }
  }
}

export type JoinAction = 'approve' | 'reject'

export interface ResolveJoinRequestInput {
  tableId: string
  actorId: string
  userId: string
  action: JoinAction
  /** Permissões do co-narrador; ausente = mesa inteira em escrita. */
  permissions?: unknown
}

export class ResolveJoinRequestUseCase {
  constructor(
    private joins: ITableJoinRequestRepository,
    private access: ITableAccessRepository,
    private users: IUserRepository
  ) {}

  async execute(input: ResolveJoinRequestInput): Promise<TableJoinRequest | null> {
    await assertTableOwner(this.access, this.users, input.tableId, input.actorId)
    if (!input.userId) throw new TableAccessError('Informe o usuário da solicitação.')

    const request = await this.joins.find(input.tableId, input.userId)
    if (!request) throw new TableAccessError('Solicitação não encontrada.', 404)

    if (input.action === 'reject') {
      return this.joins.resolve(input.tableId, input.userId, JoinStatus.Rejected, input.actorId)
    }
    if (input.action !== 'approve') {
      throw new TableAccessError('Ação inválida: use "approve" ou "reject".')
    }

    if (request.role === JoinRole.CoNarrator) {
      const permissions =
        input.permissions === undefined || input.permissions === null
          ? fullWritePermissions()
          : normalizePermissions(input.permissions)
      if (Object.keys(permissions).length === 0) {
        throw new TableAccessError('Selecione ao menos um recurso para o co-narrador.')
      }
      await this.access.save({
        id: crypto.randomUUID(),
        table_id: input.tableId,
        user_id: input.userId,
        permissions,
        granted_by: input.actorId,
      })
    } else {
      await this.joins.addPlayer(input.tableId, input.userId)
    }

    return this.joins.resolve(input.tableId, input.userId, JoinStatus.Approved, input.actorId)
  }
}

export interface CancelJoinRequestInput {
  tableId: string
  userId: string
}

export class CancelJoinRequestUseCase {
  constructor(private joins: ITableJoinRequestRepository) {}

  async execute(input: CancelJoinRequestInput): Promise<{ removed: boolean }> {
    if (!input.userId) throw new TableAccessError('Informe de quem é o pedido.', 401)
    const request = await this.joins.find(input.tableId, input.userId)
    if (!request) return { removed: false }
    if (request.status === JoinStatus.Approved) {
      throw new TableAccessError('Este pedido já foi aprovado — fale com o narrador para sair.')
    }
    const removed = await this.joins.remove(input.tableId, input.userId)
    return { removed }
  }
}

/* ============================================================
   Elenco da mesa — quem está vinculado e o que o dono pode fazer
   ============================================================ */

/** Tira o jogador da mesa e desativa as fichas dele (reversível depois). */
const removeMemberEffects = async (
  joins: ITableJoinRequestRepository,
  tableId: string,
  userId: string
): Promise<void> => {
  await joins.removePlayer(tableId, userId)
  await joins.setCharactersActive(tableId, userId, false)
  // Some com o pedido antigo: se quiser voltar, o jogador pede de novo e o
  // dono reaprova — sem isso, o estado "aprovado" deixaria uma porta aberta.
  await joins.remove(tableId, userId)
}

export interface ListTableMembersInput {
  tableId: string
  actorId: string
}

export interface ListTableMembersOutput {
  tableId: string
  ownerId: string
  canManage: boolean
  members: TableMember[]
}

export class ListTableMembersUseCase {
  constructor(
    private joins: ITableJoinRequestRepository,
    private access: ITableAccessRepository,
    private users: IUserRepository
  ) {}

  async execute(input: ListTableMembersInput): Promise<ListTableMembersOutput> {
    const ownerId = await assertTableOwner(this.access, this.users, input.tableId, input.actorId)

    const [players, grants, owner, everyone] = await Promise.all([
      this.joins.listPlayerMembers(input.tableId),
      this.access.findByTable(input.tableId),
      this.users.findById(ownerId),
      this.users.findAll(),
    ])
    const byId = new Map(everyone.map((u) => [u.id, u]))

    const members: TableMember[] = [
      {
        userId: ownerId,
        username: owner?.username ?? '',
        email: owner?.email ?? '',
        type: owner?.type ?? 0,
        role: TableMemberRole.Owner,
        isMuted: false,
        characterId: null,
        characterName: null,
        characterActive: true,
      },
    ]
    for (const grant of grants) {
      const user = byId.get(grant.user_id)
      members.push({
        userId: grant.user_id,
        username: user?.username ?? '',
        email: user?.email ?? '',
        type: user?.type ?? 3,
        role: TableMemberRole.CoNarrator,
        isMuted: false,
        characterId: null,
        characterName: null,
        characterActive: true,
      })
    }
    members.push(...players)

    return { tableId: input.tableId, ownerId, canManage: true, members }
  }
}

export interface SetMemberMutedInput {
  tableId: string
  actorId: string
  userId: string
  muted: boolean
}

export class SetMemberMutedUseCase {
  constructor(
    private joins: ITableJoinRequestRepository,
    private access: ITableAccessRepository,
    private users: IUserRepository
  ) {}

  async execute(input: SetMemberMutedInput): Promise<{ muted: boolean }> {
    await assertTableOwner(this.access, this.users, input.tableId, input.actorId)
    if (!input.userId) throw new TableAccessError('Informe o jogador.')
    if (!(await this.joins.isPlayer(input.tableId, input.userId))) {
      throw new TableAccessError('Só é possível silenciar um jogador da mesa.', 404)
    }
    await this.joins.setMuted(input.tableId, input.userId, input.muted)
    return { muted: input.muted }
  }
}

export interface RemoveTableMemberInput {
  tableId: string
  actorId: string
  userId: string
}

export class RemoveTableMemberUseCase {
  constructor(
    private joins: ITableJoinRequestRepository,
    private access: ITableAccessRepository,
    private users: IUserRepository
  ) {}

  async execute(input: RemoveTableMemberInput): Promise<{ removed: boolean }> {
    await assertTableOwner(this.access, this.users, input.tableId, input.actorId)
    if (!input.userId) throw new TableAccessError('Informe o jogador a remover.')
    if (!(await this.joins.isPlayer(input.tableId, input.userId))) {
      throw new TableAccessError('Este usuário não é jogador desta mesa.', 404)
    }
    await removeMemberEffects(this.joins, input.tableId, input.userId)
    return { removed: true }
  }
}

export interface LeaveTableInput {
  tableId: string
  userId: string
}

export class LeaveTableUseCase {
  constructor(private joins: ITableJoinRequestRepository) {}

  async execute(input: LeaveTableInput): Promise<{ left: boolean }> {
    if (!input.userId) throw new TableAccessError('Informe quem está saindo.', 401)
    if (!(await this.joins.isPlayer(input.tableId, input.userId))) {
      throw new TableAccessError('Você não é jogador desta mesa.', 404)
    }
    await removeMemberEffects(this.joins, input.tableId, input.userId)
    return { left: true }
  }
}

/* ============================================================
   Vínculo do jogador — leitura barata, sem privilégio de dono.

   O console do jogador precisa saber se ele está silenciado para
   esconder/desabilitar os botões de ação. Isso é sobre o PRÓPRIO
   usuário consultando o próprio vínculo, então não exige
   assertTableOwner (diferente da listagem do elenco).
   ============================================================ */

export interface GetMembershipInput {
  tableId: string
  userId?: string | undefined
}

export interface GetMembershipOutput {
  tableId: string
  userId: string | null
  isPlayer: boolean
  isMuted: boolean
}

export class GetMembershipUseCase {
  constructor(private joins: ITableJoinRequestRepository) {}

  async execute(input: GetMembershipInput): Promise<GetMembershipOutput> {
    if (!input.userId) {
      return { tableId: input.tableId, userId: null, isPlayer: false, isMuted: false }
    }
    const isPlayer = await this.joins.isPlayer(input.tableId, input.userId)
    const isMuted = isPlayer ? await this.joins.isMuted(input.tableId, input.userId) : false
    return { tableId: input.tableId, userId: input.userId, isPlayer, isMuted }
  }
}
