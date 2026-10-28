import { db } from '../../infra/database/database'
import type { ITableJoinRequestRepository } from '../irepositories/ITableJoinRequestRepository'
import {
  JoinRole,
  JoinStatus,
  TableMemberRole,
  type JoinRoleValue,
  type JoinStatusValue,
  type TableJoinRequest,
  type TableMember,
} from '../types/TableJoin'

const SELECT_BASE = `
  SELECT
    r.id,
    r.table_id,
    r.user_id,
    r.role,
    r.status,
    r.message,
    r.created_at,
    r.resolved_at,
    r.resolved_by,
    u.username AS user_name,
    u.email    AS user_email,
    u.type     AS user_type
  FROM game_table_join_requests r
  LEFT JOIN users u ON u.id = r.user_id
`

type RawRow = {
  id: string
  table_id: string
  user_id: string
  role: string
  status: string
  message: string | null
  created_at: string | null
  resolved_at: string | null
  resolved_by: string | null
  user_name: string | null
  user_email: string | null
  user_type: number | null
}

const toRequest = (row: RawRow): TableJoinRequest => ({
  id: row.id,
  table_id: row.table_id,
  user_id: row.user_id,
  role: row.role === JoinRole.CoNarrator ? JoinRole.CoNarrator : JoinRole.Player,
  status:
    row.status === JoinStatus.Approved
      ? JoinStatus.Approved
      : row.status === JoinStatus.Rejected
        ? JoinStatus.Rejected
        : JoinStatus.Pending,
  message: row.message,
  created_at: row.created_at,
  resolved_at: row.resolved_at,
  resolved_by: row.resolved_by,
  user: row.user_id
    ? {
        id: row.user_id,
        name: row.user_name ?? '',
        username: row.user_name ?? '',
        email: row.user_email ?? '',
        type: row.user_type ?? 1,
      }
    : null,
})

export class TableJoinRequestRepository implements ITableJoinRequestRepository {
  async findByTable(tableId: string): Promise<TableJoinRequest[]> {
    const rows = db
      .prepare(`${SELECT_BASE} WHERE r.table_id = ? ORDER BY r.created_at DESC`)
      .all(tableId) as RawRow[]
    return rows.map(toRequest)
  }

  async findPendingByTable(tableId: string): Promise<TableJoinRequest[]> {
    const rows = db
      .prepare(
        `${SELECT_BASE} WHERE r.table_id = ? AND r.status = 'pending' ORDER BY r.created_at ASC`
      )
      .all(tableId) as RawRow[]
    return rows.map(toRequest)
  }

  async findByUser(userId: string): Promise<TableJoinRequest[]> {
    const rows = db
      .prepare(`${SELECT_BASE} WHERE r.user_id = ? ORDER BY r.created_at DESC`)
      .all(userId) as RawRow[]
    return rows.map(toRequest)
  }

  async find(tableId: string, userId: string): Promise<TableJoinRequest | null> {
    const row = db
      .prepare(`${SELECT_BASE} WHERE r.table_id = ? AND r.user_id = ?`)
      .get(tableId, userId) as RawRow | undefined
    return row ? toRequest(row) : null
  }

  async save(request: {
    id: string
    table_id: string
    user_id: string
    role: JoinRoleValue
    message: string | null
  }): Promise<TableJoinRequest> {
    db.prepare(`
      INSERT INTO game_table_join_requests (id, table_id, user_id, role, status, message)
      VALUES (@id, @table_id, @user_id, @role, 'pending', @message)
      ON CONFLICT (table_id, user_id) DO UPDATE SET
        role        = excluded.role,
        message     = excluded.message,
        status      = 'pending',
        created_at  = CURRENT_TIMESTAMP,
        resolved_at = NULL,
        resolved_by = NULL
    `).run({
      id: request.id,
      table_id: request.table_id,
      user_id: request.user_id,
      role: request.role,
      message: request.message,
    })

    const saved = await this.find(request.table_id, request.user_id)
    if (!saved) throw new Error('Falha ao registrar a solicitação de entrada.')
    return saved
  }

  async resolve(
    tableId: string,
    userId: string,
    status: JoinStatusValue,
    resolvedBy: string | null
  ): Promise<TableJoinRequest | null> {
    db.prepare(`
      UPDATE game_table_join_requests
      SET status = ?, resolved_at = CURRENT_TIMESTAMP, resolved_by = ?
      WHERE table_id = ? AND user_id = ?
    `).run(status, resolvedBy, tableId, userId)
    return this.find(tableId, userId)
  }

  async remove(tableId: string, userId: string): Promise<boolean> {
    const result = db
      .prepare('DELETE FROM game_table_join_requests WHERE table_id = ? AND user_id = ?')
      .run(tableId, userId)
    return result.changes > 0
  }

  async isPlayer(tableId: string, userId: string): Promise<boolean> {
    const row = db
      .prepare(
        'SELECT 1 AS ok FROM game_table_players WHERE table_id = ? AND user_id = ? LIMIT 1'
      )
      .get(tableId, userId) as { ok: number } | undefined
    return Boolean(row)
  }

  async addPlayer(tableId: string, userId: string): Promise<void> {
    if (await this.isPlayer(tableId, userId)) return
    db.prepare('INSERT INTO game_table_players (id, table_id, user_id) VALUES (?, ?, ?)').run(
      crypto.randomUUID(),
      tableId,
      userId
    )
  }

  async listPlayerIds(tableId: string): Promise<string[]> {
    const rows = db
      .prepare('SELECT user_id FROM game_table_players WHERE table_id = ?')
      .all(tableId) as { user_id: string | null }[]
    return rows.map((r) => r.user_id).filter((id): id is string => Boolean(id))
  }

  /**
   * Jogadores da mesa com o usuário e a ficha resolvidos. Um usuário pode ter
   * mais de uma ficha na mesa; o painel mostra a primeira ativa (ou a primeira,
   * se nenhuma estiver ativa). Duplicatas de vínculo (a tabela não é UNIQUE) são
   * colapsadas por `user_id`.
   */
  async listPlayerMembers(tableId: string): Promise<TableMember[]> {
    const rows = db
      .prepare(
        `SELECT
           p.user_id      AS user_id,
           u.username     AS username,
           u.email        AS email,
           u.type         AS user_type,
           COALESCE(p.is_muted, 0) AS is_muted,
           c.id           AS character_id,
           cs.name        AS character_name,
           COALESCE(c.is_active, 1) AS character_active
         FROM game_table_players p
         LEFT JOIN users u ON u.id = p.user_id
         LEFT JOIN game_table_characters c
           ON c.table_id = p.table_id AND c.user_id = p.user_id
         LEFT JOIN game_table_character_sheets cs ON cs.character_id = c.id
         WHERE p.table_id = ?
         ORDER BY p.rowid ASC, COALESCE(c.is_active, 0) DESC`
      )
      .all(tableId) as {
      user_id: string | null
      username: string | null
      email: string | null
      user_type: number | null
      is_muted: number
      character_id: string | null
      character_name: string | null
      character_active: number
    }[]

    const byUser = new Map<string, TableMember>()
    for (const row of rows) {
      if (!row.user_id) continue
      const member = byUser.get(row.user_id)
      if (member) {
        // Mantém a primeira ficha (a mais ativa, pelo ORDER BY) e não perde o mudo.
        if (!member.characterId && row.character_id) {
          member.characterId = row.character_id
          member.characterName = row.character_name
          member.characterActive = Boolean(row.character_active)
        }
        continue
      }
      byUser.set(row.user_id, {
        userId: row.user_id,
        username: row.username ?? '',
        email: row.email ?? '',
        type: row.user_type ?? 1,
        role: TableMemberRole.Player,
        isMuted: Boolean(row.is_muted),
        characterId: row.character_id ?? null,
        characterName: row.character_name ?? null,
        characterActive: Boolean(row.character_active),
      })
    }
    return Array.from(byUser.values())
  }

  async removePlayer(tableId: string, userId: string): Promise<boolean> {
    const result = db
      .prepare('DELETE FROM game_table_players WHERE table_id = ? AND user_id = ?')
      .run(tableId, userId)
    return result.changes > 0
  }

  async setMuted(tableId: string, userId: string, muted: boolean): Promise<boolean> {
    const result = db
      .prepare('UPDATE game_table_players SET is_muted = ? WHERE table_id = ? AND user_id = ?')
      .run(muted ? 1 : 0, tableId, userId)
    return result.changes > 0
  }

  async isMuted(tableId: string, userId: string): Promise<boolean> {
    const row = db
      .prepare(
        'SELECT is_muted FROM game_table_players WHERE table_id = ? AND user_id = ? LIMIT 1'
      )
      .get(tableId, userId) as { is_muted: number } | undefined
    return Boolean(row?.is_muted)
  }

  async setCharactersActive(tableId: string, userId: string, active: boolean): Promise<void> {
    db.prepare(
      'UPDATE game_table_characters SET is_active = ? WHERE table_id = ? AND user_id = ?'
    ).run(active ? 1 : 0, tableId, userId)
  }
}
