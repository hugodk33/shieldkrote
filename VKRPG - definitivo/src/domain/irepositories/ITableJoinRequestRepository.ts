import type { JoinRoleValue, JoinStatusValue, TableJoinRequest, TableMember } from '../types/TableJoin'

export interface ITableJoinRequestRepository {
  /** Todas as solicitações de uma mesa, com o usuário já resolvido. */
  findByTable(tableId: string): Promise<TableJoinRequest[]>
  /** Solicitações pendentes de uma mesa. */
  findPendingByTable(tableId: string): Promise<TableJoinRequest[]>
  /** Solicitações de um usuário em todas as mesas. */
  findByUser(userId: string): Promise<TableJoinRequest[]>
  /** A solicitação de um usuário numa mesa, se existir. */
  find(tableId: string, userId: string): Promise<TableJoinRequest | null>
  /**
   * Cria ou reabre a solicitação (upsert por `table_id` + `user_id`).
   * Reabrir zera a resolução anterior e volta para `pending`.
   */
  save(request: {
    id: string
    table_id: string
    user_id: string
    role: JoinRoleValue
    message: string | null
  }): Promise<TableJoinRequest>
  /** Marca a solicitação como aprovada/recusada. */
  resolve(
    tableId: string,
    userId: string,
    status: JoinStatusValue,
    resolvedBy: string | null
  ): Promise<TableJoinRequest | null>
  /** Apaga a solicitação (o usuário cancela o pedido). */
  remove(tableId: string, userId: string): Promise<boolean>

  /* --- associação à mesa (efeitos da aprovação) --- */
  /** Já é jogador desta mesa (`game_table_players`). */
  isPlayer(tableId: string, userId: string): Promise<boolean>
  /** Insere o jogador na mesa se ainda não houver linha. */
  addPlayer(tableId: string, userId: string): Promise<void>
  /** Ids de jogadores desta mesa. */
  listPlayerIds(tableId: string): Promise<string[]>

  /* --- elenco (painel "Elenco da mesa") --- */
  /** Jogadores da mesa com usuário, ficha e estado de mudo. */
  listPlayerMembers(tableId: string): Promise<TableMember[]>
  /** Tira o vínculo do jogador com a mesa. `true` se havia linha. */
  removePlayer(tableId: string, userId: string): Promise<boolean>
  /** Liga/desliga o silêncio de um jogador. `true` se havia linha. */
  setMuted(tableId: string, userId: string, muted: boolean): Promise<boolean>
  /** Já está silenciado nesta mesa. */
  isMuted(tableId: string, userId: string): Promise<boolean>
  /** Ativa/desativa todas as fichas do usuário nesta mesa. */
  setCharactersActive(tableId: string, userId: string, active: boolean): Promise<void>
}
