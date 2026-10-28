/* ============================================================
   uploads — image storage on the local disk.

   Uploaded images (and the seed placeholder art) live under
   `<backend>/uploads/` and are served statically at `/uploads/...`
   (see server.ts). The DB only ever stores the relative url, so
   moving the files means moving the folder — nothing else.
   ============================================================ */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

/** `<backend>` root — three hops up from src/infra/storage. */
export const BACKEND_ROOT = path.resolve(__dirname, '..', '..', '..')
export const UPLOADS_DIR = path.join(BACKEND_ROOT, 'uploads')
export const UPLOADS_URL_PREFIX = '/uploads'

/** Hard ceiling for a stored image. The client compresses before upload, so
    this only rejects a payload that bypassed that (curl, a bug) instead of
    silently writing a huge file to disk. */
export const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024

const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

/** Make sure `uploads/` (or a sub-folder) exists; returns its path. */
export function ensureUploadsDir(sub = ''): string {
  const dir = sub ? path.join(UPLOADS_DIR, sub) : UPLOADS_DIR
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

export function uploadUrlFor(relPath: string): string {
  return `${UPLOADS_URL_PREFIX}/${relPath.replace(/\\/g, '/')}`
}

/* Windows can momentarily lock a just-written file (antivirus, search indexer,
   Explorer preview). Retry transient failures with a short synchronous backoff
   before giving up, so a single lock never aborts a whole seed run. */
function sleepSync(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function writeFileSyncWithRetry(full: string, content: string | Buffer): void {
  const delays = [15, 40, 90, 200, 400]
  for (let attempt = 0; ; attempt++) {
    try {
      fs.writeFileSync(full, content)
      return
    } catch (err) {
      const code = (err as NodeJS.ErrnoException)?.code
      const transient = code === 'EPERM' || code === 'EBUSY' || code === 'EACCES'
      if (!transient || attempt >= delays.length) throw err
      sleepSync(delays[attempt]!)
    }
  }
}

/** Persist a buffer/string under `uploads/<relPath>` and return its url. */
export function writeUploadAsset(relPath: string, content: string | Buffer): string {
  const full = path.join(UPLOADS_DIR, relPath)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  writeFileSyncWithRetry(full, content)
  return uploadUrlFor(relPath)
}

export interface SavedUpload {
  url: string
}

/**
 * Decode a `data:image/...;base64,...` payload and write it to disk.
 * `scope` is a short folder name (e.g. "maps", "characters", "items").
 */
export function saveUploadedImage(dataUrl: string, scope = 'misc'): SavedUpload {
  if (typeof dataUrl !== 'string') throw new Error('Imagem ausente ou inválida.')
  const match = /^data:(image\/[a-z0-9.+-]+);base64,([\s\S]+)$/i.exec(dataUrl.trim())
  if (!match) throw new Error('Formato inválido: envie um data URL "data:image/...;base64,...".')
  const mime = match[1]!.toLowerCase()
  const ext = EXT_BY_MIME[mime]
  if (!ext) throw new Error(`Tipo de imagem não suportado: ${mime}.`)
  const buffer = Buffer.from(match[2]!, 'base64')
  if (!buffer.length) throw new Error('Imagem vazia.')
  if (buffer.length > MAX_IMAGE_BYTES) {
    const mb = (buffer.length / (1024 * 1024)).toFixed(2)
    throw new Error(`Imagem de ${mb} MB excede o limite de 1.5 MB.`)
  }
  const folder = /^[a-z0-9_-]+$/i.test(scope) ? scope : 'misc'
  const name = `${Date.now().toString(36)}-${crypto.randomUUID()}.${ext}`
  return { url: writeUploadAsset(`${folder}/${name}`, buffer) }
}
