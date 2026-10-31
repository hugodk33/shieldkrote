import type { Response } from 'express'
import { db } from '../database/database'

/* ============================================================
   TableEvents — hub pub/sub por mesa.
   Guarda os clientes SSE (Response) agrupados por tableId e
   notifica todos quando algo muda na mesa (narração, ação, fila,
   cena, efeito). É um canal "quase-websocket": 1 só direção
   (backend → navegador), sem dependência externa.
   ============================================================ */

export type TableEvent = {
  type: string
  at: number
}

const clients = new Map<string, Set<Response>>()

const HEARTBEAT_MS = 25000

export function subscribeTable(tableId: string, res: Response): () => void {
  let set = clients.get(tableId)
  if (!set) {
    set = new Set()
    clients.set(tableId, set)
  }
  set.add(res)

  const heartbeat = setInterval(() => {
    /* comentário SSE mantém a conexão viva entre eventos */
    try {
      res.write(': ping\n\n')
    } catch {
      /* ignora conexão morta */
    }
  }, HEARTBEAT_MS)

  const cleanup = () => {
    clearInterval(heartbeat)
    const s = clients.get(tableId)
    if (!s) return
    s.delete(res)
    if (s.size === 0) clients.delete(tableId)
  }
  res.on('close', cleanup)

  return cleanup
}

export function publishTable(tableId: string, type: string): void {
  const set = clients.get(tableId)
  if (!set || set.size === 0) return
  const event: TableEvent = { type, at: Date.now() }
  const frame = `event: change\ndata: ${JSON.stringify(event)}\n\n`
  for (const res of set) {
    try {
      res.write(frame)
    } catch {
      /* ignora conexão morta */
    }
  }
}

/* Resolve o tableId de um payload de mutação: usam `table_id` quando
   presente, senão derivam do character_id da fila/efeito. */
export function resolveTableId(payload: Record<string, unknown> | undefined | null): string | null {
  if (!payload) return null
  const direct = payload.table_id
  if (typeof direct === 'string' && direct.trim()) return direct
  const characterId = payload.character_id
  if (typeof characterId === 'string' && characterId.trim()) {
    const row = db
      .prepare(`SELECT table_id FROM game_table_characters WHERE id = ?`)
      .get(characterId) as { table_id?: string } | undefined
    if (row?.table_id) return row.table_id
  }
  return null
}

/* Resolve a mesa de uma location (criar/editar/apagar local). */
export function resolveLocationTableId(locationId: string | null | undefined): string | null {
  if (typeof locationId !== 'string' || !locationId.trim()) return null
  const row = db
    .prepare(`SELECT table_id FROM table_locations WHERE id = ?`)
    .get(locationId) as { table_id?: string } | undefined
  return row?.table_id ?? null
}