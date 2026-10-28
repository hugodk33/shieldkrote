// src/domain/types/UserType.ts

/**
 * Tipos de usuário do sistema.
 *
 * `0` e `1` são históricos e não podem mudar. `2` já era assumido como
 * "administrador" pelo frontend (que filtra `type !== 2` ao montar listas de
 * jogadores) mas nunca existiu no banco — por isso ocupá-lo não quebra dado
 * algum. `3` é o novo papel deste trabalho: narrador convidado, que não é dono
 * da mesa e só enxerga/edita os recursos que o narrador titular liberar.
 */
export const UserType = {
  Narrator: 0,
  Player: 1,
  Admin: 2,
  GuestNarrator: 3,
} as const

export type UserTypeValue = (typeof UserType)[keyof typeof UserType]

const ALL_TYPES: readonly number[] = Object.values(UserType)

export const isUserType = (value: unknown): value is UserTypeValue =>
  typeof value === 'number' && ALL_TYPES.includes(value)

/** Narrador titular e admin: donos da mesa, com acesso irrestrito. */
export const isTableOwner = (type: number | null | undefined): boolean =>
  type === UserType.Narrator || type === UserType.Admin

/** Narrador convidado: tem acesso concedido por mesa, nunca é dono. */
export const isGuestNarrator = (type: number | null | undefined): boolean =>
  type === UserType.GuestNarrator

/** Tipos que participam do mundo da mesa, mas não a donam. */
export const isTableStaff = (type: number | null | undefined): boolean =>
  isTableOwner(type) || isGuestNarrator(type)

/** Tipos que podem receber um personagem de jogador. */
export const canBeAssignedCharacter = (type: number | null | undefined): boolean =>
  type === UserType.Player || type === UserType.Narrator || type === UserType.GuestNarrator

export const USER_TYPE_LABELS: Record<UserTypeValue, { pt: string; en: string }> = {
  [UserType.Narrator]: { pt: 'Narrador', en: 'Narrator' },
  [UserType.Player]: { pt: 'Jogador', en: 'Player' },
  [UserType.Admin]: { pt: 'Administrador', en: 'Administrator' },
  [UserType.GuestNarrator]: { pt: 'Narrador convidado', en: 'Guest Narrator' },
}
