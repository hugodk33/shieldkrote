/**
 * Fachada `db` — mesma API síncrona do better-sqlite3, agora sobre PostgreSQL.
 *
 * O código de domínio inteiro chama `db.prepare(sql).get/all/run`, `db.exec` e
 * `db.transaction`. Em vez de reescrever 550 call sites para `async`, mantemos a
 * superfície e trocamos o motor por trás (ver `pgSync.ts` / `pgWorker.js`).
 */
import { PgSyncConnection } from './pgSync'

export interface RunResult {
  changes: number
  lastInsertRowid: number | bigint
}

export class Statement<Row = any> {
  constructor(private readonly connection: PgSyncConnection, private readonly sql: string) {}

  /** Primeira linha do resultado (ou `undefined`). */
  get(...params: any[]): Row | undefined {
    return this.all(...params)[0]
  }

  /** Todas as linhas do resultado. */
  all(...params: any[]): Row[] {
    return this.connection.query(this.sql, params).rows as Row[]
  }

  /**
   * Executa a escrita. `changes` espelha o `.changes` do better-sqlite3
   * (linhas afetadas), que o domínio usa para detectar "não encontrado".
   */
  run(...params: any[]): RunResult {
    const result = this.connection.query(this.sql, params)
    return { changes: result.rowCount, lastInsertRowid: 0 }
  }
}

export type TransactionFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => ReturnType<T>

export class Database {
  private readonly connection = new PgSyncConnection()

  prepare<Row = any>(sql: string): Statement<Row> {
    return new Statement<Row>(this.connection, sql)
  }

  /** Executa um script com uma ou várias instruções separadas por `;`. */
  exec(sql: string): this {
    this.connection.exec(sql)
    return this
  }

  /** No-op: no SQLite ligava/desligava as FKs; no Postgres são sempre validadas. */
  pragma(_source: string, _options?: unknown): unknown {
    return undefined
  }

  /**
   * Envolve `fn` numa transação. Suporta aninhamento (vira SAVEPOINT no worker)
   * e devolve o valor retornado por `fn`, como no better-sqlite3.
   */
  transaction<T extends (...args: any[]) => any>(fn: T): TransactionFunction<T> {
    return ((...args: Parameters<T>): ReturnType<T> => {
      this.connection.begin()
      let result: ReturnType<T>
      try {
        result = fn(...args) as ReturnType<T>
      } catch (error) {
        try {
          this.connection.rollback()
        } catch {
          /* erro original é o que importa */
        }
        throw error
      }
      this.connection.commit()
      return result
    }) as TransactionFunction<T>
  }

  close(): void {
    /* o worker encerra junto com o processo */
  }
}

const db = new Database()

export { db }
