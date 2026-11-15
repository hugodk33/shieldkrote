/**
 * Ponte síncrona para o PostgreSQL.
 *
 * O backend inteiro foi escrito em cima da API síncrona do better-sqlite3
 * (`db.prepare(...).get/all/run`, `db.transaction`). Reescrever tudo para
 * `async/await` na véspera do deploy era inviável, então mantemos a API e
 * trocamos o motor: um worker thread segura a conexão `pg` e a thread principal
 * bloqueia em `Atomics.wait` até o resultado chegar pelo SharedArrayBuffer.
 *
 * Consequência: as queries são serializadas (uma conexão só), exatamente como
 * o SQLite fazia. Para um MVP é o comportamento esperado.
 */
import { Worker } from 'node:worker_threads'
import fs from 'node:fs'
import path from 'node:path'

const STATE = 0
const LENGTH = 1
const LAST = 2
const CHUNK_SIZE = 4 * 1024 * 1024
const TIMEOUT_MS = 180_000

/** Lê `.env` (cwd e cwd/VK-RPG-back) sem adicionar dependência. */
function loadEnv(): void {
  const candidates = [path.join(process.cwd(), '.env'), path.join(process.cwd(), 'VK-RPG-back', '.env')]
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue
    const content = fs.readFileSync(file, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line)
      if (!match) continue
      const key = match[1]!
      if (process.env[key] !== undefined) continue
      let value = match[2]!
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      process.env[key] = value
    }
    break
  }
}

function resolveDatabaseUrl(): string {
  loadEnv()
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL

  const host = process.env.PGHOST || 'localhost'
  const port = process.env.PGPORT || '5432'
  const user = process.env.PGUSER || 'postgres'
  const password = process.env.PGPASSWORD || 'Hug0@m0rim'
  const database = process.env.PGDATABASE || 'vkrpg'

  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`
}

function resolveWorkerPath(): string {
  const candidates = [
    path.join(__dirname, 'pgWorker.js'),
    path.join(process.cwd(), 'src', 'infra', 'database', 'pgWorker.js'),
    path.join(process.cwd(), 'dist', 'infra', 'database', 'pgWorker.js'),
  ]
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate
  }
  return candidates[0]!
}

export interface QueryResult {
  rows: any[]
  rowCount: number
}

interface WorkerPayload {
  ok: boolean
  rows?: any[]
  rowCount?: number
  error?: {
    message: string
    code?: string
    detail?: string
    hint?: string
    constraint?: string
    position?: string
  }
}

export class PgSyncConnection {
  private readonly worker: Worker
  private readonly control: Int32Array
  private readonly buffer: Uint8Array
  private readonly workerError: { value: Error | null } = { value: null }

  constructor() {
    const shared = new SharedArrayBuffer(16 + CHUNK_SIZE)
    this.control = new Int32Array(shared, 0, 4)
    this.buffer = new Uint8Array(shared, 16)

    this.worker = new Worker(resolveWorkerPath(), {
      workerData: { sab: shared, databaseUrl: resolveDatabaseUrl() },
    })
    // Não segura o processo aberto (o SQLite também não segurava).
    this.worker.unref()
    this.worker.on('error', (error: Error) => {
      this.workerError.value = error
    })
  }

  private request(message: Record<string, unknown>): WorkerPayload {
    if (this.workerError.value) throw this.workerError.value

    Atomics.store(this.control, STATE, 0)
    this.worker.postMessage(message)

    const parts: Buffer[] = []
    for (;;) {
      if (Atomics.load(this.control, STATE) !== 1) {
        const waited = Atomics.wait(this.control, STATE, 0, TIMEOUT_MS)
        if (waited === 'timed-out') {
          throw new Error('Timeout ao consultar o PostgreSQL (worker não respondeu).')
        }
      }
      if (this.workerError.value) throw this.workerError.value

      const length = Atomics.load(this.control, LENGTH)
      const isLast = Atomics.load(this.control, LAST)
      parts.push(Buffer.from(this.buffer.subarray(0, length)))

      Atomics.store(this.control, STATE, 0)
      Atomics.notify(this.control, STATE)
      if (isLast === 1) break
    }

    const payload = JSON.parse(Buffer.concat(parts).toString('utf8')) as WorkerPayload
    if (!payload.ok) {
      const details = payload.error
      const error = new Error(details?.message || 'Erro desconhecido no PostgreSQL') as Error & {
        code?: string
        detail?: string
        hint?: string
        constraint?: string
        position?: string
      }
      if (details?.code) error.code = details.code
      if (details?.detail) error.detail = details.detail
      if (details?.hint) error.hint = details.hint
      if (details?.constraint) error.constraint = details.constraint
      if (details?.position) error.position = details.position
      throw error
    }

    return payload
  }

  query(sql: string, params: unknown[] = []): QueryResult {
    const result = this.request({ kind: 'query', sql, params })
    return { rows: result.rows ?? [], rowCount: result.rowCount ?? 0 }
  }

  exec(sql: string): void {
    this.request({ kind: 'exec', sql })
  }

  begin(): void {
    this.request({ kind: 'begin' })
  }

  commit(): void {
    this.request({ kind: 'commit' })
  }

  rollback(): void {
    this.request({ kind: 'rollback' })
  }
}
