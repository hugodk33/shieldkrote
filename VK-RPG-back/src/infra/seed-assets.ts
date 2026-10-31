/* ============================================================
   seed-assets — placeholder art for the seed data.

   Character portraits/bodies and item icons are raster JPEGs drawn
   from a tiny built-in 5x7 bitmap font, so a picture is a real
   .jpg the browser can show — no broken placeholders. The battlemap
   backdrop stays a self-contained SVG (that one is meant to stay
   vector: it is map artwork).

   Everything is generated in code and lands under
   `<backend>/uploads/seed/`, referenced by url exactly like an
   uploaded image would be.
   ============================================================ */

import fs from 'fs'
import path from 'path'
import { encode as encodeJpeg } from 'jpeg-js'
import { UPLOADS_DIR, writeUploadAsset } from './storage/uploads'

function hash32(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function shortHash(seed: string): string {
  return hash32(seed).toString(36).slice(0, 6)
}

function hue(seed: string): number {
  return hash32(seed) % 360
}

function slug(name: string): string {
  return (name || 'x')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'x'
}

function deaccent(value: string): string {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function escapeXml(value: string): string {
  return String(value ?? '').replace(/[<>&'"]/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c === "'" ? '&apos;' : '&quot;'
  )
}

function initials(name: string): string {
  const parts = deaccent(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  const first = parts[0]![0] ?? '?'
  const last = parts.length > 1 ? parts[parts.length - 1]![0] ?? '' : ''
  return (first + last).toUpperCase()
}

/* ============================================================
   Tiny 5x7 bitmap font (uppercase A–Z, digits, a little punctuation)
   ============================================================ */

type Glyph = [string, string, string, string, string, string, string]

const FONT: Record<string, Glyph> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  '?': ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  "'": ['..#..', '..#..', '..#..', '.....', '.....', '.....', '.....'],
}

/* ============================================================
   Minimal RGB raster + drawing primitives
   ============================================================ */

interface Rgb { r: number; g: number; b: number }

interface Raster { w: number; h: number; data: Uint8Array }

function createRaster(w: number, h: number): Raster {
  return { w, h, data: new Uint8Array(w * h * 4) }
}

function hsl(h: number, s: number, l: number): Rgb {
  const hh = (((h % 360) + 360) % 360) / 60
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((hh % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (hh < 1) { r = c; g = x }
  else if (hh < 2) { r = x; g = c }
  else if (hh < 3) { g = c; b = x }
  else if (hh < 4) { g = x; b = c }
  else if (hh < 5) { r = x; b = c }
  else { r = c; b = x }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  }
}

function putPixel(r: Raster, x: number, y: number, c: Rgb): void {
  if (x < 0 || y < 0 || x >= r.w || y >= r.h) return
  const i = (y * r.w + x) * 4
  r.data[i] = c.r
  r.data[i + 1] = c.g
  r.data[i + 2] = c.b
  r.data[i + 3] = 255
}

function fillGradient(r: Raster, top: Rgb, bottom: Rgb): void {
  for (let y = 0; y < r.h; y++) {
    const c = mix(top, bottom, r.h > 1 ? y / (r.h - 1) : 0)
    for (let x = 0; x < r.w; x++) putPixel(r, x, y, c)
  }
}

function fillRect(r: Raster, x0: number, y0: number, w: number, h: number, c: Rgb): void {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) putPixel(r, x, y, c)
  }
}

function fillCircle(r: Raster, cx: number, cy: number, radius: number, c: Rgb): void {
  const rr = radius * radius
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const dx = x - cx
      const dy = y - cy
      if (dx * dx + dy * dy <= rr) putPixel(r, x, y, c)
    }
  }
}

function textWidth(text: string, scale: number): number {
  return (text.length * 6 - 1) * scale
}

function drawText(r: Raster, text: string, centerX: number, topY: number, scale: number, c: Rgb): void {
  let x = Math.round(centerX - textWidth(text, scale) / 2)
  for (const ch of text) {
    const glyph = FONT[ch] ?? FONT['?']!
    for (let gy = 0; gy < 7; gy++) {
      const row = glyph[gy] ?? ''
      for (let gx = 0; gx < 5; gx++) {
        if (row[gx] === '#') fillRect(r, x + gx * scale, topY + gy * scale, scale, scale, c)
      }
    }
    x += 6 * scale
  }
}

/** Fit a scale so `text` is at most `maxWidth` wide, within [min,max]. */
function fitScale(text: string, maxWidth: number, maxScale: number, minScale: number): number {
  const units = Math.max(1, text.length * 6 - 1)
  return Math.max(minScale, Math.min(maxScale, Math.floor(maxWidth / units)))
}

function encodeJpegImage(r: Raster, quality = 88): Buffer {
  return encodeJpeg({ data: Buffer.from(r.data), width: r.w, height: r.h }, quality).data
}

/* ============================================================
   Raster placeholders (JPEG)
   ============================================================ */

/* ---- portrait: gradient card with initials ---- */
export function portraitJpeg(name: string, seed: string): Raster {
  const h = hue(seed)
  const r = createRaster(512, 640)
  fillGradient(r, hsl(h, 0.55, 0.3), hsl((h + 40) % 360, 0.6, 0.14))
  fillCircle(r, 256, 248, 128, hsl(h, 0.6, 0.7))

  const ini = initials(name)
  const scale = Math.min(fitScale(ini, 200, 26, 6), Math.floor(200 / 7))
  drawText(r, ini, 256, 248 - Math.floor((7 * scale) / 2) + 6, scale, hsl(h, 0.6, 0.15))

  const label = deaccent(name || '').toUpperCase()
  drawText(r, label, 256, 536, fitScale(label, 470, 5, 2), hsl(h, 0.3, 0.88))
  return r
}

/* ---- full body: simple silhouette ---- */
export function bodyJpeg(name: string, seed: string): Raster {
  const h = hue(seed)
  const r = createRaster(512, 1024)
  fillGradient(r, hsl(h, 0.25, 0.18), hsl(h, 0.3, 0.08))

  const col = hsl(h, 0.45, 0.55)
  fillCircle(r, 256, 200, 86, col)
  fillRect(r, 196, 304, 120, 300, col)
  fillRect(r, 118, 330, 70, 240, col)
  fillRect(r, 324, 330, 70, 240, col)
  fillRect(r, 200, 590, 52, 300, col)
  fillRect(r, 260, 590, 52, 300, col)

  const label = deaccent(name || '').toUpperCase()
  drawText(r, label, 256, 952, fitScale(label, 470, 5, 2), hsl(h, 0.25, 0.85))
  return r
}

/* ---- item icon: framed glyph ---- */
export function itemJpeg(name: string, seed: string): Raster {
  const h = hue(seed)
  const r = createRaster(256, 256)
  fillRect(r, 0, 0, 256, 256, hsl(h, 0.3, 0.16))

  const edge = hsl(h, 0.5, 0.55)
  fillRect(r, 8, 8, 240, 4, edge)
  fillRect(r, 8, 244, 240, 4, edge)
  fillRect(r, 8, 8, 4, 240, edge)
  fillRect(r, 244, 8, 4, 240, edge)

  const glyph = (deaccent(name).trim()[0] ?? '?').toUpperCase()
  const scale = 20
  drawText(r, glyph, 128, 128 - Math.floor((7 * scale) / 2), scale, hsl(h, 0.55, 0.68))
  return r
}

/* ---- battlemap backdrop: muted hex field (stays vector/SVG) ---- */
export function backdropSvg(name: string, seed: string): string {
  const h = hue(seed)
  const cols = 14
  const rows = 10
  const r = 42
  const w = Math.sqrt(3) * r
  const cells: string[] = []
  for (let c = 0; c < cols; c++) {
    for (let rr = 0; rr < rows; rr++) {
      const cx = c * w + ((rr % 2) * w) / 2
      const cy = rr * r * 1.5
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i
        return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
      }).join(' ')
      const shade = (c * 7 + rr * 13) % 5
      cells.push(`<polygon points="${pts}" fill="hsl(${h} ${20 + shade * 3}% ${12 + shade * 4}%)" stroke="hsl(${h} 25% 22%)" stroke-width="1"/>`)
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${(cols * w + w).toFixed(0)} ${(rows * r * 1.5 + r).toFixed(0)}" width="900" height="760">
  <rect width="100%" height="100%" fill="hsl(${h} 22% 9%)"/>
  <g>${cells.join('')}</g>
  <text x="50%" y="52" font-family="Georgia, serif" font-size="40" fill="hsl(${h} 30% 80%)" text-anchor="middle" dominant-baseline="middle">${escapeXml(name)}</text>
</svg>`
}

/** Wipe the generated seed art (called once at seed start). */
export function resetSeedAssets(): void {
  fs.rmSync(path.join(UPLOADS_DIR, 'seed'), { recursive: true, force: true, maxRetries: 5, retryDelay: 150 })
}

export function portraitAsset(name: string, seed = ''): string {
  return writeUploadAsset(`seed/portrait-${slug(name)}-${shortHash(seed + name)}.jpg`, encodeJpegImage(portraitJpeg(name, seed)))
}

export function bodyAsset(name: string, seed: string): string {
  return writeUploadAsset(`seed/body-${slug(name)}-${shortHash(seed + name)}.jpg`, encodeJpegImage(bodyJpeg(name, seed)))
}

export function itemAsset(name: string, seed: string): string {
  return writeUploadAsset(`seed/item-${slug(name)}-${shortHash(seed + name)}.jpg`, encodeJpegImage(itemJpeg(name, seed)))
}

export function backdropAsset(name: string, seed: string): string {
  return writeUploadAsset(`seed/backdrop-${slug(name)}-${shortHash(seed + name)}.svg`, backdropSvg(name, seed))
}
