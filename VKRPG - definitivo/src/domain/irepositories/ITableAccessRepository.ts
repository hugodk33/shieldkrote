import type { PermissionMap, TableAccessGrant } from '../types/TableAccess'

export interface ITableAccessRepository {
  /** Todas as concessões de uma mesa, com o usuário já resolvido. */
  findByTable(tableId: string): Promise<TableAccessGrant[]>
  /** Concessões de um usuário em todas as mesas. */
  findByUser(userId: string): Promise<TableAccessGrant[]>
  findGrant(tableId: string, userId: string): Promise<TableAccessGrant | null>
  /** Cria ou substitui a concessão (upsert por `table_id` + `user_id`). */
  save(grant: {
    id: string
    table_id: string
    user_id: string
    permissions: PermissionMap
    granted_by: string | null
  }): Promise<TableAccessGrant>
  revoke(tableId: string, userId: string): Promise<boolean>
  /** Concessões de vários usuários numa mesma mesa, indexadas por `user_id`. */
  findByTableForUsers(tableId: string, userIds: string[]): Promise<Map<string, PermissionMap[]>>
  /** `user_id` do narrador titular da mesa (o dono), se a mesa existir. */
  findTableOwnerUserId(tableId: string): Promise<string | null>
  /** `true` quando a mesa existe em alguma variante de idioma. */
  tableExists(tableId: string): Promise<boolean>
}
