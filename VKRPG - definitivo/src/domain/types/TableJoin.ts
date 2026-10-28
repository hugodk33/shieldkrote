// src/domain/types/TableJoin.ts
import { UserType } from './UserType'

/**
 * Fluxo de pré-aprovação de entrada numa mesa.
 *
 * Um usuário se convida (pela landing page `/join/[tableId]`) e isso cria uma
 * SOLICITAÇÃO pendente. Nada entra na mesa sozinho: o dono aprova ou recusa.
 * Aprovar um jogador escreve em `game_table_players`; aprovar um co-narrador
 * cria a concessão de acesso em `game_table_access` (via fluxo normal).
 *
 * Sem autenticação: a identidade chega pela URL/body, como o resto do app. As
 * validações aqui são de regra de negócio (tipo do usuário bate com o papel?),
 * não de segurança.
 */
export const JoinRole = {
  Player: 'player',
  CoNarrator: 'co_narrator',
} as const

export type JoinRoleValue = (typeof JoinRole)[keyof typeof JoinRole]

export const JOIN_ROLES: readonly JoinRoleValue[] = Object.values(JoinRole)

export const isJoinRole = (value: unknown): value is JoinRoleValue =>
  typeof value === 'string' && (JOIN_ROLES as readonly string[]).includes(value)

export const JoinStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
} as const

export type JoinStatusValue = (typeof JoinStatus)[keyof typeof JoinStatus]

export const isJoinStatus = (value: unknown): value is JoinStatusValue =>
  value === JoinStatus.Pending || value === JoinStatus.Approved || value === JoinStatus.Rejected

/** Não-jogador pode entrar como co-narrador; só o tipo Jogador entra como jogador. */
export const roleAllowedForUserType = (
  role: JoinRoleValue,
  type: number | null | undefined
): boolean => {
  if (role === JoinRole.Player) return type === UserType.Player
  // co-narrador: narrador titular de outra mesa ou narrador convidado.
  return type === UserType.GuestNarrator || type === UserType.Narrator
}

export interface TableJoinRequest {
  id: string
  table_id: string
  user_id: string
  role: JoinRoleValue
  status: JoinStatusValue
  message: string | null
  created_at: string | null
  resolved_at: string | null
  resolved_by: string | null
  user: {
    id: string
    name: string
    username: string
    email: string
    type: number
  } | null
}

/** Candidato exibido na landing page para o usuário se identificar. */
export interface TableJoinCandidate {
  id: string
  username: string
  email: string
  type: number
}

/** Papel de alguém vinculado à mesa, para o painel "Elenco da mesa". */
export const TableMemberRole = {
  /** Narrador titular (dono da mesa). */
  Owner: 'owner',
  /** Narrador convidado (tem concessão em `game_table_access`). */
  CoNarrator: 'co_narrator',
  /** Jogador do elenco (`game_table_players`). */
  Player: 'player',
} as const

export type TableMemberRoleValue = (typeof TableMemberRole)[keyof typeof TableMemberRole]

/**
 * Uma pessoa vinculada à mesa: dono, co-narrador ou jogador. É o que o painel
 * de configurações mostra para aprovar/silenciar/remover.
 *
 * `isMuted` só faz sentido para jogadores; dono e co-narradores vêm sempre com
 * `false`. `character*` descreve a ficha do jogador na mesa (desativada quando
 * ele é removido).
 */
export interface TableMember {
  userId: string
  username: string
  email: string
  type: number
  role: TableMemberRoleValue
  isMuted: boolean
  characterId: string | null
  characterName: string | null
  characterActive: boolean
}
