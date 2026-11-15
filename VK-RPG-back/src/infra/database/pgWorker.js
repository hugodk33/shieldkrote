'use strict'
/**
 * Worker que mantém a conexão real com o PostgreSQL.
 *
 * O resto do backend é síncrono (herança do better-sqlite3). Para não reescrever
 * centenas de repositórios/use cases para async, a thread principal bloqueia em
 * Atomics.wait enquanto este worker executa a query e devolve o JSON pelo
 * SharedArrayBuffer. Cada requisição é serializada, o que é exatamente o que uma
 * única conexão pg.Client oferece.
 */
const { workerData, parentPort } = require('node:worker_threads')
const { Client, types } = require('pg')

/* ── Tipos: manter o "formato SQLite" que o resto do código espera ────────── */
// int8 (COUNT/SUM/rowid) e numeric voltam como string no node-postgres.
types.setTypeParser(20, (v) => (v === null ? null : parseInt(v, 10)))
types.setTypeParser(1700, (v) => (v === null ? null : parseFloat(v)))
// TIMESTAMP/DATETIME voltavam Date; o SQLite devolvia texto.
types.setTypeParser(1114, (v) => v)
types.setTypeParser(1184, (v) => v)
types.setTypeParser(1082, (v) => v)

const control = new Int32Array(workerData.sab, 0, 4)
const data = new Uint8Array(workerData.sab, 16)
const STATE = 0
const LEN = 1
const LAST = 2

function send(payload) {
  const json = Buffer.from(JSON.stringify(payload), 'utf8')
  let offset = 0
  do {
    const size = Math.min(data.length, json.length - offset)
    data.set(json.subarray(offset, offset + size), 0)
    offset += size
    Atomics.store(control, LEN, size)
    Atomics.store(control, LAST, offset >= json.length ? 1 : 0)
    Atomics.store(control, STATE, 1)
    Atomics.notify(control, STATE)
    // Espera a thread principal consumir o chunk (ela devolve o estado para 0).
    Atomics.wait(control, STATE, 1)
  } while (offset < json.length)
}

/* ── Conexão ─────────────────────────────────────────────────────────────── */
const databaseUrl = workerData.databaseUrl
let client = null
let connecting = null
let nocase = false

function databaseName() {
  const parsed = new URL(databaseUrl)
  return decodeURIComponent(parsed.pathname.replace(/^\//, '')) || 'postgres'
}

async function openClient() {
  let c = new Client({ connectionString: databaseUrl })
  try {
    await c.connect()
  } catch (error) {
    // Banco ainda não existe: cria no banco de manutenção e tenta de novo.
    if (error && error.code === '3D000') {
      const adminUrl = new URL(databaseUrl)
      adminUrl.pathname = '/postgres'
      const admin = new Client({ connectionString: adminUrl.toString() })
      await admin.connect()
      try {
        const name = databaseName().replace(/"/g, '""')
        await admin.query(`CREATE DATABASE "${name}"`)
      } finally {
        await admin.end()
      }
      c = new Client({ connectionString: databaseUrl })
      await c.connect()
    } else {
      throw error
    }
  }

  await c.query("SET client_encoding = 'UTF8'")
  await c.query("SET TIME ZONE 'UTC'")

  // COLLATE NOCASE do SQLite -> collation ICU case-insensitive do Postgres.
  try {
    await c.query(
      "CREATE COLLATION IF NOT EXISTS nocase (provider = icu, locale = 'und-u-ks-level1', deterministic = false)"
    )
    nocase = true
  } catch {
    nocase = false
    console.warn('[pg] collation "nocase" indisponível; COLLATE NOCASE será ignorado')
  }

  return c
}

async function db() {
  if (client) return client
  if (!connecting) {
    connecting = openClient().then(
      (c) => {
        client = c
        connecting = null
        return c
      },
      (error) => {
        connecting = null
        throw error
      }
    )
  }
  return connecting
}

/* ── Scanner de SQL (respeita strings, identificadores e comentários) ─────── */
function skipQuoted(sql, index, quote) {
  let i = index + 1
  while (i < sql.length) {
    if (sql[i] === quote) {
      if (sql[i + 1] === quote) {
        i += 2
        continue
      }
      return i + 1
    }
    i++
  }
  return sql.length
}

function skipDollarTag(sql, index) {
  const match = /^\$[A-Za-z_]*\$/.exec(sql.slice(index))
  if (!match) return index + 1
  const tag = match[0]
  const end = sql.indexOf(tag, index + tag.length)
  return end < 0 ? sql.length : end + tag.length
}

function splitStatements(sql) {
  const statements = []
  let start = 0
  let i = 0
  while (i < sql.length) {
    const ch = sql[i]
    if (ch === "'" || ch === '"') {
      i = skipQuoted(sql, i, ch)
    } else if (ch === '-' && sql[i + 1] === '-') {
      const end = sql.indexOf('\n', i)
      i = end < 0 ? sql.length : end
    } else if (ch === '/' && sql[i + 1] === '*') {
      const end = sql.indexOf('*/', i + 2)
      i = end < 0 ? sql.length : end + 2
    } else if (ch === '$') {
      i = skipDollarTag(sql, i)
    } else if (ch === ';') {
      statements.push(sql.slice(start, i))
      start = i + 1
      i++
    } else {
      i++
    }
  }
  if (sql.slice(start).trim()) statements.push(sql.slice(start))
  return statements
}

function normalizeValue(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'boolean') return value ? '1' : '0'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`Parâmetro numérico inválido: ${value}`)
    return String(value)
  }
  if (typeof value === 'bigint') return value.toString()
  if (typeof value === 'string') return value
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) return Buffer.from(value)
  if (value instanceof Date) return value.toISOString()
  throw new Error(`Tipo de parâmetro não suportado: ${Object.prototype.toString.call(value)}`)
}

/** Converte `?` / `@nome` / `:nome` em `$1..$n` e devolve os valores na ordem. */
function bindParams(sql, params) {
  // better-sqlite3 aceita `.run({ id, nome })` para placeholders @nome e
  // `.run([a, b])` como atalho para posicionais.
  let single = params
  if (Array.isArray(params) && params.length === 1) {
    const first = params[0]
    if (Array.isArray(first) || Buffer.isBuffer(first)) single = first
    else if (first !== null && typeof first === 'object') single = first
  }
  const isNamed =
    single !== null && typeof single === 'object' && !Array.isArray(single) && !Buffer.isBuffer(single)
  const positionalValues = isNamed ? params : single

  const values = []
  const names = new Map()
  let out = ''
  let i = 0
  let positional = 0

  const push = (value) => {
    values.push(normalizeValue(value))
    return `$${values.length}`
  }

  const namedIndex = (name) => {
    if (names.has(name)) return `$${names.get(name)}`
    values.push(normalizeValue(single[name]))
    const index = values.length
    names.set(name, index)
    return `$${index}`
  }

  while (i < sql.length) {
    const ch = sql[i]

    if (ch === "'" || ch === '"') {
      const end = skipQuoted(sql, i, ch)
      out += sql.slice(i, end)
      i = end
      continue
    }
    if (ch === '-' && sql[i + 1] === '-') {
      const end = sql.indexOf('\n', i)
      const stop = end < 0 ? sql.length : end
      out += sql.slice(i, stop)
      i = stop
      continue
    }
    if (ch === '/' && sql[i + 1] === '*') {
      const end = sql.indexOf('*/', i + 2)
      const stop = end < 0 ? sql.length : end + 2
      out += sql.slice(i, stop)
      i = stop
      continue
    }
    if (ch === '$') {
      const end = skipDollarTag(sql, i)
      if (end > i + 1) {
        out += sql.slice(i, end)
        i = end
        continue
      }
      i++
      out += ch
      continue
    }

    if (ch === '?') {
      if (isNamed) throw new Error('Consulta usa "?" mas recebeu parâmetros nomeados')
      out += push(positionalValues[positional])
      positional++
      i++
      continue
    }

    if ((ch === '@' || ch === ':') && /[A-Za-z_]/.test(sql[i + 1] || '')) {
      // Evita `::cast`
      if (ch === ':' && sql[i - 1] === ':') {
        out += ch
        i++
        continue
      }
      if (!isNamed) throw new Error(`Consulta usa parâmetro nomeado "${ch}..." mas recebeu valores posicionais`)
      let end = i + 1
      while (end < sql.length && /[A-Za-z0-9_]/.test(sql[end])) end++
      out += namedIndex(sql.slice(i + 1, end))
      i = end
      continue
    }

    if (ch === '$' && /[A-Za-z_]/.test(sql[i + 1] || '') && !isNamed) {
      // `$nome` (nomeado) com valores posicionais: erro claro.
      throw new Error('Consulta usa parâmetro nomeado "$..." mas recebeu valores posicionais')
    }

    out += ch
    i++
  }

  if (!isNamed && positional !== positionalValues.length) {
    throw new Error(
      `Quantidade de parâmetros inválida: SQL espera ${positional}, recebeu ${positionalValues.length}`
    )
  }

  return { text: out, values }
}

/* ── Tradução SQLite -> Postgres ──────────────────────────────────────────── */
const TABLE_INFO_SQL = `
  SELECT (ordinal_position - 1) AS cid,
         column_name AS name,
         data_type AS type,
         CASE WHEN is_nullable = 'NO' THEN 1 ELSE 0 END AS notnull,
         column_default AS dflt_value,
         0 AS pk
  FROM information_schema.columns
  WHERE table_schema = current_schema() AND table_name = $1
  ORDER BY ordinal_position
`

function normalizeDefault(value) {
  if (value === null || value === undefined) return null
  let text = String(value)
  text = text.replace(/::[A-Za-z_][A-Za-z0-9_ "[\]]*$/, '')
  if (text.startsWith("'") && text.endsWith("'")) {
    text = text.slice(1, -1).replace(/''/g, "'")
  }
  return text
}

/**
 * Aplica `transform` apenas nos trechos "de código" do SQL, preservando
 * literais e comentários (senão um texto que contenha a palavra "like" viraria
 * "ilike" dentro de uma string).
 */
function mapOutsideLiterals(sql, transform) {
  let out = ''
  let plain = ''
  let i = 0

  const flush = () => {
    out += transform(plain)
    plain = ''
  }

  while (i < sql.length) {
    const ch = sql[i]
    if (ch === "'" || ch === '"') {
      flush()
      const end = skipQuoted(sql, i, ch)
      out += sql.slice(i, end)
      i = end
      continue
    }
    if (ch === '-' && sql[i + 1] === '-') {
      flush()
      const end = sql.indexOf('\n', i)
      const stop = end < 0 ? sql.length : end
      out += sql.slice(i, stop)
      i = stop
      continue
    }
    if (ch === '/' && sql[i + 1] === '*') {
      flush()
      const end = sql.indexOf('*/', i + 2)
      const stop = end < 0 ? sql.length : end + 2
      out += sql.slice(i, stop)
      i = stop
      continue
    }
    plain += ch
    i++
  }

  flush()
  return out
}

/** Remove comentários/whitespace iniciais para reconhecer a instrução. */
function stripLeadingNoise(sql) {
  return sql.replace(/^(?:\s+|--[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)+/, '')
}

function translateSql(raw) {
  let sql = stripLeadingNoise(raw.trim())
  if (!sql) return null

  if (/^PRAGMA\s+foreign_keys/i.test(sql)) return null

  const tableInfo = /^PRAGMA\s+table_info\s*\(\s*["'`]?([A-Za-z0-9_]+)["'`]?\s*\)\s*;?$/i.exec(sql)
  if (tableInfo) {
    return {
      text: TABLE_INFO_SQL,
      values: [tableInfo[1]],
      preset: true,
      normalizeRows: true,
      tableInfo: true
    }
  }
  if (/^PRAGMA\b/i.test(sql)) return null

  // INSERT OR IGNORE -> ON CONFLICT DO NOTHING
  if (/^INSERT\s+OR\s+IGNORE\s+/i.test(sql)) {
    sql = sql.replace(/^INSERT\s+OR\s+IGNORE\s+/i, 'INSERT ')
    if (!/ON\s+CONFLICT/i.test(sql)) sql = `${sql.replace(/;\s*$/, '')} ON CONFLICT DO NOTHING`
  }

  const isDdl = /^CREATE\s+TABLE\b/i.test(sql)

  sql = mapOutsideLiterals(sql, (code) => {
    let text = code

    // Metadados do SQLite
    text = text.replace(
      /FROM\s+sqlite_master/gi,
      "FROM (SELECT 'table' AS type, tablename AS name FROM pg_tables WHERE schemaname = current_schema()) AS sqlite_master"
    )

    // LIKE do SQLite é case-insensitive
    text = text.replace(/\bLIKE\b/gi, 'ILIKE')

    // `? IS NULL` usados como "filtro opcional": o parâmetro sozinho não tem
    // tipo inferível, então ancoramos em ::text (só importa o teste de nulo).
    text = text.replace(
      /(\?|@[A-Za-z_][A-Za-z0-9_]*|:[A-Za-z_][A-Za-z0-9_]*)\s+IS\s+NOT\s+NULL/gi,
      '$1::text IS NOT NULL'
    )
    text = text.replace(
      /(\?|@[A-Za-z_][A-Za-z0-9_]*|:[A-Za-z_][A-Za-z0-9_]*)\s+IS\s+NULL/gi,
      '$1::text IS NULL'
    )

    // `x IS ?` (igualdade null-safe do SQLite) -> IS NOT DISTINCT FROM
    text = text.replace(
      /\bIS\s+NOT\s+(\?|@[A-Za-z_][A-Za-z0-9_]*|:[A-Za-z_][A-Za-z0-9_]*)/gi,
      'IS DISTINCT FROM $1'
    )
    text = text.replace(
      /\bIS\s+(?!NOT\s|NULL\b|TRUE\b|FALSE\b|DISTINCT\b|UNKNOWN\b)(\?|@[A-Za-z_][A-Za-z0-9_]*|:[A-Za-z_][A-Za-z0-9_]*)/gi,
      'IS NOT DISTINCT FROM $1'
    )
    // COLLATE NOCASE
    text = text.replace(/\bCOLLATE\s+NOCASE\b/gi, nocase ? 'COLLATE nocase' : '')
    // `LIMIT -1 OFFSET n` (SQLite) -> LIMIT ALL
    text = text.replace(/\bLIMIT\s+-1\b/gi, 'LIMIT ALL')

    if (isDdl) {
      // Tipos que não existem (ou têm semântica diferente) no Postgres
      text = text.replace(/\bBOOLEAN\b/gi, 'INTEGER')
      text = text.replace(/\bDATETIME\b/gi, 'TIMESTAMP')
      text = text.replace(/\bREAL\b/gi, 'DOUBLE PRECISION')
      text = text.replace(/\bAUTOINCREMENT\b/gi, '')
      // FKs viram DEFERRABLE para permitir o wipe/reinsert da seed numa transação
      text = text.replace(
        /REFERENCES\s+("?[A-Za-z0-9_]+"?)\s*\(\s*("?[A-Za-z0-9_]+"?)\s*\)(?!\s+DEFERRABLE)/gi,
        '$& DEFERRABLE INITIALLY DEFERRED'
      )
    }

    return text
  })

  const createdTable = /^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?("?[A-Za-z0-9_."]+"?)/i.exec(sql)
  return {
    text: sql,
    normalizeRows: false,
    tableInfo: false,
    createdTable: createdTable ? createdTable[1].replace(/"/g, '') : null
  }
}

/* ── Execução ─────────────────────────────────────────────────────────────── */
let depth = 0

async function ensureRowid(table) {
  // Todas as queries do app usam `rowid` (ORDER BY / _rowid) como no SQLite.
  if (!table) return
  await client.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS rowid BIGSERIAL`)
}

async function runStatement(c, translated, values) {
  if (!translated) return { rows: [], rowCount: 0 }
  const result = await c.query(translated.text, values)
  if (translated.tableInfo) {
    result.rows = result.rows.map((row) => ({ ...row, dflt_value: normalizeDefault(row.dflt_value) }))
  }
  if (translated.createdTable) await ensureRowid(translated.createdTable)
  return result
}

async function execAll(c, sql) {
  const statements = splitStatements(sql)
  for (const statement of statements) {
    if (!statement.trim()) continue
    const translated = translateSql(statement)
    if (!translated) continue
    const keyword = /^\s*([A-Za-z]+)/.exec(translated.text)
    const first = keyword ? keyword[1].toUpperCase() : ''
    if (first === 'BEGIN' || first === 'START') depth++
    if (first === 'COMMIT' || first === 'END') depth = Math.max(0, depth - 1)
    if (first === 'ROLLBACK') depth = 0
    await runStatement(c, translated, [])
  }
}

async function handle(message) {
  const c = await db()

  if (message.kind === 'begin') {
    if (depth === 0) await c.query('BEGIN')
    else await c.query(`SAVEPOINT sp${depth}`)
    depth++
    return { ok: true }
  }
  if (message.kind === 'commit') {
    if (depth <= 1) await c.query('COMMIT')
    else await c.query(`RELEASE SAVEPOINT sp${depth - 1}`)
    depth = Math.max(0, depth - 1)
    return { ok: true }
  }
  if (message.kind === 'rollback') {
    if (depth <= 1) await c.query('ROLLBACK')
    else await c.query(`ROLLBACK TO SAVEPOINT sp${depth - 1}`)
    depth = Math.max(0, depth - 1)
    return { ok: true }
  }

  if (message.kind === 'exec') {
    await execAll(c, message.sql)
    return { ok: true }
  }

  // query
  const translated = translateSql(message.sql)
  if (!translated) return { ok: true, rows: [], rowCount: 0 }
  let text = translated.text
  let values = []
  if (translated.preset) {
    values = translated.values
  } else {
    const bound = bindParams(translated.text, message.params || [])
    text = bound.text
    values = bound.values
  }
  const result = await runStatement(c, { ...translated, text }, values)
  return { ok: true, rows: result.rows, rowCount: result.rowCount ?? 0 }
}

parentPort.on('message', (message) => {
  handle(message)
    .then((result) => send(result))
    .catch((error) => {
      send({
        ok: false,
        error: {
          message: error && error.message ? error.message : String(error),
          code: error && error.code,
          detail: error && error.detail,
          hint: error && error.hint,
          constraint: error && error.constraint,
          position: error && error.position
        }
      })
    })
})
