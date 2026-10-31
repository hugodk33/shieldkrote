// src/domain/types/TableAccess.ts
import { isTableOwner, UserType } from './UserType'

/**
 * Recursos de uma mesa que podem ser liberados individualmente a um
 * narrador convidado. A ordem é a de exibição na configuração.
 */
export const TableResource = {
  Scenes: 'scenes',
  Locations: 'locations',
  Characters: 'characters',
  Items: 'items',
  Skills: 'skills',
  Advantages: 'advantages',
  Disadvantages: 'disadvantages',
  Visibility: 'visibility',
  Modifiers: 'modifiers',
  Settings: 'settings',
} as const

export type TableResourceKey = (typeof TableResource)[keyof typeof TableResource]

export const TABLE_RESOURCES: readonly TableResourceKey[] = Object.values(TableResource)

export const isTableResource = (value: unknown): value is TableResourceKey =>
  typeof value === 'string' && (TABLE_RESOURCES as readonly string[]).includes(value)

/** O que um convidado pode fazer com um recurso liberado. */
export const AccessLevel = {
  None: 'none',
  Read: 'read',
  Write: 'write',
} as const

export type AccessLevelValue = (typeof AccessLevel)[keyof typeof AccessLevel]

export const isAccessLevel = (value: unknown): value is AccessLevelValue =>
  value === AccessLevel.None || value === AccessLevel.Read || value === AccessLevel.Write

/** Mapa `{ recurso: 'read' | 'write' }` serializado na coluna `permissions`. */
export type PermissionMap = Partial<Record<TableResourceKey, Exclude<AccessLevelValue, 'none'>>>

/** Papel efetivo de alguém em relação a uma mesa. */
export const TableRole = {
  Owner: 'owner',
  Guest: 'guest',
  Player: 'player',
  None: 'none',
} as const

export type TableRoleValue = (typeof TableRole)[keyof typeof TableRole]

/** Resposta canônica dos endpoints de configuração de acesso. */
export interface TableAccessGrant {
  id: string
  table_id: string
  user_id: string
  permissions: PermissionMap
  granted_by: string | null
  created_at: string | null
  user: {
    id: string
    name: string
    username: string
    email: string
    type: number
  } | null
}

export interface EffectiveTableAccess {
  role: TableRoleValue
  /** Permissão do usuário em cada recurso da mesa. */
  permissions: Record<TableResourceKey, AccessLevelValue>
  /** `true` quando pode escrever em pelo menos um recurso. */
  canWrite: boolean
  /** `true` quando enxerga pelo menos um recurso. */
  canRead: boolean
}

const NONE_EVERYWHERE = () =>
  TABLE_RESOURCES.reduce(
    (acc, key) => {
      acc[key] = AccessLevel.None
      return acc
    },
    {} as Record<TableResourceKey, AccessLevelValue>
  )

const FULL_EVERYWHERE = () =>
  TABLE_RESOURCES.reduce(
    (acc, key) => {
      acc[key] = AccessLevel.Write
      return acc
    },
    {} as Record<TableResourceKey, AccessLevelValue>
  )

export const emptyPermissions = (): Record<TableResourceKey, AccessLevelValue> => NONE_EVERYWHERE()

export const fullPermissions = (): Record<TableResourceKey, AccessLevelValue> => FULL_EVERYWHERE()

/** Descarta chaves desconhecidas e normaliza os valores de nível. */
export const sanitizePermissions = (raw: unknown): PermissionMap => {
  const out: PermissionMap = {}
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!isTableResource(key)) continue
    if (value !== AccessLevel.Read && value !== AccessLevel.Write) continue
    out[key] = value
  }
  return out
}

export const parsePermissions = (raw: unknown): PermissionMap => {
  if (typeof raw !== 'string') return sanitizePermissions(raw)
  try {
    return sanitizePermissions(JSON.parse(raw))
  } catch {
    return {}
  }
}

export interface ResolveAccessInput {
  /** Tipo do usuário que está agindo (`users.type`). */
  userType: number | null | undefined
  /** `true` quando o usuário é o narrador dono da mesa. */
  ownsTable: boolean
  /** Concessões do usuário nesta mesa, se houver. */
  grants?: PermissionMap[]
}

/**
 * Resolve o papel e as permissões de um usuário sobre uma mesa.
 *
 * O dono sempre vence. Qualquer não-dono com concessão explícita nesta mesa é
 * um convidado (co-narrador) e só enxerga o que foi concedido — isso vale tanto
 * para o narrador convidado (type 3) quanto para um narrador titular de outra
 * mesa aprovado como co-narrador aqui (type 0). Um jogador nunca ganha acesso
 * por este caminho — o que ele vê é regido pelo sistema de visibilidade de
 * personagem, que é outra coisa.
 */
export const resolveTableAccess = (input: ResolveAccessInput): EffectiveTableAccess => {
  if (isTableOwner(input.userType) && input.ownsTable) {
    return {
      role: TableRole.Owner,
      permissions: fullPermissions(),
      canWrite: true,
      canRead: true,
    }
  }

  if (!input.ownsTable && (input.grants?.length ?? 0) > 0) {
    const merged: Record<TableResourceKey, AccessLevelValue> = NONE_EVERYWHERE()
    // Concessões são aditivas: o mais permissivo entre as linhas vence.
    for (const grant of input.grants ?? []) {
      for (const key of TABLE_RESOURCES) {
        const level = grant?.[key]
        if (level === AccessLevel.Write) merged[key] = AccessLevel.Write
        else if (level === AccessLevel.Read && merged[key] === AccessLevel.None) merged[key] = AccessLevel.Read
      }
    }
    const values = TABLE_RESOURCES.map((key) => merged[key])
    return {
      role: TableRole.Guest,
      permissions: merged,
      canWrite: values.includes(AccessLevel.Write),
      canRead: values.some((v) => v !== AccessLevel.None),
    }
  }

  if (input.userType === UserType.Player) {
    return { role: TableRole.Player, permissions: NONE_EVERYWHERE(), canWrite: false, canRead: false }
  }

  return { role: TableRole.None, permissions: NONE_EVERYWHERE(), canWrite: false, canRead: false }
}
