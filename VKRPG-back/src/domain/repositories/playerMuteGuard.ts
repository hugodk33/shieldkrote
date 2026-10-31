import { db } from '../../infra/database/database'

/**
 * "Silenciar" um jogador congela as AÇÕES dele na sessão: ele continua vendo a
 * mesa, mas não posta ação, não enfileira e não encerra turno. A marca é da
 * mesa (`game_table_players.is_muted`), e a checagem parte do PERSONAGEM que
 * age — o vínculo personagem -> jogador resolve quem está silenciado.
 *
 * O mestre não é afetado: NPCs e personagens do narrador não têm linha em
 * `game_table_players`, então o join não casa e a ação passa.
 *
 * A guarda mora no repositório (e não no controller) de propósito: por aqui
 * passam TODOS os caminhos que gravam ação do jogador — ação avulsa, fila,
 * encerrar turno e efeito de perícia — num só lugar, sem tocar no wiring.
 */
export class PlayerMutedError extends Error {
  readonly status = 403
  constructor(
    message = 'Você está silenciado nesta mesa — fale com o narrador para liberar as ações.'
  ) {
    super(message)
    this.name = 'PlayerMutedError'
  }
}

/** `true` quando o dono do personagem é um jogador silenciado nesta mesa. */
export const isCharacterOwnerMuted = (characterId: string | null | undefined): boolean => {
  if (!characterId) return false
  const row = db
    .prepare(
      `SELECT 1 AS muted
         FROM game_table_characters c
         JOIN game_table_players p
           ON p.table_id = c.table_id AND p.user_id = c.user_id
        WHERE c.id = ? AND COALESCE(p.is_muted, 0) = 1
        LIMIT 1`
    )
    .get(characterId) as { muted: number } | undefined
  return Boolean(row)
}

/** Lança `PlayerMutedError` se o dono do personagem estiver silenciado. */
export const assertCharacterNotMuted = (characterId: string | null | undefined): void => {
  if (isCharacterOwnerMuted(characterId)) throw new PlayerMutedError()
}
