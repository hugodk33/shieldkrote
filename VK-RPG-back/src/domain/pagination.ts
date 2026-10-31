/**
 * Paginação opt-in compartilhada pelos endpoints de listagem.
 *
 * Regra de ouro da retrocompatibilidade: **sem `limit` no query string, o
 * comportamento é idêntico ao de antes** — o array volta inteiro e nenhum
 * `LIMIT`/`OFFSET` é injetado no SQL. `offset` sozinho continua paginável
 * (`LIMIT -1 OFFSET ?`), porque o SQLite exige a ordem `LIMIT` depois `OFFSET`.
 *
 * Quando o cliente começa a paginar, ele recebe junto o metadado
 * `total`/`limit`/`offset`/`hasMore`, servido no MESMO corpo de antes (apenas
 * campos extras), para que consumidores antigos continuem lendo `items`,
 * `skills`, `characters`, etc. sem quebrar.
 */

export interface PageWindow {
  /** `undefined` = sem teto (legado). */
  limit?: number | undefined
  /** Sempre >= 0. Default 0. */
  offset: number
}

export interface PageMeta {
  total: number
  limit: number | null
  offset: number
  hasMore: boolean
}

/** Lê `?limit=` e `?offset=` de um query string do Express de forma tolerante. */
export function parsePage(query: any): PageWindow {
  const limit = toNonNegativeInt(query?.limit)
  const offset = toNonNegativeInt(query?.offset) ?? 0
  return {
    limit: limit === undefined ? undefined : limit,
    offset,
  }
}

function toNonNegativeInt(raw: any): number | undefined {
  if (raw === undefined || raw === null) return undefined
  if (Array.isArray(raw)) raw = raw[0]
  const s = String(raw).trim()
  if (s === '') return undefined
  const n = Number(s)
  if (!Number.isFinite(n)) return undefined
  return Math.max(0, Math.trunc(n))
}

/**
 * Fragmento SQL a concatenar após o `WHERE <cláusulas>`. Vazio quando o
 * cliente não pediu paginação (mantém o resultado completo de antes).
 */
export function pageSqlClause(w: PageWindow): string {
  if (w.limit === undefined && w.offset <= 0) return ''
  if (w.limit === undefined) return ' LIMIT -1 OFFSET ?'
  return ' LIMIT ? OFFSET ?'
}

/** Parâmetros correspondentes a `pageSqlClause`, na mesma ordem. */
export function pageSqlParams(w: PageWindow): number[] {
  if (w.limit === undefined && w.offset <= 0) return []
  if (w.limit === undefined) return [w.offset]
  return [w.limit, w.offset]
}

/** Metadado do envelope. `limit: null` significa "sem teto". */
export function pageMeta(total: number, w: PageWindow): PageMeta {
  const effective = w.limit ?? total
  return {
    total,
    limit: w.limit ?? null,
    offset: w.offset,
    hasMore: w.offset + effective < total,
  }
}
