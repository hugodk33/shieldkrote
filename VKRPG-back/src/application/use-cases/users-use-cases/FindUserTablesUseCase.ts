import type { IUserRepository } from '../../../domain/irepositories/IUserRepository'
import type { IGameTableRepository } from '../../../domain/irepositories/IGameTableRepository'
import type { ITableAccessRepository } from '../../../domain/irepositories/ITableAccessRepository'
import type { PublicUser } from '../../../domain/entities/User'
import type { GameTableWithNarrator } from '../../../domain/types/GameTableTypes'

export interface UserTables {
  user: PublicUser
  /** Mesas que o usuário narra (dono ou convidado com algum recurso liberado). */
  narrating: GameTableWithNarrator[]
  /** Mesas em que o usuário tem assento em `game_table_players`. */
  playing: GameTableWithNarrator[]
}

/**
 * Resolve todas as mesas de um usuário.
 *
 * Um usuário pode ter mais de uma mesa em cada papel — e legitimamente
 * aparecer nos dois lados (um narrador com personagem na própria mesa).
 * As concessões de narrador convidado só contam quando liberam pelo menos
 * um recurso; uma linha com tudo `none` não deve virar mesa no hub.
 */
export class FindUserTablesUseCase {
  constructor(
    private users: IUserRepository,
    private tables: IGameTableRepository,
    private access: ITableAccessRepository
  ) {}

  async execute(userId: string): Promise<UserTables | null> {
    const user = await this.users.findById(userId)
    if (!user) return null

    const [allTables, grants] = await Promise.all([
      this.tables.findAll(),
      this.access.findByUser(userId),
    ])

    const guestTableIds = new Set(
      grants
        .filter((grant) => Object.keys(grant.permissions ?? {}).length > 0)
        .map((grant) => grant.table_id)
    )

    const narrating = allTables.filter(
      (table) => table.narrator?.userId === userId || guestTableIds.has(table.id)
    )

    const playing = allTables.filter((table) =>
      (table.players ?? []).some((player) => player.userId === userId)
    )

    return { user, narrating, playing }
  }
}
