/* ============================================================
   worldnet — flat icosahedral net for `kind === "world"` locations.

   GURPS Space draws a planet as a sphere wrapped in an icosahedron:
   20 equilateral faces tiled with hexes, plus a pentagon at each of
   the 12 vertices where five faces meet. This module builds that net
   as a connected strip (10 equatorial triangles + 5 caps above +
   5 caps below) on a triangular lattice, so every face shares exact
   edges with its neighbours and the whole thing folds back into a
   sphere.

   The painted cells are stored in `Location.tiles` (a JSON TEXT
   column on the backend). They are tagged with `cell`/`shape`/`face`
   and deliberately use q = r = -1, so the tactical plate renderer —
   which looks tiles up by `q,r` — ignores them completely.
   ============================================================ */

import type { HexTile, Location } from "./types";

/* ----------------------------- biomes ------------------------------ */

export type BiomeKind =
  | "ocean"
  | "coast"
  | "plains"
  | "forest"
  | "jungle"
  | "desert"
  | "tundra"
  | "ice"
  | "mountain"
  | "volcanic"
  | "swamp";

export interface BiomeMeta {
  fill: string;
  stroke: string;
  glyph: string;
  /** i18n key (lc.*) */
  label: string;
  /** contagem como terra firme (para distribuir continentes filhos) */
  land: boolean;
  /** peso na geração procedural */
  weight: number;
}

export const BIOMES: Record<BiomeKind, BiomeMeta> = {
  ocean: { fill: "#0a2540", stroke: "#1e5a88", glyph: "≈", label: "lc.world.biome.ocean", land: false, weight: 30 },
  coast: { fill: "#10405c", stroke: "#2f789c", glyph: "~", label: "lc.world.biome.coast", land: true, weight: 8 },
  plains: { fill: "#233d1e", stroke: "#4b7740", glyph: "˙", label: "lc.world.biome.plains", land: true, weight: 15 },
  forest: { fill: "#153a24", stroke: "#2f7547", glyph: "♣", label: "lc.world.biome.forest", land: true, weight: 12 },
  jungle: { fill: "#1b4426", stroke: "#3f8441", glyph: "✳", label: "lc.world.biome.jungle", land: true, weight: 6 },
  desert: { fill: "#57421f", stroke: "#947438", glyph: "·", label: "lc.world.biome.desert", land: true, weight: 9 },
  tundra: { fill: "#3a4540", stroke: "#6d7f72", glyph: ",", label: "lc.world.biome.tundra", land: true, weight: 5 },
  ice: { fill: "#31485a", stroke: "#7da3bd", glyph: "❄", label: "lc.world.biome.ice", land: false, weight: 3 },
  mountain: { fill: "#39352f", stroke: "#776b5d", glyph: "▲", label: "lc.world.biome.mountain", land: true, weight: 6 },
  volcanic: { fill: "#4a211c", stroke: "#97422c", glyph: "◆", label: "lc.world.biome.volcanic", land: true, weight: 2 },
  swamp: { fill: "#25382b", stroke: "#51704f", glyph: "≋", label: "lc.world.biome.swamp", land: true, weight: 4 },
};

export const BIOME_LIST = Object.keys(BIOMES) as BiomeKind[];

export function isBiome(v: unknown): v is BiomeKind {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(BIOMES, v);
}

/* ------------------------------ tiles ------------------------------ */

/** Uma célula do mapa planetário, compatível com o formato de `tiles`. */
export interface WorldTile extends HexTile {
  /** "f<face>-<i>-<j>" (hex) ou "v<n>" (pentágono). */
  cell: string;
  shape: "hex" | "pentagon";
  /** 0..19 para hexágonos; -1 para pentágonos de vértice. */
  face: number;
  biome: BiomeKind;
  /** Divisão filha (continente) aberta ao clicar nesta célula. */
  childId?: string | null;
}

export function isWorldTile(t: unknown): t is WorldTile {
  return !!t && typeof t === "object" && typeof (t as WorldTile).cell === "string" && isBiome((t as WorldTile).biome);
}

export function worldTilesOf(tiles?: HexTile[] | null): WorldTile[] {
  return (tiles ?? []).filter(isWorldTile);
}

export function tacticalTilesOf(tiles?: HexTile[] | null): HexTile[] {
  return (tiles ?? []).filter((t) => !isWorldTile(t));
}

/** Constrói uma célula no formato persistido. q/r ficam fora da placa
    tática para que o renderizador de hexágonos não a desenhe. */
function makeTile(cell: string, shape: "hex" | "pentagon", face: number, biome: BiomeKind): WorldTile {
  return { q: -1, r: -1, t: "open", cell, shape, face, biome, childId: null };
}

/* ---------------------------- geometry ----------------------------- */

const SQRT3 = Math.sqrt(3);

interface Lattice {
  a: number;
  b: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface NetCell extends Point {
  id: string;
  shape: "hex" | "pentagon";
  face: number;
  r: number;
}

export interface NetFace {
  idx: number;
  points: Point[];
  center: Point;
}

export interface NetGeometry {
  cells: NetCell[];
  faces: NetFace[];
  W: number;
  H: number;
  S: number;
  N: number;
}

interface FaceDef {
  idx: number;
  verts: [Lattice, Lattice, Lattice];
}

/** 10 triângulos equatoriais + 5 tampas acima + 5 abaixo = 20 faces. */
export const ICOSA_FACES: FaceDef[] = (() => {
  const list: FaceDef[] = [];
  let idx = 0;
  const up = (a: number, b: number): FaceDef => ({
    idx: idx++,
    verts: [{ a, b }, { a: a + 1, b }, { a, b: b + 1 }],
  });
  const down = (a: number, b: number): FaceDef => ({
    idx: idx++,
    verts: [{ a: a + 1, b }, { a, b: b + 1 }, { a: a + 1, b: b + 1 }],
  });
  for (let a = 0; a < 5; a++) {
    list.push(up(a, 0));
    list.push(down(a, 0));
  }
  for (let a = 0; a < 5; a++) list.push(up(a, 1));
  for (let a = 0; a < 5; a++) list.push(down(a, -1));
  return list;
})();

/** Os 12 vértices do icosaedro: 5 ápices superiores, 5 inferiores e
    as duas pontas da fita equatorial. */
const VERTEX_LATTICE: Lattice[] = [
  ...Array.from({ length: 5 }, (_, a) => ({ a, b: 2 })),
  ...Array.from({ length: 5 }, (_, a) => ({ a: a + 1, b: -1 })),
  { a: 0, b: 0 },
  { a: 5, b: 1 },
];

export function buildNetGeometry(opts: { S?: number; N?: number; pad?: number } = {}): NetGeometry {
  const S = opts.S && opts.S > 20 ? opts.S : 110;
  const N = opts.N && opts.N >= 3 ? Math.min(6, Math.floor(opts.N)) : 4;
  const pad = opts.pad && opts.pad > 0 ? opts.pad : 30;
  const hTri = (S * SQRT3) / 2;
  const ox = pad;
  const oy = pad + hTri;

  const px = (p: Lattice): Point => ({
    x: ox + (p.a + p.b / 2) * S,
    y: oy + p.b * hTri,
  });

  const faces: NetFace[] = ICOSA_FACES.map((f) => {
    const points = f.verts.map(px);
    return {
      idx: f.idx,
      points,
      center: {
        x: (points[0].x + points[1].x + points[2].x) / 3,
        y: (points[0].y + points[1].y + points[2].y) / 3,
      },
    };
  });

  /* A malha de centros é triangular (passo S/N). Hexágonos pointy-top
     com raio = passo/√3 tecem exatamente essa malha, sem falhas. */
  const hexR = S / (N * Math.sqrt(3));
  const pentR = hexR * 0.85;
  const cells: NetCell[] = [];

  for (const f of ICOSA_FACES) {
    const [v0, v1, v2] = f.verts;
    for (let i = 1; i <= N - 1; i++) {
      for (let j = 1; i + j <= N - 1; j++) {
        const w0 = 1 - (i + j) / N;
        const w1 = i / N;
        const w2 = j / N;
        const p = px({
          a: w0 * v0.a + w1 * v1.a + w2 * v2.a,
          b: w0 * v0.b + w1 * v1.b + w2 * v2.b,
        });
        cells.push({ id: `f${f.idx}-${i}-${j}`, shape: "hex", face: f.idx, x: p.x, y: p.y, r: hexR });
      }
    }
  }
  VERTEX_LATTICE.forEach((v, k) => {
    const p = px(v);
    cells.push({ id: `v${k}`, shape: "pentagon", face: -1, x: p.x, y: p.y, r: pentR });
  });

  return {
    cells,
    faces,
    W: 5.5 * S + pad * 2,
    H: 3 * hTri + pad * 2,
    S,
    N,
  };
}

/** Célula mais próxima de um ponto em coordenadas do canvas. */
export function cellAt(geo: NetGeometry, p: Point): NetCell | null {
  let best: NetCell | null = null;
  let bestD = Infinity;
  for (const c of geo.cells) {
    const d = Math.hypot(c.x - p.x, c.y - p.y);
    if (d <= c.r * 1.2 && d < bestD) {
      best = c;
      bestD = d;
    }
  }
  return best;
}

/* ---------------------- procedural povoamento ---------------------- */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickBiome(r: number): BiomeKind {
  const total = BIOME_LIST.reduce((s, k) => s + BIOMES[k].weight, 0);
  let x = r * total;
  for (const k of BIOME_LIST) {
    x -= BIOMES[k].weight;
    if (x <= 0) return k;
  }
  return "ocean";
}

/** Gera um mapa determinístico (blobs de Voronoi) para um planeta ainda
    sem biomas pintados, distribuindo os filhos em terra firme. */
export function seedWorldTiles(locationId: string, children: Location[], geo: NetGeometry): WorldTile[] {
  const rand = rng(hash(locationId || "world"));
  const seeds = Array.from({ length: 9 }, () => ({
    x: rand() * geo.W,
    y: rand() * geo.H,
    biome: pickBiome(rand()),
  }));

  const tiles = geo.cells.map((c) => {
    let near = seeds[0];
    let best = Infinity;
    for (const s of seeds) {
      const d = (c.x - s.x) ** 2 + (c.y - s.y) ** 2;
      if (d < best) {
        best = d;
        near = s;
      }
    }
    // pequeno grão de textura para quebrar bordas perfeitas
    const jitter = rand();
    const biome = jitter < 0.08 ? pickBiome(rand()) : near.biome;
    return makeTile(c.id, c.shape, c.face, biome);
  });

  const land = tiles.filter((t) => BIOMES[t.biome].land && t.shape === "hex");
  const used = new Set<number>();
  children.slice(0, 12).forEach((child, i) => {
    if (!land.length) return;
    let idx = (hash(child.id) + i) % land.length;
    for (let guard = 0; guard < land.length && used.has(idx); guard++) idx = (idx + 7) % land.length;
    used.add(idx);
    land[idx].childId = child.id;
  });

  return tiles;
}

/** Mescla os tiles salvos com a geometria atual: células novas ganham
    bioma; células removidas/archiveadas são descartadas. */
export function reconcileWorldTiles(saved: WorldTile[], geo: NetGeometry, fallbackSeed: string): WorldTile[] {
  const byId = new Map(saved.filter(isWorldTile).map((t) => [t.cell, t]));
  const seedTiles = seedWorldTiles(fallbackSeed, [], geo);
  const seedById = new Map(seedTiles.map((t) => [t.cell, t]));
  return geo.cells.map((c) => {
    const prev = byId.get(c.id);
    const seed = seedById.get(c.id)!;
    if (prev) return { ...prev, shape: c.shape, face: c.face, q: -1, r: -1 };
    return makeTile(c.id, c.shape, c.face, seed.biome);
  });
}
