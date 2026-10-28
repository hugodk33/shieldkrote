import { db } from '../../infra/database/database'
import type { ITableAccessRepository } from '../irepositories/ITableAccessRepository'
import {
  parsePermissions,
  type PermissionMap,
  type TableAccessGrant,
} from '../types/TableAccess'

const SELECT_BASE = `
  SELECT
    a.id,
    a.table_id,
    a.user_id,
    a.permissions,
    a.granted_by,
    a.created_at,
    u.username  AS user_name,
    u.email     AS user_email,
    u.type      AS user_type
  FROM game_table_access a
  LEFT JOIN users u ON u.id = a.user_id
`

type RawGrantRow = {
  id: string
  table_id: string
  user_id: string
  permissions: string
  granted_by: string | null
  created_at: string | null
  user_name: string | null
  user_email: string | null
  user_type: number | null
}

const toGrant = (row: RawGrantRow): TableAccessGrant => ({
  id: row.id,
  table_id: row.table_id,
  user_id: row.user_id,
  permissions: parsePermissions(row.permissions),
  granted_by: row.granted_by,
  created_at: row.created_at,
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

export class TableAccessRepository implements ITableAccessRepository {
  async findByTable(tableId: string): Promise<TableAccessGrant[]> {
    const rows = db.prepare(`${SELECT_BASE} WHERE a.table_id = ? ORDER BY u.username`).all(tableId) as RawGrantRow[]
    return rows.map(toGrant)
  }

  async findByUser(userId: string): Promise<TableAccessGrant[]> {
    const rows = db
      .prepare(`${SELECT_BASE} WHERE a.user_id = ? ORDER BY a.table_id`)
      .all(userId) as RawGrantRow[]
    return rows.map(toGrant)
  }

  async findGrant(tableId: string, userId: string): Promise<TableAccessGrant | null> {
    const row = db
      .prepare(`${SELECT_BASE} WHERE a.table_id = ? AND a.user_id = ?`)
      .get(tableId, userId) as RawGrantRow | undefined
    return row ? toGrant(row) : null
  }

  async save(grant: {
    id: string
    table_id: string
    user_id: string
    permissions: PermissionMap
    granted_by: string | null
  }): Promise<TableAccessGrant> {
    db.prepare(`
      INSERT INTO game_table_access (id, table_id, user_id, permissions, granted_by)
      VALUES (@id, @table_id, @user_id, @permissions, @granted_by)
      ON CONFLICT (table_id, user_id) DO UPDATE SET
        permissions = excluded.permissions,
        granted_by  = excluded.granted_by
    `).run({
      id: grant.id,
      table_id: grant.table_id,
      user_id: grant.user_id,
      permissions: JSON.stringify(grant.permissions ?? {}),
      granted_by: grant.granted_by,
    })

    const saved = await this.findGrant(grant.table_id, grant.user_id)
    if (!saved) throw new Error('Falha ao salvar a concessão de acesso à mesa.')
    return saved
  }

  async revoke(tableId: string, userId: string): Promise<boolean> {
    const result = db
      .prepare('DELETE FROM game_table_access WHERE table_id = ? AND user_id = ?')
      .run(tableId, userId)
    return result.changes > 0
  }

  async findByTableForUsers(
    tableId: string,
    userIds: string[]
  ): Promise<Map<string, PermissionMap[]>> {
    const out = new Map<string, PermissionMap[]>()
    if (userIds.length === 0) return out

    const unique = [...new Set(userIds.filter(Boolean))]
    if (unique.length === 0) return out

    const placeholders = unique.map(() => '?').join(', ')
    const rows = db
      .prepare(
        `SELECT user_id, permissions FROM game_table_access WHERE table_id = ? AND user_id IN (${placeholders})`
      )
      .all(tableId, ...unique) as { user_id: string; permissions: string }[]

    for (const row of rows) {
      const list = out.get(row.user_id) ?? []
      list.push(parsePermissions(row.permissions))
      out.set(row.user_id, list)
    }
    return out
  }

  async findTableOwnerUserId(tableId: string): Promise<string | null> {
    const row = db
      .prepare(`
        SELECT n.user_id AS owner_id
        FROM game_tables g
        LEFT JOIN narrators n ON n.id = g.narrator_id
        WHERE g.id = ?
        LIMIT 1
      `)
      .get(tableId) as { owner_id: string | null } | undefined
    return row?.owner_id ?? null
  }

  async tableExists(tableId: string): Promise<boolean> {
    const row = db.prepare('SELECT 1 AS ok FROM game_tables WHERE id = ? LIMIT 1').get(tableId) as
      | { ok: number }
      | undefined
    return Boolean(row)
  }
}
