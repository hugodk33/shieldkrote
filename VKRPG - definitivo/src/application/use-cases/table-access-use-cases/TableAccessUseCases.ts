import type { ITableAccessRepository } from '../../../domain/irepositories/ITableAccessRepository'
import type { IUserRepository } from '../../../domain/irepositories/IUserRepository'
import {
  TABLE_RESOURCES,
  isTableResource,
  resolveTableAccess,
  type PermissionMap,
  type TableAccessGrant,
} from '../../../domain/types/TableAccess'
import { AccessLevel, TableResource, TableRole } from '../../../domain/types/TableAccess'
import { isGuestNarrator, UserType } from '../../../domain/types/UserType'

/** Erros de negócio com mensagem já pronta para o 400 do controller. */
export class TableAccessError extends Error {
  readonly status: number
  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

/**
 * Confere que `actorId` é o narrador titular da mesa (ou um admin do sistema).
 * Centraliza a regra de posse: a mesa pertence a um único narrador e só ele
 * distribui acesso.
 */
export const assertTableOwner = async (
  access: ITableAccessRepository,
  users: IUserRepository,
  tableId: string,
  actorId: string
): Promise<string> => {
  if (!actorId) throw new TableAccessError('Informe quem está agindo (actor).', 401)

  const ownerId = await access.findTableOwnerUserId(tableId)
  if (!ownerId) throw new TableAccessError('Mesa não encontrada.', 404)
  if (ownerId === actorId) return ownerId

  const actor = await users.findById(actorId)
  if (actor && actor.type === UserType.Admin) return ownerId

  throw new TableAccessError('Apenas o narrador dono da mesa pode gerenciar os convidados.', 403)
}

/** Normaliza e valida o mapa de permissões recebido. */
export const normalizePermissions = (raw: unknown): PermissionMap => {
  const out: PermissionMap = {}
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new TableAccessError('Permissões inválidas: envie um objeto { recurso: "read" | "write" }.')
  }
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!isTableResource(key)) {
      throw new TableAccessError(
        `Recurso desconhecido: "${key}". Válidos: ${TABLE_RESOURCES.join(', ')}.`
      )
    }
    if (value !== AccessLevel.Read && value !== AccessLevel.Write) {
      throw new TableAccessError(
        `Nível inválido para "${key}": use "read" ou "write" (recebido: ${JSON.stringify(value)}).`
      )
    }
    out[key] = value
  }
  return out
}

/** Garante que o alvo é um narrador convidado e que ele existe. */
export const assertGuestNarrator = async (users: IUserRepository, userId: string): Promise<string> => {
  if (!userId) throw new TableAccessError('Informe o usuário convidado.')
  const user = await users.findById(userId)
  if (!user) throw new TableAccessError('Usuário não encontrado.', 404)
  if (!isGuestNarrator(user.type)) {
    throw new TableAccessError(
      'O usuário precisa ser do tipo "Narrador convidado" para receber acesso a uma mesa.'
    )
  }
  return user.id
}

export interface ListTableAccessInput {
  tableId: string
  actorId: string
}

export interface ListTableAccessOutput {
  tableId: string
  ownerId: string | null
  canManage: boolean
  /** Recursos que a tela de configuração deve oferecer como opção. */
  availableResources: readonly string[]
  grants: TableAccessGrant[]
  /** Usuários do tipo narrador convidado que ainda não têm concessão. */
  candidates: { id: string; username: string; email: string }[]
}

export class ListTableAccessUseCase {
  constructor(
    private access: ITableAccessRepository,
    private users: IUserRepository
  ) {}

  async execute(input: ListTableAccessInput): Promise<ListTableAccessOutput> {
    const ownerId = await this.access.findTableOwnerUserId(input.tableId)
    if (!ownerId) throw new TableAccessError('Mesa não encontrada.', 404)

    const grants = await this.access.findByTable(input.tableId)

    // O ator não precisa ser o dono para consultar; só para alterar.
    const actor = input.actorId ? await this.users.findById(input.actorId) : null
    const canManage = Boolean(ownerId === input.actorId || (actor && actor.type === UserType.Admin))

    const alreadyGranted = new Set(grants.map((g) => g.user_id))
    const everyone = await this.users.findAll()
    const candidates = everyone
      .filter((u) => isGuestNarrator(u.type) && !alreadyGranted.has(u.id))
      .map((u) => ({ id: u.id, username: u.username, email: u.email }))

    return {
      tableId: input.tableId,
      ownerId,
      canManage,
      availableResources: TABLE_RESOURCES,
      grants,
      candidates,
    }
  }
}

export interface SaveTableAccessInput {
  tableId: string
  actorId: string
  userId: string
  permissions: unknown
}

export class SaveTableAccessUseCase {
  constructor(
    private access: ITableAccessRepository,
    private users: IUserRepository
  ) {}

  async execute(input: SaveTableAccessInput): Promise<TableAccessGrant> {
    await assertTableOwner(this.access, this.users, input.tableId, input.actorId)
    const userId = await assertGuestNarrator(this.users, input.userId)
    const permissions = normalizePermissions(input.permissions)

    if (Object.keys(permissions).length === 0) {
      throw new TableAccessError('Selecione ao menos um recurso para o convidado.')
    }

    return this.access.save({
      id: crypto.randomUUID(),
      table_id: input.tableId,
      user_id: userId,
      permissions,
      granted_by: input.actorId,
    })
  }
}

export interface RevokeTableAccessInput {
  tableId: string
  actorId: string
  userId: string
}

export class RevokeTableAccessUseCase {
  constructor(
    private access: ITableAccessRepository,
    private users: IUserRepository
  ) {}

  async execute(input: RevokeTableAccessInput): Promise<{ revoked: boolean }> {
    await assertTableOwner(this.access, this.users, input.tableId, input.actorId)
    if (!input.userId) throw new TableAccessError('Informe o usuário a remover.')
    const revoked = await this.access.revoke(input.tableId, input.userId)
    return { revoked }
  }
}

/* ============================================================
   Resolução de quem está pedindo (read filtering)
   ============================================================ */

/** Papel efetivo de quem fez o pedido, já resolvido no servidor. */
export const ViewerRole = {
  /** Narrador dono da mesa: vê tudo, sem filtro. */
  Owner: 'owner',
  /** Narrador convidado com `locations` liberado: vê tudo, sem filtro. */
  Guest: 'guest',
  /** Jogador: vê só o que o personagem conhece. */
  Player: 'player',
  /** Não tem relação com a mesa: não entra. */
  None: 'none',
} as const

export type ViewerRoleValue = (typeof ViewerRole)[keyof typeof ViewerRole]

export interface ResolvedViewer {
  role: ViewerRoleValue
  /**
   * Personagem cujas regras de conhecimento filtram a resposta.
   * `null` para dono/convidado: sem filtro nenhum.
   */
  characterId: string | null
  /** `false` blocks the request entirely (guest without `locations`). */
  allowed: boolean
}

export interface ResolveViewerInput {
  tableId: string
  /** User id of whoever is making the request. Required. */
  actorId: string
  /**
   * Preview: filter as this character even though the actor has narrator
   * rights. Lets the GM look at the table through one PC's eyes. Ignored for
   * players (a player may only ever see as themselves) and validated against
   * the table so a foreign character id cannot be used as a filter.
   */
  asCharacterId?: string | null
}

/** Finds which of the table's characters belongs to a given user. */
export interface ICharacterOwnershipReader {
  findCharacterIdsByUserAndTable(userId: string, tableId: string): Promise<string[]>
  characterBelongsToTable(characterId: string, tableId: string): Promise<boolean>
}

/**
 * Derives, server-side, who is asking and therefore what they may see.
 *
 * This replaces the old `?viewer=<characterId>` query param, where the
 * caller picked whose eyes the payload was shaped through — that let any
 * client ask for another character's view or simply omit the param and get
 * the narrator's unfiltered catalog.
 *
 * The role now comes from the actor's relationship to the table:
 *   owner  → everything, unfiltered
 *   guest  → everything, unfiltered, but only if `locations` was granted
 *   player → filtered by whatever their own character knows
 *
 * Still no real auth: `actorId` is client-supplied, so this stops accidental
 * leaks (a player UI asking for the narrator catalog) and makes the rule
 * explicit in one place, but it is not a security boundary.
 */
export class ResolveTableViewerUseCase {
  constructor(
    private access: ITableAccessRepository,
    private users: IUserRepository,
    private characters: ICharacterOwnershipReader
  ) {}

  async execute(input: ResolveViewerInput): Promise<ResolvedViewer> {
    if (!input.actorId) {
      throw new TableAccessError('Informe quem está agindo (actor).', 401)
    }

    const ownerId = await this.access.findTableOwnerUserId(input.tableId)
    if (!ownerId) throw new TableAccessError('Mesa não encontrada.', 404)

    const actor = await this.users.findById(input.actorId)
    if (!actor) throw new TableAccessError('Usuário não encontrado.', 404)

    const grants = await this.access.findGrant(input.tableId, input.actorId)
    const effective = resolveTableAccess({
      userType: actor.type,
      ownsTable: ownerId === input.actorId,
      grants: grants ? [grants.permissions] : [],
    })

    if (effective.role === TableRole.Owner) {
      return { role: ViewerRole.Owner, characterId: await this.previewAs(input), allowed: true }
    }

    if (effective.role === TableRole.Guest) {
      const level = effective.permissions[TableResource.Locations]
      if (level === AccessLevel.None) {
        throw new TableAccessError('Você não tem acesso aos mapas desta mesa.', 403)
      }
      return { role: ViewerRole.Guest, characterId: await this.previewAs(input), allowed: true }
    }

    if (effective.role === TableRole.Player) {
      const characters = await this.characters.findCharacterIdsByUserAndTable(
        input.actorId,
        input.tableId
      )
      // Sem personagem nesta mesa não há conhecimento nenhum a aplicar:
      // devolve lista vazia em vez de vazar o catálogo inteiro.
      // `asCharacter` é ignorado aqui de propósito: um player só enxerga como
      // o próprio personagem, nunca como o de outro.
      return { role: ViewerRole.Player, characterId: characters[0] ?? null, allowed: true }
    }

    throw new TableAccessError('Você não tem acesso a esta mesa.', 403)
  }

  /**
   * Devolve o personagem de preview pedido pelo narrador, ou `null` para manter
   * a visão completa. `null` é o valor normal; um id inválido é erro, para não
   * haver um caminho silencioso que finja estar filtrando sem filtrar.
   */
  private async previewAs(input: ResolveViewerInput): Promise<string | null> {
    const wanted = input.asCharacterId?.trim()
    if (!wanted) return null
    if (!(await this.characters.characterBelongsToTable(wanted, input.tableId))) {
      throw new TableAccessError('Personagem não pertence a esta mesa.', 400)
    }
    return wanted
  }
}
