import { db } from '../../infra/database/database'
import crypto from 'crypto'
import { IGameTableRulesRepository } from '../irepositories/IGameTableRulesRepository'
import { assertCharacterNotMuted } from './playerMuteGuard'
import {
  resolveViewerScope,
  shapeCatalogForViewer,
  shapeCharacterForViewer,
  shapeLocationConnections,
  type ViewerScope,
} from '../services/CharacterVisibility'
import { pageSqlClause, pageSqlParams, pageMeta, type PageWindow } from '../pagination'

/** Rules an observer holds (any target) — the "knowledge" set that gates
    catalogs and locations. Catalog/location rows are observer-global, but
    any visible item rule (even target-scoped) counts as knowing the item. */
function viewerRules(viewerId: string): any[] {
  return db.prepare(`SELECT * FROM visibility WHERE character_id = ?`)
    .all(viewerId) as any[]
}

function possessedItemIds(characterId: string): Set<string> {
  const rows = db.prepare(
    `SELECT DISTINCT item_id FROM character_equipment WHERE character_id = ?`
  ).all(characterId) as any[]
  return new Set(rows.map((r: any) => String(r.item_id)).filter(Boolean))
}

/** Colunas de `modifiers` que apontam para a entidade dona (PC, item, skill,
    vantagem, desvantagem, local, ação, narração, cena). Editadas apenas quando a
    chave chega no payload — ver `editGameModifier`. */
const MODIFIER_LINK_COLUMNS = [
  'character_id',
  'item_id',
  'skill_id',
  'advantage_id',
  'disadvantage_id',
  'location_id',
  'action_id',
  'narration_id',
  'scene_id',
] as const

/* ================================================================
   MODIFIERS — efeito x modelo

   A linha de `modifiers` é a unidade de efeito do jogo. Duas
   naturezas, em `kind`:

   · 'effect'  — uma vez, num character. É o histórico: o ferimento
     do último capítulo, o ΔFP da corrida. Entra na ficha porque tem
     `character_id`, e é isso que a torna viva.
   · 'modelo'  — a regra do catálogo: "quem tiver Falcoaria
     treinada ganha isto". Fica amarrada a um traço (vantagem,
     desvantagem, perícia) ou a um item, sem `character_id`, e NÃO
     é aplicada sozinha — é resolvida na leitura contra o que o
     character possui. Nada é materializado, então perder a
     vantagem desfaz o efeito sem deixar linha órfã.

   `source_modifier_id` é a instância por character: uma linha
   'effect' apontando para o modelo, que desligar (enabled=0) ou
   sobrescrever os valores sem mexer no catálogo.
   ================================================================ */

const MODIFIER_KIND_EFFECT = 'effect'
const MODIFIER_KIND_MODEL = 'modelo'

/** Aceita o que vier da UI em pt/en e fixa nos dois valores do banco. */
function normalizeModifierKind(value: any): string {
  return value === MODIFIER_KIND_MODEL || value === 'model' || value === 'passive' || value === 'passiva'
    ? MODIFIER_KIND_MODEL
    : MODIFIER_KIND_EFFECT
}

/** Os modelos que o character satisfaz agora: cada advantage_id /
 *  disadvantage_id / skill_id / item_id do modelo precisa estar na lista
 * respective de posse do character. É aqui que a modificação padrão vira
 *  efeito — sem materializar nada. */
function characterModelModifiers(characterId: string): any[] {
  return db.prepare(`
    SELECT * FROM modifiers
    WHERE kind = '${MODIFIER_KIND_MODEL}'
      AND (
        (advantage_id IS NOT NULL AND advantage_id IN (
          SELECT advantage_id FROM game_table_character_advantages
          WHERE character_id = ? AND advantage_id IS NOT NULL
        ))
        OR (disadvantage_id IS NOT NULL AND disadvantage_id IN (
          SELECT disadvantage_id FROM game_table_character_disadvantages
          WHERE character_id = ? AND disadvantage_id IS NOT NULL
        ))
        OR (skill_id IS NOT NULL AND skill_id IN (
          SELECT skill_id FROM game_table_character_skills
          WHERE character_id = ? AND skill_id IS NOT NULL
        ))
        OR (item_id IS NOT NULL AND item_id IN (
          SELECT item_id FROM character_equipment
          WHERE character_id = ? AND item_id IS NOT NULL
        ))
      )
    ORDER BY rowid ASC
  `).all(characterId, characterId, characterId, characterId) as any[]
}

/** Lista efetiva de modificadores de um character: o histórico dele (as linhas
 *  com character_id) mais os modelos que ele satisfaz. A instância por character
 *  — linha com source_modifier_id apontando para o modelo — tem precedência:
 *  `enabled = 0` desliga o efeito, e o que ela preencher sobrescreve o modelo,
 *  campo a campo, sem apagar o resto. Por isso ela é lida à parte: sozinha, sem
 *  modelo vivo, não compõe nada. */
function resolveCharacterModifiers(characterId: string, moment?: number | null): any[] {
  const direct = (moment != null
    ? db.prepare(`
        SELECT m.* FROM modifiers m
        LEFT JOIN narrations n ON n.id = m.narration_id
        WHERE m.character_id = ?
          AND m.source_modifier_id IS NULL
          AND (n.moment IS NULL OR n.moment <= ?)
        ORDER BY m.rowid ASC
      `).all(characterId, moment)
    : db.prepare(`
        SELECT * FROM modifiers
        WHERE character_id = ?
          AND source_modifier_id IS NULL
        ORDER BY rowid ASC
      `).all(characterId)) as any[]

  const instanceRows = db.prepare(`
    SELECT * FROM modifiers
    WHERE character_id = ? AND source_modifier_id IS NOT NULL
  `).all(characterId) as any[]

  const instances = new Map<string, any>()
  for (const row of instanceRows) instances.set(row.source_modifier_id, row)

  const resolved = [...direct]
  const seen = new Set<string>(direct.map((r: any) => r.id))
  for (const model of characterModelModifiers(characterId)) {
    // Modelo com character_id próprio já veio na lista direta: é o caso de um
    // modelo fixado num personagem específico.
    if (seen.has(model.id)) continue
    seen.add(model.id)

    const instance = instances.get(model.id)
    if (!instance) {
      resolved.push({ ...model, from_model: model.id })
      continue
    }
    const merged: any = { ...model, from_model: model.id, instance_id: instance.id }
    for (const [key, value] of Object.entries(instance)) {
      if (key === 'id' || value == null) continue
      merged[key] = value
    }
    resolved.push(merged)
  }
  return resolved
}


/* ================================================================
   LOCATIONS — hierarquia de território + grade hexagonal (GURPS)
   ----------------------------------------------------------------
   A `table_locations` é uma árvore: um local ENVELOPA os filhos
   (world > continent > nation > region > city > district > site >
   battlemap). `path` é o caminho materializado `/pai/filho/` (permite
   subárvore e ordenação por O(log n)); `level` é a profundidade.
   A geometria de cada local é uma grade hexagonal:
     size_m      = metros por lado de hex (escala da grade)
     q,r         = coords axiais do CENTRO do local dentro do pai
     width/height= pegada em hexes
   Um local vira MAPA DE BATALHA quando a escala chega em ~metros
   (hex_size_m <= 2) — é o ponto onde o narrador monta o grid tático.
   ================================================================ */

/** Escala "em metros por hex" recomendada por divisão. Raiz herda do sistema. */
export const LOCATION_KIND_RANK: Record<string, number> = {
  world: 0,
  continent: 10,
  nation: 20,
  region: 30,
  biome: 35,
  province: 40,
  city: 50,
  district: 60,
  locale: 70,
  site: 80,
  battlemap: 90,
  point: 95,
}

export const LOCATION_KIND_LABELS: Record<string, string> = {
  world: 'World',
  continent: 'Continent',
  nation: 'Nation',
  region: 'Region',
  biome: 'Biome',
  province: 'Province',
  city: 'City',
  district: 'District',
  locale: 'Locale',
  site: 'Site',
  battlemap: 'Battle Map',
  point: 'Point',
}

function locationIsBattlemap(hexSizeM: unknown, stored?: unknown): boolean {
  if (stored != null) return !!stored
  if (hexSizeM == null) return false
  return (hexSizeM as number) <= 2
}

function locationToDTO(l: any): any {
  const hexSizeM = l.hex_size_m ?? null
  return {
    id: l.id,
    tableId: l.table_id ?? null,
    parentId: l.parent_id ?? null,
    kind: l.kind ?? 'site',
    level: l.level ?? 0,
    path: l.path ?? '/',
    name: l.name ?? null,
    region: l.region ?? null,
    subRegion: l.sub_region ?? l.subRegion ?? null,
    address: l.address ?? null,
    isIndoor: !!l.is_indoor,
    country: l.country ?? null,
    area: l.area ?? null,
    dimensions: l.dimensions ?? null,
    description: l.description ?? null,
    other: l.other ?? null,
    hex: {
      sizeM: hexSizeM,
      width: l.width_hexes ?? null,
      height: l.height_hexes ?? null,
      centerQ: l.center_q ?? 0,
      centerR: l.center_r ?? 0,
      orientation: l.orientation ?? 'flat',
      rotationDeg: l.rotation_deg ?? 0,
    },
    isBattlemap: locationIsBattlemap(hexSizeM, l.is_battlemap),
    shopName: l.shop_name ?? null,
    tiles: parseJsonArray(l.tiles),
    drawing: parseJsonArray(l.drawing),
    bgImageUrl: l.bg_image_url ?? null,
    floor: l.floor ?? null,
    floorName: l.floor_name ?? null,
  }
}

/** Conexão entre plantas — DTO canônico consumido pelo front (marcadores
    de porta/escada nos dois lados + andar de cada ponta). */
function connectionToDTO(c: any): any {
  const fromId = c?.from?.id ?? c?.from_location_id ?? null
  const toId = c?.to?.id ?? c?.to_location_id ?? null
  const inHex = (v: any) => (v && typeof v === 'object' ? v : null)
  return {
    id: c.id,
    tableId: c.table_id ?? c.tableId ?? null,
    kind: c.kind ?? 'door',
    label: c.label ?? null,
    description: c.description ?? null,
    bidirectional: !!c.bidirectional,
    sort: c.sort ?? 0,
    direction: c.direction ?? null,
    floorFrom: c.floor_from ?? c.floorFrom ?? null,
    floorTo: c.floor_to ?? c.floorTo ?? null,
    from: {
      id: fromId,
      q: inHex(c.from)?.q ?? c.from_q ?? 0,
      r: inHex(c.from)?.r ?? c.from_r ?? 0,
    },
    to: {
      id: toId,
      q: inHex(c.to)?.q ?? c.to_q ?? 0,
      r: inHex(c.to)?.r ?? c.to_r ?? 0,
    },
  }
}

function parseJsonArray(raw: any): any[] {
  if (!raw) return []
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

/** Reescreve a imagem de um slot (`role`) de um item (upsert de 1 linha). */
function setItemImage(itemId: string, url: string | null, role = 'icon'): void {
  db.prepare('DELETE FROM item_images WHERE item_id = ? AND role = ?').run(itemId, role)
  if (url) {
    db.prepare('INSERT INTO item_images (id, item_id, url, role, sort) VALUES (?, ?, ?, ?, 0)')
      .run(crypto.randomUUID(), itemId, url, role)
  }
}

/** Substitui a galeria (role='gallery') de uma entidade, preservando a ordem. */
function setGallery(table: string, fk: string, id: string, urls: (string | null)[]): void {
  db.prepare(`DELETE FROM ${table} WHERE ${fk} = ? AND role = 'gallery'`).run(id)
  const insert = db.prepare(`INSERT INTO ${table} (id, ${fk}, url, role, sort) VALUES (?, ?, ?, 'gallery', ?)`)
  let sort = 0
  for (const url of urls) {
    if (!url) continue
    insert.run(crypto.randomUUID(), id, url, sort++)
  }
}

/** Galeria (role='gallery') por id de entidade, em ordem. */
function galleryMap(table: string, fk: string, ids: string[]): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const id of ids) map.set(id, [])
  if (!ids.length) return map
  const ph = ids.map(() => '?').join(',')
  const rows = db.prepare(
    `SELECT ${fk} AS owner, url FROM ${table} WHERE role = 'gallery' AND ${fk} IN (${ph}) ORDER BY sort ASC, rowid ASC`
  ).all(...ids) as any[]
  for (const r of rows) {
    const arr = map.get(r.owner)
    if (arr) arr.push(r.url)
  }
  return map
}

/** Normaliza um campo `images` do payload para um array de urls. */
function galleryUrls(data: any): string[] {
  const raw = data.images ?? data.gallery
  if (!Array.isArray(raw)) return []
  return raw.filter((u): u is string => typeof u === 'string' && !!u)
}

/** Primeiro ícone de cada item (url), por id de item. */
function itemIconMap(itemIds: string[]): Map<string, string> {
  const map = new Map<string, string>()
  if (!itemIds.length) return map
  const ph = itemIds.map(() => '?').join(',')
  const rows = db.prepare(
    `SELECT item_id, url FROM item_images WHERE role = 'icon' AND item_id IN (${ph}) ORDER BY sort ASC, rowid ASC`
  ).all(...itemIds) as any[]
  for (const r of rows) if (!map.has(r.item_id)) map.set(r.item_id, r.url)
  return map
}

/** Reescreve a imagem de um único slot (`role`) de um local (upsert de 1 linha). */
function setLocationImage(locationId: string, url: string | null, role = 'banner'): void {
  db.prepare('DELETE FROM location_images WHERE location_id = ? AND role = ?').run(locationId, role)
  if (url) {
    db.prepare('INSERT INTO location_images (id, location_id, url, role, sort) VALUES (?, ?, ?, ?, 0)')
      .run(crypto.randomUUID(), locationId, url, role)
  }
}

/** Primeira imagem de um slot (`role`) por id de local. */
function locationRoleMap(role: string, locationIds: string[]): Map<string, string> {
  const map = new Map<string, string>()
  if (!locationIds.length) return map
  const ph = locationIds.map(() => '?').join(',')
  const rows = db.prepare(
    `SELECT location_id, url FROM location_images WHERE role = ? AND location_id IN (${ph}) ORDER BY sort ASC, rowid ASC`
  ).all(role, ...locationIds) as any[]
  for (const r of rows) if (!map.has(r.location_id)) map.set(r.location_id, r.url)
  return map
}

/** Imagens de personagem (retrato/corpo) — substitui todas as linhas do slot. */
function setCharacterImage(characterId: string, role: string, urls: (string | null)[]): void {
  db.prepare('DELETE FROM game_table_character_images WHERE character_id = ? AND role = ?').run(characterId, role)
  const insert = db.prepare('INSERT INTO game_table_character_images (id, character_id, url, role, sort) VALUES (?, ?, ?, ?, ?)')
  let sort = 0
  for (const url of urls) {
    if (!url) continue
    insert.run(crypto.randomUUID(), characterId, url, role, sort++)
  }
}

/** Copia retrato/corpo de um personagem para outro (duplicações). */
function copyCharacterImages(fromId: string, toId: string): void {
  const rows = db.prepare('SELECT url, role, sort FROM game_table_character_images WHERE character_id = ? ORDER BY sort ASC, rowid ASC').all(fromId) as any[]
  const insert = db.prepare('INSERT INTO game_table_character_images (id, character_id, url, role, sort) VALUES (?, ?, ?, ?, ?)')
  for (const r of rows) insert.run(crypto.randomUUID(), toId, r.url, r.role ?? 'portrait', r.sort ?? 0)
}

/** Aplica retrato/corpo enviados no payload (snake ou camel), se presentes. */
function applyCharacterImages(characterId: string, data: any): void {
  const portrait = data.portraitUrl !== undefined ? data.portraitUrl : data.portrait_url
  const body = data.bodyUrl !== undefined ? data.bodyUrl : data.body_url
  if (portrait !== undefined) setCharacterImage(characterId, 'portrait', [portrait])
  if (body !== undefined) setCharacterImage(characterId, 'body', [body])
  if (data.images !== undefined || data.gallery !== undefined) {
    setGallery('game_table_character_images', 'character_id', characterId, galleryUrls(data))
  }
}

/** Imagens de personagem agrupadas por role (a primeira de cada). */
function characterImageMap(characterIds: string[]): Map<string, { portrait: string | null; body: string | null }> {
  const map = new Map<string, { portrait: string | null; body: string | null }>()
  for (const id of characterIds) map.set(id, { portrait: null, body: null })
  if (!characterIds.length) return map
  const ph = characterIds.map(() => '?').join(',')
  const rows = db.prepare(
    `SELECT character_id, url, role FROM game_table_character_images WHERE character_id IN (${ph}) ORDER BY sort ASC, rowid ASC`
  ).all(...characterIds) as any[]
  for (const r of rows) {
    const entry = map.get(r.character_id)
    if (!entry) continue
    if (r.role === 'body') { if (!entry.body) entry.body = r.url }
    else if (!entry.portrait) entry.portrait = r.url
  }
  return map
}

/** Monta a árvore de locais a partir da lista plana. */
function buildLocationTree(locations: any[]): any[] {
  const byParent = new Map<string | null, any[]>()
  for (const loc of locations) {
    const pid = loc.parentId ?? null
    if (!byParent.has(pid)) byParent.set(pid, [])
    byParent.get(pid)!.push(loc)
  }
  const sortSiblings = (a: any, b: any) =>
    (a.hex?.centerQ ?? 0) - (b.hex?.centerQ ?? 0) ||
    (a.hex?.centerR ?? 0) - (b.hex?.centerR ?? 0) ||
    (a.name ?? '').localeCompare(b.name ?? '')
  const attach = (loc: any): any => ({
    ...loc,
    children: (byParent.get(loc.id) ?? []).sort(sortSiblings).map(attach),
  })
  return (byParent.get(null) ?? []).sort(sortSiblings).map(attach)
}

/** Mantém só os nós visíveis (e filhos visíveis) quando há viewer. */
function filterTreeVisible(tree: any[], visible: Set<string>): any[] {
  return tree
    .filter((n) => visible.has(String(n.id)))
    .map((n) => ({ ...n, children: filterTreeVisible(n.children ?? [], visible) }))
}

/** level/path materializado. path SEMPRE inclui o próprio id (`/pai/filho/`). */
function locationAncestry(selfId: string, parentId: string | null): { level: number; path: string } {
  if (!parentId) return { level: 0, path: `/${selfId}/` }
  const parent: any = db.prepare('SELECT id, level, path FROM table_locations WHERE id = ?').get(parentId)
  if (!parent) return { level: 0, path: `/${selfId}/` }
  let parentPath = parent.path ?? ''
  if (!parentPath || !parentPath.endsWith('/')) parentPath = parentPath ? `${parentPath}/` : '/'
  return { level: (parent.level ?? 0) + 1, path: `${parentPath}${selfId}/` }
}

function moveEquipmentStash(fromCharacterId: string, toCharacterId: string, itemId: string, qty: number): { ok: boolean; error?: string } {
  const source = db.prepare(`
    SELECT * FROM character_equipment WHERE character_id = ? AND item_id = ?
  `).get(fromCharacterId, itemId) as any
  if (!source || (source.quantity ?? 1) < qty) return { ok: false, error: 'Character does not possess this item.' }
  const remaining = (source.quantity ?? 1) - qty
  if (remaining > 0) {
    db.prepare(`
      UPDATE character_equipment SET quantity = ?, status = ?, location = ? WHERE id = ?
    `).run(remaining, 'in_inventory', 'none', source.id)
  } else {
    db.prepare(`
      DELETE FROM character_equipment WHERE id = ?
    `).run(source.id)
  }
  const target = db.prepare(`
    SELECT * FROM character_equipment WHERE character_id = ? AND item_id = ?
  `).get(toCharacterId, itemId) as any
  if (target) {
    db.prepare(`
      UPDATE character_equipment SET quantity = ?, status = ?, location = ? WHERE id = ?
    `).run((target.quantity ?? 1) + qty, 'in_inventory', 'none', target.id)
  } else {
    db.prepare(`
      INSERT INTO character_equipment (id, character_id, item_id, quantity, status, location, rendered_st)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), toCharacterId, itemId, qty, 'in_inventory', 'none', null)
  }
  return { ok: true }
}

export class GameTableRulesRepository implements IGameTableRulesRepository {
  /* =============== */
  /*      SKILLS     */
  /* =============== */
  async createGameTableSkills(skill: any): Promise<void> {
    db.prepare(`
      INSERT INTO game_table_skills (id, table_id, name, category, subcategory, type, predefinition_type, predefinition_difficulty, description, module_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      skill.table_id ?? null,
      skill.name ?? null,
      skill.category ?? null,
      skill.subcategory ?? null,
      skill.type ?? null,
      skill.predefinition_type ?? null,
      skill.predefinition_difficulty ?? null,
      skill.description ?? null,
      skill.module_id ?? null
    )
  }

  async editGameTableSkills(skill: any): Promise<void> {
    db.prepare(`
      UPDATE game_table_skills
      SET name = ?, category = ?, subcategory = ?, type = ?, predefinition_type = ?, predefinition_difficulty = ?, description = ?, module_id = ?
      WHERE id = ?
    `).run(
      skill.name ?? null,
      skill.category ?? null,
      skill.subcategory ?? null,
      skill.type ?? null,
      skill.predefinition_type ?? null,
      skill.predefinition_difficulty ?? null,
      skill.description ?? null,
      skill.module_id ?? null,
      skill.id ?? skill.skill_id ?? null
    )
  }

  /** Duplica uma perícia para outra mesa (novo id, mesmo conteúdo). */
  async duplicateGameSkill(id: string, targetTableId: string): Promise<any> {
    const skill: any = db.prepare('SELECT * FROM game_table_skills WHERE id = ?').get(id)
    if (!skill) throw new Error('Skill not found')
    const copyId = crypto.randomUUID()
    const tx = db.transaction(() => {
      db.prepare(`
        INSERT INTO game_table_skills (id, table_id, name, category, subcategory, type, predefinition_type, predefinition_difficulty, description, module_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        copyId,
        targetTableId,
        `${skill.name ?? ''} (cópia)`,
        skill.category ?? null,
        skill.subcategory ?? null,
        skill.type ?? null,
        skill.predefinition_type ?? null,
        skill.predefinition_difficulty ?? null,
        skill.description ?? null,
        skill.module_id ?? null
      )

      const predefs = db.prepare(`SELECT * FROM game_table_skill_predefinede WHERE origin_skill_id = ?`).all(id) as any[]
      for (const p of predefs) {
        db.prepare(`
          INSERT INTO game_table_skill_predefinede (id, origin_skill_id, depends_on_skill_id, depends_on_skill_value, depends_on_skill_for_others_attributes)
          VALUES (?, ?, ?, ?, ?)
        `).run(crypto.randomUUID(), copyId, p.depends_on_skill_id ?? null, p.depends_on_skill_value ?? null, p.depends_on_skill_for_others_attributes ?? null)
      }

      const deps = db.prepare(`SELECT * FROM game_table_skill_dependencies WHERE origin_skill_id = ?`).all(id) as any[]
      for (const d of deps) {
        db.prepare(`
          INSERT INTO game_table_skill_dependencies (id, origin_skill_id, depends_on_skill_id, depends_on_skill_value, depends_type)
          VALUES (?, ?, ?, ?, ?)
        `).run(crypto.randomUUID(), copyId, d.depends_on_skill_id ?? null, d.depends_on_skill_value ?? null, d.depends_type ?? null)
      }
    })
    tx()
    return { success: true, id: copyId, name: skill.name }
  }

  /** Remove uma skill e desamarra tudo que a referencia (defs, character_skills,
      modifiers e visibility) para não violar as FKs. */
  async deleteGameTableSkill(id: any): Promise<any> {
    const skill: any = db.prepare('SELECT id, name FROM game_table_skills WHERE id = ?').get(id)
    if (!skill) throw new Error('Skill not found')

    const tx = db.transaction(() => {
      db.prepare('DELETE FROM game_table_skill_predefinede WHERE origin_skill_id = ? OR depends_on_skill_id = ?').run(id, id)
      db.prepare('DELETE FROM game_table_skill_dependencies WHERE origin_skill_id = ? OR depends_on_skill_id = ?').run(id, id)
      db.prepare('DELETE FROM game_table_character_skills WHERE skill_id = ?').run(id)
      db.prepare('UPDATE modifiers SET skill_id = NULL WHERE skill_id = ?').run(id)
      db.prepare('UPDATE visibility SET skill_id = NULL WHERE skill_id = ?').run(id)
      db.prepare('DELETE FROM game_table_skills WHERE id = ?').run(id)
    })
    tx()

    return { success: true, id, name: skill.name }
  }

  /* ============================================================
     SKILL RELATIONS

     Duas tabelas, uma coluna de diferença:
       predefinition -> game_table_skill_predefinede  (a skill ORIGEM da
                        um nivel padrao para a skill alvo)
       dependency   -> game_table_skill_dependencies  (a skill ORIGEM
                        exige a skill alvo)

     Ate agora as duas so eram escritas por `duplicateGameSkill` e
     `deleteGameTableSkill`: nao havia como editar uma relacao isolada, e
     o ledger so existia se o seed tivesse cidado a linha.
     ============================================================ */

  private static readonly SKILL_RELATIONS = {
    predefinition: {
      table: 'game_table_skill_predefinede',
      extra: 'depends_on_skill_for_others_attributes'
    },
    dependency: {
      table: 'game_table_skill_dependencies',
      extra: 'depends_type'
    }
  } as const

  /**
   * Grafo de requisitos: skill -> skills que ela exige.
   * `excludeRowId` deixa de considerar uma linha ja existente, para que
   * editar uma relacao nao a tratasse como aresta previa dela mesma.
   */
  private skillRequirementGraph(excludeRowId?: string): Map<string, string[]> {
    const rows = db
      .prepare('SELECT id, origin_skill_id, depends_on_skill_id FROM game_table_skill_dependencies')
      .all() as any[]
    const graph = new Map<string, string[]>()
    for (const row of rows) {
      if (!row.origin_skill_id || !row.depends_on_skill_id) continue
      if (excludeRowId && row.id === excludeRowId) continue
      const edges = graph.get(row.origin_skill_id)
      if (edges) edges.push(row.depends_on_skill_id)
      else graph.set(row.origin_skill_id, [row.depends_on_skill_id])
    }
    return graph
  }

  /** A aresta origin -> target fecha um ciclo se target ja alcanca origin. */
  wouldCreateSkillDependencyCycle(origin: string, target: string, excludeRowId?: string): boolean {
    if (origin === target) return true
    const graph = this.skillRequirementGraph(excludeRowId)
    const seen = new Set<string>()
    const stack = [target]
    while (stack.length > 0) {
      const current = stack.pop() as string
      if (current === origin) return true
      if (seen.has(current)) continue
      seen.add(current)
      for (const next of graph.get(current) ?? []) stack.push(next)
    }
    return false
  }

  /**
   * Regras comuns a create e edit. O ciclo so importa nas `dependency`:
   * uma "predefinition" nao e um requisito, e A dar padrao a B enquanto B
   * da padrao a A e um par legitimo (e nao uma corrida infinita).
   */
  private assertSkillRelation(
    kind: 'predefinition' | 'dependency',
    data: any,
    excludeRowId?: string
  ): void {
    const spec = GameTableRulesRepository.SKILL_RELATIONS[kind]
    const originId = data.origin_skill_id ?? null
    if (!originId) throw new Error('origin_skill_id is required')

    const origin = db
      .prepare('SELECT id, name FROM game_table_skills WHERE id = ?')
      .get(originId) as any
    if (!origin) throw new Error('Skill not found')

    const targetId = data.depends_on_skill_id ?? null
    let target: any = null
    if (targetId) {
      target = db.prepare('SELECT id, name FROM game_table_skills WHERE id = ?').get(targetId) as any
      if (!target) throw new Error('Dependent skill not found')
      if (
        kind === 'dependency' &&
        this.wouldCreateSkillDependencyCycle(originId, targetId, excludeRowId)
      ) {
        throw new Error(
          `Ciclo de requisitos: "${origin.name}" nao pode exigir "${target.name}"`
        )
      }
    }

    const hasPayload =
      Boolean(targetId) ||
      Boolean(data.depends_on_skill_value) ||
      Boolean(data[spec.extra])
    if (!hasPayload) throw new Error('Relation carries no payload')
  }

  async createSkillRelation(
    kind: 'predefinition' | 'dependency',
    data: any
  ): Promise<any> {
    const spec = GameTableRulesRepository.SKILL_RELATIONS[kind]
    this.assertSkillRelation(kind, data)
    const id = crypto.randomUUID()
    db.prepare(
      `INSERT INTO ${spec.table} (id, origin_skill_id, depends_on_skill_id, depends_on_skill_value, ${spec.extra}) VALUES (?, ?, ?, ?, ?)`
    ).run(
      id,
      data.origin_skill_id,
      data.depends_on_skill_id ?? null,
      data.depends_on_skill_value ?? null,
      data[spec.extra] ?? null
    )
    return { success: true, id, kind }
  }

  async editSkillRelation(
    kind: 'predefinition' | 'dependency',
    id: string,
    data: any
  ): Promise<any> {
    const spec = GameTableRulesRepository.SKILL_RELATIONS[kind]
    const row = db.prepare(`SELECT * FROM ${spec.table} WHERE id = ?`).get(id) as any
    if (!row) throw new Error('Relation not found')

    /* Distingue "campo ausente" de "campo enviado como null": com `??` a
       edicao nao conseguiria limpar um valor, so trocar. */
    const field = (key: string) =>
      Object.prototype.hasOwnProperty.call(data, key) ? data[key] : row[key]

    const merged = {
      origin_skill_id: field('origin_skill_id'),
      depends_on_skill_id: field('depends_on_skill_id'),
      depends_on_skill_value: field('depends_on_skill_value'),
      [spec.extra]: field(spec.extra)
    }
    this.assertSkillRelation(kind, merged, id)

    db.prepare(
      `UPDATE ${spec.table} SET origin_skill_id = ?, depends_on_skill_id = ?, depends_on_skill_value = ?, ${spec.extra} = ? WHERE id = ?`
    ).run(
      merged.origin_skill_id,
      merged.depends_on_skill_id,
      merged.depends_on_skill_value,
      merged[spec.extra],
      id
    )
    return { success: true, id, kind }
  }

  async deleteSkillRelation(kind: 'predefinition' | 'dependency', id: string): Promise<any> {
    const spec = GameTableRulesRepository.SKILL_RELATIONS[kind]
    const removed = db.prepare(`DELETE FROM ${spec.table} WHERE id = ?`).run(id)
    if (!removed.changes) throw new Error('Relation not found')
    return { success: true, id, kind }
  }

async findGameTableSkill(id: any): Promise<void> {
      const gameTableSkill = db.prepare(`
        SELECT 
        * FROM 
        game_table_skills WHERE id = ?
      `).get(id) as any

      if (!gameTableSkill) return gameTableSkill

      /* O detalhe precisa dos mesmos dois arrays que `findAllGameTableSkills`
         monta, senao a ficha individual cai no fallback `?? []` e esconde
         o painel "Requer / Oferece padrao" inteiro. */

      const predefinitions = db.prepare(`
        SELECT
          gtsp.id as relation_id,
          gtsp.depends_on_skill_id,
          gtsp.depends_on_skill_value,
          gtsp.depends_on_skill_for_others_attributes,
          dependent_skill.name as dependent_skill_name
        FROM game_table_skill_predefinede gtsp
        LEFT JOIN game_table_skills dependent_skill
          ON dependent_skill.id = gtsp.depends_on_skill_id
        WHERE gtsp.origin_skill_id = ?
      `).all(id) as any[]

      const dependencies = db.prepare(`
        SELECT
          gtsd.id as relation_id,
          gtsd.depends_on_skill_id,
          gtsd.depends_on_skill_value,
          gtsd.depends_type,
          dependent_skill.name as dependent_skill_name
        FROM game_table_skill_dependencies gtsd
        LEFT JOIN game_table_skills dependent_skill
          ON dependent_skill.id = gtsd.depends_on_skill_id
        WHERE gtsd.origin_skill_id = ?
      `).all(id) as any[]

      return {
        ...gameTableSkill,
        /* `skill_id` viaja junto do nome: o front linka /skill/[id], e
           usar o nome ali produzia 404. */
        predefinition: predefinitions.map((pre) => ({
          relation_id: pre.relation_id,
          skill: pre.dependent_skill_name || null,
          skill_id: pre.depends_on_skill_id || null,
          value: pre.depends_on_skill_value || null,
          depends_on_skill_for_others_attributes:
            pre.depends_on_skill_for_others_attributes || null
        })),
        dependencies: dependencies.map((dep) => ({
          relation_id: dep.relation_id,
          skill: dep.dependent_skill_name || null,
          skill_id: dep.depends_on_skill_id || null,
          value: dep.depends_on_skill_value || null,
          type: dep.depends_type || null
        }))
      }
    }

  async findAllGameTableSkills(id: any, search?: string, type?: string, difficulty?: string, viewer?: any, page?: PageWindow): Promise<any> {
    const pw: PageWindow = page ?? { offset: 0 }

    const table = db.prepare(`
      SELECT
        id,
        narrator_id,
        intro,
        title
      FROM game_tables
      WHERE id = ?
    `).get(id as string)

    const skillClauses: string[] = ["table_id = ?"]
    const skillParams: any[] = [id]

    if (search) {
      skillClauses.push("(name LIKE ? OR category LIKE ? OR subcategory LIKE ? OR predefinition_type LIKE ? OR predefinition_difficulty LIKE ? OR description LIKE ?)")
      const like = `%${search}%`
      skillParams.push(like, like, like, like, like, like)
    }
    if (type) { skillClauses.push("predefinition_type = ?"); skillParams.push(type) }
    if (difficulty) { skillClauses.push("predefinition_difficulty = ?"); skillParams.push(difficulty) }

    // Todas as skills
    const skillWhere = skillClauses.join(" AND ")
    const skillsTotal = (db.prepare(`
      SELECT COUNT(*) AS n
      FROM game_table_skills
      WHERE ${skillWhere}
    `).get(...skillParams) as any).n as number
    const skills = db.prepare(`
      SELECT *
      FROM game_table_skills
      WHERE ${skillWhere}${pageSqlClause(pw)}
    `).all(...skillParams, ...pageSqlParams(pw)) as any[]

    // =========================
    // PREDEFINITIONS
    // =========================

    const predefinitions = db.prepare(`
      SELECT
        gtsp.id as relation_id,
        gtsp.origin_skill_id,
        gtsp.depends_on_skill_value,
        gtsp.depends_on_skill_for_others_attributes,

        dependent_skill.id as dependent_skill_id,
        dependent_skill.name as dependent_skill_name

      FROM game_table_skill_predefinede gtsp

      LEFT JOIN game_table_skills dependent_skill
        ON dependent_skill.id = gtsp.depends_on_skill_id

      WHERE gtsp.origin_skill_id IN (
        SELECT id
        FROM game_table_skills
        WHERE table_id = ?
      )
    `).all(id) as any[]

    // =========================
    // DEPENDENCIES
    // =========================

    const dependencies = db.prepare(`
      SELECT
        gtsd.id as relation_id,
        gtsd.origin_skill_id,
        gtsd.depends_on_skill_value,
        gtsd.depends_type,

        dependent_skill.id as dependent_skill_id,
        dependent_skill.name as dependent_skill_name

      FROM game_table_skill_dependencies gtsd

      LEFT JOIN game_table_skills dependent_skill
        ON dependent_skill.id = gtsd.depends_on_skill_id

      WHERE gtsd.origin_skill_id IN (
        SELECT id
        FROM game_table_skills
        WHERE table_id = ?
      )
    `).all(id) as any[]

    // =========================
    // FORMATAÇÃO FINAL
    // =========================

    const formattedSkills = skills.map((skill) => {

      const skillPredefinitions = predefinitions
        .filter(pre => pre.origin_skill_id === skill.id)
        .map(pre => ({
          relation_id: pre.relation_id,
          skill: pre.dependent_skill_name || null,
          skill_id: pre.dependent_skill_id || null,
          value: pre.depends_on_skill_value || null,
          depends_on_skill_for_others_attributes:
            pre.depends_on_skill_for_others_attributes || null
        }))

      const skillDependencies = dependencies
        .filter(dep => dep.origin_skill_id === skill.id)
        .map(dep => ({
          relation_id: dep.relation_id,
          skill: dep.dependent_skill_name || null,
          skill_id: dep.dependent_skill_id || null,
          value: dep.depends_on_skill_value || null,
          type: dep.depends_type || null
        }))

      return {
        ...skill,
        predefinition: skillPredefinitions,
        dependencies: skillDependencies
      }
    })

    return {
      table,
      skills: viewer
        ? shapeCatalogForViewer(formattedSkills, viewerRules(viewer), 'skill')
        : formattedSkills,
      ...pageMeta(skillsTotal, pw)
    }
  }

  /* =============== */
  /*    ADVANTAGES   */
  /* =============== */
  
  async createGameAdvantages(data: any): Promise<void> {
    db.prepare(`
      INSERT INTO game_table_advantages (id, table_id, name, category, subcategory, cost_points, description, module_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      data.table_id,
      data.name,
      data.category ?? null,
      data.subcategory ?? null,
      data.cost_points,
      data.description,
      data.module_id ?? null
    )
  }

  async editGameAdvantages(data: any): Promise<void> {
    db.prepare(`
      UPDATE game_table_advantages
      SET name = ?, category = ?, subcategory = ?, cost_points = ?, description = ?, module_id = ?
      WHERE id = ?
    `).run(
      data.name,
      data.category ?? null,
      data.subcategory ?? null,
      data.cost_points,
      data.description,
      data.module_id ?? null,
      data.id
    )
  }

  /** Duplica uma vantagem para outra mesa (novo id, mesmo conteúdo). */
  async duplicateGameAdvantage(id: string, targetTableId: string): Promise<any> {
    const advantage: any = db.prepare('SELECT * FROM game_table_advantages WHERE id = ?').get(id)
    if (!advantage) throw new Error('Advantage not found')
    const copyId = crypto.randomUUID()
    db.prepare(`
      INSERT INTO game_table_advantages (id, table_id, name, category, subcategory, cost_points, description, module_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      copyId,
      targetTableId,
      `${advantage.name ?? ''} (cópia)`,
      advantage.category ?? null,
      advantage.subcategory ?? null,
      advantage.cost_points,
      advantage.description,
      advantage.module_id ?? null
    )
    return { success: true, id: copyId, name: advantage.name }
  }

  /** Remove uma vantagem e desamarra as referências (character_advantages,
      modifiers e visibility) para não violar as FKs. */
  async deleteGameAdvantage(id: any): Promise<any> {
    const advantage: any = db.prepare('SELECT id, name FROM game_table_advantages WHERE id = ?').get(id)
    if (!advantage) throw new Error('Advantage not found')

    const tx = db.transaction(() => {
      db.prepare('DELETE FROM game_table_character_advantages WHERE advantage_id = ?').run(id)
      db.prepare('UPDATE modifiers SET advantage_id = NULL WHERE advantage_id = ?').run(id)
      db.prepare('UPDATE visibility SET advantage_id = NULL WHERE advantage_id = ?').run(id)
      db.prepare('DELETE FROM game_table_advantages WHERE id = ?').run(id)
    })
    tx()

    return { success: true, id, name: advantage.name }
  }
 
  async findGameAdvantages(id: any): Promise<any> {
    const gameTableAdvantage = db.prepare(`
      SELECT *
      FROM game_table_advantages
      WHERE id = ?
    `).get(id) as any
    if (!gameTableAdvantage) return null

    const modifiers = db.prepare(`
      SELECT * FROM modifiers
      WHERE advantage_id = ?
    `).all(id) as any[]

    return { ...gameTableAdvantage, modifiers }
  }

  async findAllGameAdvantages(id: any, search?: string, category?: string, viewer?: any, page?: PageWindow): Promise<any> {
    const pw: PageWindow = page ?? { offset: 0 }
    const table = db.prepare(`
      SELECT
        id,
        narrator_id,
        intro,
        title
      FROM game_tables
      WHERE id = ?
    `).get(id as string)

    const advClauses: string[] = ["table_id = ?"]
    const advParams: any[] = [id]
    if (search) {
      advClauses.push("(name LIKE ? OR category LIKE ? OR subcategory LIKE ? OR description LIKE ?)")
      const like = `%${search}%`
      advParams.push(like, like, like, like)
    }
    if (category) { advClauses.push("category = ?"); advParams.push(category) }

    const advWhere = advClauses.join(" AND ")
    const advantagesTotal = (db.prepare(`
      SELECT COUNT(*) AS n FROM game_table_advantages
      WHERE ${advWhere}
    `).get(...advParams) as any).n as number
    const gameTablesAdvantages = db.prepare(`
      SELECT * FROM game_table_advantages
      WHERE ${advWhere}${pageSqlClause(pw)}
    `).all(...advParams, ...pageSqlParams(pw)) as any[]

    const advantagesWithModifiers = this.attachAdvantageModifiers(gameTablesAdvantages)

    return ({
      table: table,
      advantages: viewer
        ? shapeCatalogForViewer(advantagesWithModifiers, viewerRules(viewer), 'advantage')
        : advantagesWithModifiers,
      ...pageMeta(advantagesTotal, pw)
    })
  }

  /** Anexa a cada vantagem a lista de modifiers vinculados (modifiers.advantage_id). */
  private attachAdvantageModifiers(advantages: any[]): any[] {
    if (!advantages.length) return advantages
    const ids = advantages.map((advantage) => advantage.id)
    const modifiers = db.prepare(`
      SELECT * FROM modifiers
      WHERE advantage_id IS NOT NULL AND advantage_id IN (${ids.map(() => '?').join(', ')})
    `).all(...ids) as any[]

    const modifiersByAdvantage = new Map<string, any[]>()
    for (const modifier of modifiers) {
      const list = modifiersByAdvantage.get(modifier.advantage_id) ?? []
      list.push(modifier)
      modifiersByAdvantage.set(modifier.advantage_id, list)
    }

    return advantages.map((advantage) => ({
      ...advantage,
      modifiers: modifiersByAdvantage.get(advantage.id) ?? []
    }))
  }

  async deleteGameModifier(id: any): Promise<any> {
    const modifier: any = db.prepare('SELECT id, name FROM modifiers WHERE id = ?').get(id)
    if (!modifier) throw new Error('Modifier not found')
    // As instâncias por character existiam só por causa deste modelo; sem ele
    // não são nada além de ruído na lista do narrador.
    db.prepare('DELETE FROM modifiers WHERE source_modifier_id = ?').run(id)
    db.prepare('DELETE FROM modifiers WHERE id = ?').run(id)
    return { success: true, id, name: modifier.name }
  }

  /* ---------------------------------------------------
     INSTÂNCIA POR PERSONAGEM

     O que o narrador faz quando um personagem não deve obedecer a um
     modelo — a Armoury treina o bárbaro, mas este cara não. A instância
     nasce como cópia dos valores do modelo, com enabled=0; a partir
     daí o GM edita o quanto quiser sem tocar no catálogo. Ninguém precisa
     materializar nada: enquanto o traço estiver na ficha, a instância
     é o que vale.
     --------------------------------------------------- */

  async toggleGameModifierForCharacter(data: any): Promise<any> {
    const characterId = data.character_id
    const modelId = data.modifier_id || data.source_modifier_id
    if (!characterId || !modelId) {
      throw new Error('character_id e modifier_id são obrigatórios.')
    }
    const model: any = db.prepare('SELECT * FROM modifiers WHERE id = ?').get(modelId)
    if (!model) throw new Error('Modificação não encontrada.')
    const enabled = data.enabled == null ? true : !!data.enabled

    const existing: any = db.prepare(`
      SELECT * FROM modifiers WHERE character_id = ? AND source_modifier_id = ?
    `).get(characterId, modelId)

    if (existing) {
      db.prepare('UPDATE modifiers SET enabled = ? WHERE id = ?').run(enabled ? 1 : 0, existing.id)
      return { instance_id: existing.id, modifier_id: modelId, enabled }
    }

    // Cópia em SQL: os valores vêm do modelo, mas as colunas de vínculo
    // (advantage_id, item_id...) ficam vazias — a instância pertence ao
    // personagem, não ao catálogo, e não pode aparecer na página da
    // vantagem junto com o modelo.
    const id = crypto.randomUUID()
    db.prepare(`
      INSERT INTO modifiers (
        id, character_id, item_id, skill_id, advantage_id, disadvantage_id, location_id,
        action_id, narration_id, scene_id, name, cost_points, effect, description,
        hp, st, dx, iq, ht, fatigue, encumbrance,
        mod_hp, mod_st, mod_dx, mod_iq, mod_ht, mod_fatigue, mod_encumbrance,
        skill_value, advantage_value, disadvantage_value, armor_value, damage_value,
        item_quantity, item_dimension, item_weight, item_range, item_status,
        apply_on_roll, kind, enabled, source_modifier_id
      )
      SELECT
        ?, ?, NULL, NULL, NULL, NULL, NULL,
        NULL, NULL, NULL, name, cost_points, effect, description,
        hp, st, dx, iq, ht, fatigue, encumbrance,
        mod_hp, mod_st, mod_dx, mod_iq, mod_ht, mod_fatigue, mod_encumbrance,
        skill_value, advantage_value, disadvantage_value, armor_value, damage_value,
        item_quantity, item_dimension, item_weight, item_range, item_status,
        0, '${MODIFIER_KIND_EFFECT}', ?, ?
      FROM modifiers WHERE id = ?
    `).run(id, characterId, enabled ? 1 : 0, modelId, modelId)
    return { instance_id: id, modifier_id: modelId, enabled }
  }

  /* ---------------------------------------------------
     AQUISIÇÃO DE TRAÇO DEPOIS QUE A FICHA EXISTE

     A ficha era escrita uma única vez, com a lista de traços aninhada no
     POST /game-table-character. Sem gancho aqui, uma modificação padrão
     não tinha quando acordar — e não havia como dar uma vantagem no meio
     da campanha. A resolução é na leitura, então só de registrar o traço
     o efeito já entra na ficha; nada é materializado.
     --------------------------------------------------- */

  async grantGameTraitToCharacter(data: any): Promise<any> {
    const isDisadvantage = data.kind === 'disadvantage'
    const table = isDisadvantage ? 'game_table_character_disadvantages' : 'game_table_character_advantages'
    const column = isDisadvantage ? 'disadvantage_id' : 'advantage_id'
    const catalog = isDisadvantage ? 'game_table_disadvantages' : 'game_table_advantages'
    const characterId = data.character_id
    if (!characterId) throw new Error('character_id é obrigatório.')

    const traitId = data.trait_id || data[column] || null
    let name = (data.name || '').trim()
    let costPoints = data.cost_points ?? null
    let effect = data.effect || ''

    // O Narrador costuma mandar só o id: o nome, o custo e o efeito vêm do
    // catálogo, senão a lista de traços da ficha mostra linhas em branco.
    if (traitId) {
      const source: any = db.prepare(`
        SELECT name, cost_points, description FROM ${catalog} WHERE id = ? LIMIT 1
      `).get(traitId)
      if (!name && source?.name) name = source.name
      if (costPoints == null && source?.cost_points != null) costPoints = source.cost_points
      if (!effect && source?.description) effect = source.description
    }
    if (!name) throw new Error('Informe o traço ou o id do catálogo.')

    const id = crypto.randomUUID()
    db.prepare(`
      INSERT INTO ${table} (id, ${column}, name, character_id, cost_points, effect)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, traitId, name, characterId, costPoints, effect)
    return { id, name, [column]: traitId }
  }

  async removeGameTraitFromCharacter(data: any): Promise<any> {
    const isDisadvantage = data.kind === 'disadvantage'
    const table = isDisadvantage ? 'game_table_character_disadvantages' : 'game_table_character_advantages'
    const column = isDisadvantage ? 'disadvantage_id' : 'advantage_id'
    const characterId = data.character_id
    const rowId = data.id || data.row_id
    if (!characterId || !rowId) throw new Error('character_id e id são obrigatórios.')

    const owned = db.prepare(`
      SELECT id, ${column} AS trait_ref FROM ${table} WHERE id = ? AND character_id = ?
    `).get(rowId, characterId) as any
    if (!owned) throw new Error('Traço não encontrado neste personagem.')

    const remove = db.transaction(() => {
      db.prepare(`DELETE FROM ${table} WHERE id = ? AND character_id = ?`).run(rowId, characterId)
      // O ajuste que o GM tinha feito para ESTE personagem não sobrevive ao
      // traço: sem dono, a instância não compõe mais nada e só poluiria a
      // lista. O `character_id` é obrigatório — o modelo é do catálogo e
      // serve a toda a mesa, mas o ajuste é de quem tem o traço.
      // `trait_ref` é o id do CATÁLOGO — é ele que o modelo referencia.
      if (owned.trait_ref) {
        db.prepare(`
          DELETE FROM modifiers
          WHERE character_id = ?
            AND source_modifier_id IN (
              SELECT id FROM modifiers WHERE ${column} = ?
            )
        `).run(characterId, owned.trait_ref)
      }
    })
    remove()
    return { success: true, id: rowId }
  }

  async findAllGameDisadvantages(id: any, search?: string, category?: string, viewer?: any, page?: PageWindow): Promise<any> {
    const pw: PageWindow = page ?? { offset: 0 }
    const table = db.prepare(`
      SELECT
        id,
        narrator_id,
        intro,
        title
      FROM game_tables
      WHERE id = ?
    `).get(id as string)

    const disClauses: string[] = ["table_id = ?"]
    const disParams: any[] = [id]
    if (search) {
      disClauses.push("(name LIKE ? OR category LIKE ? OR subcategory LIKE ? OR effect LIKE ? OR description LIKE ?)")
      const like = `%${search}%`
      disParams.push(like, like, like, like, like)
    }
    if (category) { disClauses.push("category = ?"); disParams.push(category) }

    const disWhere = disClauses.join(" AND ")
    const disadvantagesTotal = (db.prepare(`
      SELECT COUNT(*) AS n FROM game_table_disadvantages
      WHERE ${disWhere}
    `).get(...disParams) as any).n as number
    const gameTablesDisadvantages = db.prepare(`
      SELECT * FROM game_table_disadvantages
      WHERE ${disWhere}${pageSqlClause(pw)}
    `).all(...disParams, ...pageSqlParams(pw)) as any[]
    return ({
      table: table,
      disadvantages: viewer
        ? shapeCatalogForViewer(gameTablesDisadvantages, viewerRules(viewer), 'disadvantage')
        : gameTablesDisadvantages,
      ...pageMeta(disadvantagesTotal, pw)
    })
  }

  async findGameDisadvantages(id: any): Promise<any> {
    const disadvantage = db.prepare(`
      SELECT * FROM game_table_disadvantages WHERE id = ?
    `).get(id) as any
    return disadvantage
  }

  async createGameDisadvantages(data: any): Promise<void> {
    db.prepare(`
      INSERT INTO game_table_disadvantages (id, table_id, name, category, subcategory, cost_points, effect, description, module_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      data.table_id,
      data.name,
      data.category ?? null,
      data.subcategory ?? null,
      data.cost_points,
      data.effect ?? '',
      data.description,
      data.module_id ?? null
    )
  }

  async editGameDisadvantages(data: any): Promise<void> {
    db.prepare(`
      UPDATE game_table_disadvantages
      SET name = ?, category = ?, subcategory = ?, cost_points = ?, effect = ?, description = ?, module_id = ?
      WHERE id = ?
    `).run(
      data.name,
      data.category ?? null,
      data.subcategory ?? null,
      data.cost_points,
      data.effect ?? '',
      data.description,
      data.module_id ?? null,
      data.id
    )
  }

  /** Duplica uma desvantagem para outra mesa (novo id, mesmo conteúdo). */
  async duplicateGameDisadvantage(id: string, targetTableId: string): Promise<any> {
    const disadvantage: any = db.prepare('SELECT * FROM game_table_disadvantages WHERE id = ?').get(id)
    if (!disadvantage) throw new Error('Disadvantage not found')
    const copyId = crypto.randomUUID()
    db.prepare(`
      INSERT INTO game_table_disadvantages (id, table_id, name, category, subcategory, cost_points, effect, description, module_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      copyId,
      targetTableId,
      `${disadvantage.name ?? ''} (cópia)`,
      disadvantage.category ?? null,
      disadvantage.subcategory ?? null,
      disadvantage.cost_points,
      disadvantage.effect ?? '',
      disadvantage.description,
      disadvantage.module_id ?? null
    )
    return { success: true, id: copyId, name: disadvantage.name }
  }

  /** Remove uma desvantagem e desamarra as referências (character_disadvantages,
      modifiers e visibility) para não violar as FKs. */
  async deleteGameDisadvantage(id: any): Promise<any> {
    const disadvantage: any = db.prepare('SELECT id, name FROM game_table_disadvantages WHERE id = ?').get(id)
    if (!disadvantage) throw new Error('Disadvantage not found')

    const tx = db.transaction(() => {
      db.prepare('DELETE FROM game_table_character_disadvantages WHERE disadvantage_id = ?').run(id)
      db.prepare('UPDATE modifiers SET disadvantage_id = NULL WHERE disadvantage_id = ?').run(id)
      db.prepare('UPDATE visibility SET disadvantage_id = NULL WHERE disadvantage_id = ?').run(id)
      db.prepare('DELETE FROM game_table_disadvantages WHERE id = ?').run(id)
    })
    tx()

    return { success: true, id, name: disadvantage.name }
  }

  async findGameLocation(id: any, scope?: ViewerScope | string | null): Promise<any> {
    const row: any = db.prepare(`
      SELECT tl.*, gt.title AS table_title
      FROM table_locations tl
      LEFT JOIN game_tables gt ON gt.id = tl.table_id
      WHERE tl.id = ?
      LIMIT 1
    `).get(id)
    if (!row) return null

    const { filter, characterId } = resolveViewerScope(scope)

    // Player sem personagem não enxerga este local (nem que ele exista).
    if (filter && !characterId) return null

    const rules = filter ? viewerRules(characterId as string) : null

    const shape = (nodes: any[]) =>
      rules ? shapeCatalogForViewer(nodes, rules, 'location') : nodes

    const dto = locationToDTO(row)
    const images = galleryMap('location_images', 'location_id', [row.id]).get(row.id) ?? []
    const bannerUrl = locationRoleMap('banner', [row.id]).get(row.id) ?? null

    // Ancestralidade (cadeia raiz -> pai, sem o próprio nó). Sob viewer, a
    // cadeia é mascarada pelas mesmas regras do observador (sem filtrar — o
    // contexto territorial de um local conhecido é "como" o leitor o vê).
    const ancestors: any[] = []
    const guard = new Set<string>([row.id])
    let curId: string | null = row.parent_id ?? null
    while (curId) {
      if (guard.has(curId)) break
      guard.add(curId)
      const parentRow: any = db.prepare('SELECT * FROM table_locations WHERE id = ?').get(curId)
      if (!parentRow) break
      ancestors.unshift(locationToDTO(parentRow))
      curId = parentRow.parent_id ?? null
    }

    // Filhos — sob viewer, só permanecem os visíveis para o observador.
    const children = shape((db.prepare(`
      SELECT * FROM table_locations
      WHERE parent_id = ?
      ORDER BY hex_size_m IS NULL, hex_size_m ASC, name ASC
    `).all(id) as any[]).map(locationToDTO))

    if (rules) {
      const [self] = shape([dto])
      if (!self) return null
      return {
        ...self,
        images,
        bannerUrl,
        table_id: row.table_id,
        table_title: row.table_title,
        ancestors: shape(ancestors),
        children,
        links: this.locationLinksFor(row, rules),
      }
    }

    return {
      ...dto,
      images,
      bannerUrl,
      table_id: row.table_id,
      table_title: row.table_title,
      ancestors,
      children,
      links: this.locationLinksFor(row, null),
    }
  }

  /** Conexões que tocam este local — o hex "aqui" (porta/escada local) e o
      local parceiro (shapeado para o viewer). Sob viewer, um link só existe
      se o parceiro também for conhecido; a regra da própria conexão ainda
      pode mascarar/remover o marcador. */
  private locationLinksFor(row: any, rules: any[] | null): any[] {
    const self = row.id
    const fetchLoc = (lid: string): any =>
      db.prepare('SELECT * FROM table_locations WHERE id = ?').get(lid) as any
    const shape = (dto: any) =>
      rules ? shapeCatalogForViewer([dto], rules, 'location') : [dto]

    const rows = db.prepare(`
      SELECT * FROM location_connections
      WHERE from_location_id = ? OR to_location_id = ?
      ORDER BY sort ASC, id ASC
    `).all(self, self) as any[]

    const links: any[] = []
    for (const c of rows) {
      const startsHere = c.from_location_id === self
      const otherRow = startsHere ? fetchLoc(c.to_location_id) : fetchLoc(c.from_location_id)
      if (!otherRow) continue
      const otherDto = locationToDTO(otherRow)
      const partner = shape(otherDto)
      if (partner.length === 0) continue
      links.push({
        id: c.id,
        kind: c.kind ?? 'door',
        label: c.label ?? null,
        description: c.description ?? null,
        bidirectional: !!c.bidirectional,
        floorFrom: c.floor_from ?? null,
        floorTo: c.floor_to ?? null,
        here: { q: startsHere ? c.from_q ?? 0 : c.to_q ?? 0, r: startsHere ? c.from_r ?? 0 : c.to_r ?? 0 },
        partner: partner[0],
      })
    }

    return rules ? shapeLocationConnections(links, rules) : links
  }

  /* =============== */
  /*   PECULIARITES  */
  /* =============== */

  async createGamePeculiarites(data: any): Promise<void> {
    db.prepare(`
      INSERT INTO game_table_characters_quirks (id, character_id, name, cost_points, effect, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      data.character_id,
      data.name,
      data.cost_points,
      data.effect,
      data.description
    )
  }
  async editGamePeculiarites(data: any): Promise<void> {
    db.prepare(`
      UPDATE game_table_characters_quirks
      SET name = ?, cost_points = ?, effect = ?, description = ?
      WHERE id = ?
    `).run(
      data.name,
      data.cost_points,
      data.effect,
      data.description,
      data.id
    )
  }
  async findGamePeculiarites(id: any): Promise<any> {
    const gameTablePeculiarity = db.prepare(`
      SELECT *
      FROM game_table_characters_quirks
      WHERE id = ?
    `).get(id) as any
    return gameTablePeculiarity
  }
  async findAllGamePeculiarites(id: any): Promise<any> {
    
    const table = db.prepare(`
      SELECT
        id,
        narrator_id,
        intro,
        title
      FROM game_tables
      WHERE id = ?
    `).get(id as string)

    const gameTablesPeculiarites = db.prepare(`
      SELECT q.* FROM game_table_characters_quirks q
      LEFT JOIN game_table_characters c ON c.id = q.character_id
      WHERE c.table_id = ?
    `).all(id) as any[]
    return ({
      table: table,
      peculiarites: gameTablesPeculiarites
    })
  }

  /* =============== */
  /*      ITEMS      */
  /* =============== */

  /* weapons.skill e' texto solto (GURPS: 'Shortsword', 'Axe', ...). A
     ligacao que importa e' o id: aceitamos o id que o form mandou ou
     resolvemos pelo nome, sempre checando mesa + idioma para a arma nao
     apontar para a pericia de outra mesa. Id invalido vira null em vez de
     ser gravado -- e o texto solto continua salvo em weapons.skill. */
  private resolveItemSkillId(
    tableId: any,
    lang: string,
    skillId?: string | null,
    skillName?: string | null
  ): string | null {
    if (skillId) {
      const byId = db
        .prepare('SELECT id FROM game_table_skills WHERE id = ? AND table_id IS ? AND lang = ?')
        .get(skillId, tableId, lang) as any
      return byId ? String(byId.id) : null
    }
    if (!skillName) return null
    const byName = db
      .prepare('SELECT id FROM game_table_skills WHERE table_id IS ? AND lang = ? AND name = ? LIMIT 1')
      .get(tableId, lang, skillName) as any
    return byName ? String(byName.id) : null
  }

  async createGameItems(data: any): Promise<any> {
    const itemId = crypto.randomUUID()
    const kind = data.kind || (data.type === 1 ? 'weapon' : data.type === 2 ? 'armor' : 'equipment')
    // Antes o INSERT nao citava `lang`, e a coluna tem NOT NULL DEFAULT 'pt':
    // todo item criado pela API nascia 'pt' independente da mesa. A resolucao
    // de skill_id depende disso, entao o idioma agora trafega explicito.
    const lang = data.lang || 'pt'
    const skillName = data.weapon_skill || data.skill_level || null
    const skillId = this.resolveItemSkillId(data.table_id, lang, data.skill_id, skillName)
    db.prepare(`
      INSERT INTO game_table_items (id, lang, table_id, name, kind, category, weight_lb, cost, currency_item_id, skill_id, dimensions, description, quality, condition, tech_level, location_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      itemId,
      lang,
      data.table_id,
      data.name,
      kind,
      data.category,
      data.weight_lb ?? data.weight ?? null,
      data.cost ?? null,
      data.currency_item_id || null,
      skillId,
      data.dimensions,
      data.description,
      data.quality,
      data.condition,
      data.tech_level ?? null,
      data.location_id ?? null
    )

    // ---- WEAPON / SHIELD: atributos de arma + ataques ----
    if (kind === 'weapon' || kind === 'shield') {
      const weaponId = crypto.randomUUID()
      db.prepare(`
        INSERT INTO game_table_weapons (id, lang, item_id, skill, skill_id, min_st, rated_st, handedness, reach, parry, block, fit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        weaponId, lang, itemId,
        skillName,
        skillId,
        data.min_st ?? null,
        data.rated_st ?? null,
        data.handedness ?? 1,
        data.reach || 'C',
        data.parry || null,
        data.block || null,
        data.weapon_fit || 'normal'
      )

      const attacks = Array.isArray(data.attacks) ? data.attacks : []
      const insertAttack = db.prepare(`
        INSERT INTO weapon_attacks (id, weapon_id, name, usage, damage_source, damage_modifier, damage_dice, damage_type, armor_penetration, accuracy, range, recoil, shots)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      for (const atk of attacks) {
        insertAttack.run(
          crypto.randomUUID(), weaponId,
          atk.name || 'Attack', atk.usage || null,
          atk.damage_source || 'fixed', atk.damage_modifier ?? 0,
          atk.damage_dice || null, atk.damage_type || 'cr',
          atk.armor_penetration ?? 0, atk.accuracy ?? null,
          atk.range || 'Melee', atk.recoil ?? null, atk.shots ?? null
        )
      }
    }

    // ---- ARMOR: atributos de armadura ----
    if (kind === 'armor' || kind === 'shield') {
      db.prepare(`
        INSERT INTO game_table_armors (id, item_id, dr, flex, locations, fit)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(), itemId,
        data.dr ?? data.armor_value ?? null,
        data.flex ? 1 : 0,
        data.locations || data.fit || 'torso',
        data.armor_fit || 'normal'
      )
    }

    if (data.imageUrl !== undefined || data.image_url !== undefined) {
      setItemImage(itemId, data.imageUrl ?? data.image_url ?? null)
    }
    if (data.images !== undefined || data.gallery !== undefined) {
      setGallery('item_images', 'item_id', itemId, galleryUrls(data))
    }

    return { id: itemId }
  }

  async editGameItems(data: any): Promise<void> {
    const kind = data.kind || (data.type === 1 ? 'weapon' : data.type === 2 ? 'armor' : 'equipment')
    // O UPDATE de items so vai por `id`, entao mesa e idioma sao lidos da
    // linha existente para resolver a skill contra a mesa certa.
    const currentItem = db
      .prepare('SELECT table_id, lang FROM game_table_items WHERE id = ? LIMIT 1')
      .get(data.id) as any
    const lang = data.lang || currentItem?.lang || 'pt'
    const tableId = data.table_id || currentItem?.table_id || null
    const skillName = data.weapon_skill || data.skill_level || null
    const skillId = this.resolveItemSkillId(tableId, lang, data.skill_id, skillName)
    db.prepare(`
      UPDATE game_table_items
      SET name = ?, kind = ?, category = ?, weight_lb = ?, cost = ?, currency_item_id = ?, skill_id = ?, dimensions = ?, description = ?, quality = ?, condition = ?, tech_level = ?, location_id = ?
      WHERE id = ?
    `).run(
      data.name,
      kind,
      data.category,
      data.weight_lb ?? data.weight ?? null,
      data.cost ?? null,
      data.currency_item_id || null,
      skillId,
      data.dimensions,
      data.description,
      data.quality,
      data.condition,
      data.tech_level ?? null,
      data.location_id ?? null,
      data.id
    )

    const existingWeapon = db.prepare(`SELECT id, fit FROM game_table_weapons WHERE item_id = ?`).get(data.id) as any

    // ---- WEAPON / SHIELD ----
    if (kind === 'weapon' || kind === 'shield') {
      const weaponId = existingWeapon?.id || crypto.randomUUID()
      if (existingWeapon) {
        db.prepare(`
          UPDATE game_table_weapons SET skill = ?, skill_id = ?, min_st = ?, rated_st = ?, handedness = ?, reach = ?, parry = ?, block = ?, fit = ?
          WHERE id = ?
        `).run(
          skillName,
          skillId,
          data.min_st ?? null,
          data.rated_st ?? null,
          data.handedness ?? 1,
          data.reach || 'C',
          data.parry || null,
          data.block || null,
          data.weapon_fit || existingWeapon.fit || 'normal',
          weaponId
        )
      } else {
        db.prepare(`
          INSERT INTO game_table_weapons (id, lang, item_id, skill, skill_id, min_st, rated_st, handedness, reach, parry, block, fit)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(weaponId, lang, data.id, skillName, skillId, data.min_st ?? null, data.rated_st ?? null, data.handedness ?? 1, data.reach || 'C', data.parry || null, data.block || null, data.weapon_fit || 'normal')
      }

      // Substitui os ataques (recreate por simplicidade de edição)
      db.prepare(`DELETE FROM weapon_attacks WHERE weapon_id = ?`).run(weaponId)
      const attacks = Array.isArray(data.attacks) ? data.attacks : []
      const insertAttack = db.prepare(`
        INSERT INTO weapon_attacks (id, weapon_id, name, usage, damage_source, damage_modifier, damage_dice, damage_type, armor_penetration, accuracy, range, recoil, shots)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      for (const atk of attacks) {
        insertAttack.run(
          crypto.randomUUID(), weaponId,
          atk.name || 'Attack', atk.usage || null,
          atk.damage_source || 'fixed', atk.damage_modifier ?? 0,
          atk.damage_dice || null, atk.damage_type || 'cr',
          atk.armor_penetration ?? 0, atk.accuracy ?? null,
          atk.range || 'Melee', atk.recoil ?? null, atk.shots ?? null
        )
      }
    } else if (existingWeapon) {
      // deixou de ser arma: remove ataques e atributos de arma
      db.prepare(`DELETE FROM weapon_attacks WHERE weapon_id = ?`).run(existingWeapon.id)
      db.prepare(`DELETE FROM game_table_weapons WHERE id = ?`).run(existingWeapon.id)
    }

    // ---- ARMOR ----
    const existingArmor = db.prepare(`SELECT id FROM game_table_armors WHERE item_id = ?`).get(data.id) as any
    if (kind === 'armor' || kind === 'shield') {
      if (existingArmor) {
        db.prepare(`
          UPDATE game_table_armors SET dr = ?, flex = ?, locations = ?, fit = ? WHERE id = ?
        `).run(
          data.dr ?? data.armor_value ?? null,
          data.flex ? 1 : 0,
          data.locations || data.fit || 'torso',
          data.armor_fit || 'normal',
          existingArmor.id
        )
      } else {
        db.prepare(`
          INSERT INTO game_table_armors (id, item_id, dr, flex, locations, fit)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(crypto.randomUUID(), data.id, data.dr ?? data.armor_value ?? null, data.flex ? 1 : 0, data.locations || data.fit || 'torso', data.armor_fit || 'normal')
      }
    } else if (existingArmor) {
      db.prepare(`DELETE FROM game_table_armors WHERE id = ?`).run(existingArmor.id)
    }

    if (data.imageUrl !== undefined || data.image_url !== undefined) {
      setItemImage(data.id, data.imageUrl ?? data.image_url ?? null)
    }
    if (data.images !== undefined || data.gallery !== undefined) {
      setGallery('item_images', 'item_id', data.id, galleryUrls(data))
    }
  }

  /** Duplica um item (com arma/escudo, ataques, armadura e imagens) para
      outra mesa — novo id, mesmo conteúdo, sem vínculo de local. Quando
      `locationId` vem preenchido, a cópia nasce NA prateleira desse local
      (é o que a cópia de item para uma loja usa). */
  async duplicateGameItems(id: string, targetTableId: string, locationId?: string | null): Promise<any> {
    const item: any = db.prepare('SELECT * FROM game_table_items WHERE id = ?').get(id)
    if (!item) throw new Error('Item not found')
    const copyId = crypto.randomUUID()
    const lang = item.lang || 'pt'
    const weapon: any = db.prepare('SELECT * FROM game_table_weapons WHERE item_id = ?').get(id)
    // O skill_id da origem aponta para a pericia da mesa de origem, entao
    // copiar o id deixaria a arma da mesa nova apontando para a skill de
    // outra mesa. Resolve de novo pelo nome contra o destino; se a mesa
    // destino nao tiver a pericia, fica null em vez de ponteiro morto.
    const copiedSkillId = weapon
      ? this.resolveItemSkillId(targetTableId, lang, null, weapon.skill ?? null)
      : null

    const tx = db.transaction(() => {
      db.prepare(`
        INSERT INTO game_table_items (id, lang, table_id, name, kind, category, weight_lb, cost, dimensions, description, quality, condition, tech_level, location_id, subcategory, skill_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        copyId,
        lang,
        targetTableId,
        `${item.name ?? ''} (cópia)`,
        item.kind ?? null,
        item.category ?? null,
        item.weight_lb ?? null,
        item.cost ?? null,
        item.dimensions ?? null,
        item.description ?? null,
        item.quality ?? null,
        item.condition ?? null,
        item.tech_level ?? null,
        locationId ?? null,
        item.subcategory ?? null,
        copiedSkillId
      )

      if (weapon) {
        const weaponId = crypto.randomUUID()
        db.prepare(`
          INSERT INTO game_table_weapons (id, lang, item_id, skill, skill_id, min_st, rated_st, handedness, reach, parry, block, fit)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(weaponId, lang, copyId, weapon.skill ?? null, copiedSkillId, weapon.min_st ?? null, weapon.rated_st ?? null, weapon.handedness ?? 1, weapon.reach || 'C', weapon.parry ?? null, weapon.block ?? null, weapon.fit ?? 'normal')

        const attacks = db.prepare('SELECT * FROM weapon_attacks WHERE weapon_id = ? ORDER BY rowid ASC').all(weapon.id) as any[]
        for (const atk of attacks) {
          db.prepare(`
            INSERT INTO weapon_attacks (id, weapon_id, name, usage, damage_source, damage_modifier, damage_dice, damage_type, armor_penetration, accuracy, range, recoil, shots)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(crypto.randomUUID(), weaponId, atk.name || 'Attack', atk.usage ?? null, atk.damage_source || 'fixed', atk.damage_modifier ?? 0, atk.damage_dice ?? null, atk.damage_type || 'cr', atk.armor_penetration ?? 0, atk.accuracy ?? null, atk.range || 'Melee', atk.recoil ?? null, atk.shots ?? null)
        }
      }

      const armor: any = db.prepare('SELECT * FROM game_table_armors WHERE item_id = ?').get(id)
      if (armor) {
        db.prepare(`
          INSERT INTO game_table_armors (id, item_id, dr, flex, locations, fit)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(crypto.randomUUID(), copyId, armor.dr ?? null, armor.flex ?? 0, armor.locations || 'torso', armor.fit ?? 'normal')
      }

      const images = db.prepare('SELECT * FROM item_images WHERE item_id = ?').all(id) as any[]
      for (const img of images) {
        db.prepare(`
          INSERT INTO item_images (id, item_id, url, role, sort)
          VALUES (?, ?, ?, ?, ?)
        `).run(crypto.randomUUID(), copyId, img.url ?? null, img.role ?? 'icon', img.sort ?? 0)
      }
    })
    tx()
    return { success: true, id: copyId, name: item.name }
  }

  /** Remove um item e tudo que depende dele (weapon/armor/attacks/imagens,
      character_equipment, modifiers e visibility) para não violar as FKs. */
  async deleteGameItems(id: any): Promise<any> {
    const item: any = db.prepare('SELECT id, name FROM game_table_items WHERE id = ?').get(id)
    if (!item) throw new Error('Item not found')

    const tx = db.transaction(() => {
      const weapons = db.prepare('SELECT id FROM game_table_weapons WHERE item_id = ?').all(id) as any[]
      for (const w of weapons) {
        db.prepare('DELETE FROM weapon_attacks WHERE weapon_id = ?').run(w.id)
      }
      db.prepare('DELETE FROM game_table_weapons WHERE item_id = ?').run(id)
      db.prepare('DELETE FROM game_table_armors WHERE item_id = ?').run(id)
      db.prepare('DELETE FROM item_images WHERE item_id = ?').run(id)
      db.prepare('DELETE FROM character_equipment WHERE item_id = ?').run(id)
      db.prepare('UPDATE modifiers SET item_id = NULL WHERE item_id = ?').run(id)
      db.prepare('UPDATE visibility SET item_id = NULL WHERE item_id = ?').run(id)
      db.prepare('DELETE FROM game_table_items WHERE id = ?').run(id)
    })
    tx()

    return { success: true, id, name: item.name }
  }

  async findGameItems(id: any): Promise<any> {
    const gameTableItem = db.prepare(`
      SELECT i.*
      FROM game_table_items i
      WHERE i.id = ?
    `).get(id) as any
    if (!gameTableItem) return gameTableItem

    const weapon = db.prepare(`
      SELECT * FROM game_table_weapons WHERE item_id = ?
    `).get(gameTableItem.id) as any
    if (weapon) {
      weapon.attacks = db.prepare(`
        SELECT * FROM weapon_attacks WHERE weapon_id = ? ORDER BY rowid ASC
      `).all(weapon.id) as any[]
    }

    gameTableItem.imageUrl = itemIconMap([gameTableItem.id]).get(gameTableItem.id) ?? null
    gameTableItem.images = galleryMap('item_images', 'item_id', [gameTableItem.id]).get(gameTableItem.id) ?? []
    const armor = db.prepare(`SELECT * FROM game_table_armors WHERE item_id = ?`).get(gameTableItem.id) as any

    return { ...gameTableItem, weapon: weapon || null, armor: armor || null }
  }

  async findAllGameItems(id: any, search?: string, category?: string, kind?: string, viewer?: any, location?: any, page?: PageWindow): Promise<any> {
    const pw: PageWindow = page ?? { offset: 0 }
    const table = db.prepare(`
      SELECT
        id,
        narrator_id,
        intro,
        title
      FROM game_tables
      WHERE id = ?
    `).get(id as string)

    const itemClauses: string[] = ["table_id = ?"]
    const itemParams: any[] = [id]

    if (search) {
      itemClauses.push("(name LIKE ? OR category LIKE ? OR quality LIKE ? OR condition LIKE ? OR description LIKE ?)")
      const q = `%${search}%`
      itemParams.push(q, q, q, q, q)
    }

    if (category) {
      itemClauses.push("category = ?")
      itemParams.push(category)
    }

    if (kind) {
      itemClauses.push("kind = ?")
      itemParams.push(kind)
    }

    if (location) {
      itemClauses.push("location_id = ?")
      itemParams.push(location)
    }

    const itemWhere = itemClauses.join(" AND ")
    const itemsTotal = (db.prepare(`
      SELECT COUNT(*) AS n
      FROM game_table_items
      WHERE ${itemWhere}
    `).get(...itemParams) as any).n as number
    const gameTablesItems = db.prepare(`
      SELECT *
      FROM game_table_items
      WHERE ${itemWhere}${pageSqlClause(pw)}
    `).all(...itemParams, ...pageSqlParams(pw)) as any[]

    // Associa cada item ao seu weapon (com ataques) e/ou armor
    for (const item of gameTablesItems) {
      const weapon = db.prepare(`SELECT * FROM game_table_weapons WHERE item_id = ?`).get(item.id) as any
      if (weapon) {
        weapon.attacks = db.prepare(`SELECT * FROM weapon_attacks WHERE weapon_id = ? ORDER BY rowid ASC`).all(weapon.id) as any[]
        item.weapon = weapon
      }
      const armor = db.prepare(`SELECT * FROM game_table_armors WHERE item_id = ?`).get(item.id) as any
      if (armor) item.armor = armor
    }

    const itemIcons = itemIconMap(gameTablesItems.map((i) => i.id))
    for (const item of gameTablesItems) item.imageUrl = itemIcons.get(item.id) ?? null

    const shapedItems = viewer
      ? shapeCatalogForViewer(gameTablesItems, viewerRules(viewer), 'item', possessedItemIds(viewer))
      : gameTablesItems

    return ({
      table: table,
      items: shapedItems,
      ...pageMeta(itemsTotal, pw)
    })
  }

  /* =============== */
  /*    LOCATIONS    */
  /* =============== */

  /** Which characters of this table belong to a user. Used to resolve whose
      knowledge rules shape a player's payload (a user may hold more than one
      character, e.g. across several tables).

      Inactive characters are kept as a fallback instead of being filtered out:
      dropping them would leave the caller with no character, and "no character"
      must mean "nothing visible" rather than "no filter". `is_active = 0`
      therefore sorts last rather than disappearing. */
  async findCharacterIdsByUserAndTable(userId: string, tableId: string): Promise<string[]> {
    const rows = db.prepare(
      `SELECT id FROM game_table_characters
       WHERE user_id = ? AND table_id = ?
       ORDER BY CASE WHEN is_active = 0 THEN 1 ELSE 0 END ASC`
    ).all(userId, tableId) as any[]
    return rows.map((r: any) => String(r.id))
  }

  /**
   * Confere que o personagem pertence mesmo à mesa. Usado pelo preview
   * `asCharacter`, para não aceitar um id de fora da mesa como filtro.
   */
  async characterBelongsToTable(characterId: string, tableId: string): Promise<boolean> {
    const row = db.prepare(
      `SELECT 1 AS ok FROM game_table_characters WHERE id = ? AND table_id = ? LIMIT 1`
    ).get(characterId, tableId) as any
    return !!row
  }
async findAllGameLocations(id: any, scope?: ViewerScope | string | null): Promise<any> {
    const table = db.prepare(`
      SELECT
        id,
        narrator_id,
        intro,
        title,
        default_location_id
      FROM game_tables
      WHERE id = ?
    `).get(id as string)

    const locations = (db.prepare(`
      SELECT *
      FROM table_locations
      WHERE table_id = ?
      ORDER BY path ASC, name ASC
    `).all(id as string) as any[]).map(locationToDTO)

    const { filter, characterId } = resolveViewerScope(scope)

    // Player sem personagem resolvível: nada é visível. Nunca cair no
    // catálogo completo — seria o mesmo vazamento de antes, só invertido.
    if (filter && !characterId) {
      return {
        table,
        locations: [],
        connections: [],
        tree: [],
        defaultLocationId: (table as any)?.default_location_id ?? null,
      }
    }

    const shaped = filter
      ? shapeCatalogForViewer(locations, viewerRules(characterId as string), 'location')
      : locations

    const connectionRows = (db.prepare(`
      SELECT * FROM location_connections
      WHERE table_id = ?
      ORDER BY sort ASC, id ASC
    `).all(id as string) as any[])

    const connections = filter
      ? shapeLocationConnections(
          connectionRows,
          viewerRules(characterId as string),
          new Set(shaped.map((x: any) => String(x.id)))
        ).map(connectionToDTO)
      : connectionRows.map(connectionToDTO)

    return ({
      table: table,
      locations: shaped,
      connections,
      tree: filter
        ? filterTreeVisible(buildLocationTree(shaped), new Set(shaped.map((x: any) => String(x.id))))
        : buildLocationTree(locations),
      defaultLocationId: (table as any)?.default_location_id ?? null,
    })
  }

  /** Marca a location padrão que os players veem primeiro ao abrir o mapa. */
  async setDefaultGameLocation(tableId: any, locationId: any): Promise<any> {
    const table = db.prepare('SELECT id FROM game_tables WHERE id = ?').get(tableId as string)
    if (!table) return { success: false, error: 'Game table not found' }
    if (locationId != null) {
      const loc = db.prepare('SELECT id FROM table_locations WHERE id = ? AND table_id = ?')
        .get(locationId as string, tableId as string)
      if (!loc) return { success: false, error: 'Location does not belong to this table' }
    }
    db.prepare('UPDATE game_tables SET default_location_id = ? WHERE id = ?')
      .run(locationId ?? null, tableId)
    return { success: true, defaultLocationId: locationId ?? null }
  }

  /* =============== */
  /*   LOCATIONS CRUD */
  /* =============== */

  async createGameLocation(data: any): Promise<any> {
    const id = data.id ?? crypto.randomUUID()
    const parentId = data.parent_id ?? data.parentId ?? null
    const { level, path } = locationAncestry(id, parentId)
    const isIndoor = data.is_indoor ?? data.isIndoor ? 1 : 0
    const hexSizeM = data.hex_size_m ?? data.hex?.sizeM ?? null
    const isBattle = data.is_battlemap !== undefined
      ? (data.is_battlemap ? 1 : 0)
      : (locationIsBattlemap(hexSizeM) ? 1 : 0)

    db.prepare(`
      INSERT INTO table_locations (
        id, table_id, parent_id, kind, level, path,
        name, region, address, sub_region, is_indoor, other, country, area, dimensions, description,
        hex_size_m, width_hexes, height_hexes, center_q, center_r, orientation, rotation_deg, is_battlemap,
        shop_name, tiles, drawing, bg_image_url, floor, floor_name
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.table_id,
      parentId,
      data.kind ?? 'site',
      level,
      path,
      data.name ?? null,
      data.region ?? null,
      data.address ?? null,
      data.sub_region ?? data.subRegion ?? null,
      isIndoor,
      data.other ?? null,
      data.country ?? null,
      data.area ?? null,
      data.dimensions ?? null,
      data.description ?? null,
      hexSizeM,
      data.width_hexes ?? data.hex?.width ?? null,
      data.height_hexes ?? data.hex?.height ?? null,
      data.center_q ?? data.hex?.centerQ ?? 0,
      data.center_r ?? data.hex?.centerR ?? 0,
      data.orientation ?? data.hex?.orientation ?? 'flat',
      data.rotation_deg ?? data.hex?.rotationDeg ?? 0,
      isBattle,
      data.shop_name ?? data.shopName ?? null,
      JSON.stringify(data.tiles ?? []),
      JSON.stringify(data.drawing ?? []),
      data.bg_image_url ?? data.bgImageUrl ?? null,
      data.floor ?? data.hex?.floor ?? null,
      data.floor_name ?? data.floorName ?? data.hex?.floorName ?? null
    )

    if (data.images !== undefined || data.gallery !== undefined) {
      setGallery('location_images', 'location_id', id, galleryUrls(data))
    }
    if (data.bannerUrl !== undefined || data.banner_url !== undefined) {
      setLocationImage(id, data.bannerUrl ?? data.banner_url ?? null)
    }

    return this.findGameLocation(id)
  }

  async editGameLocation(data: any): Promise<void> {
    const current: any = db.prepare('SELECT * FROM table_locations WHERE id = ?').get(data.id)
    if (!current) throw new Error('Location not found')

    const parentId = data.parent_id ?? data.parentId ?? current.parent_id ?? null
    const parentChanged = String(parentId ?? '') !== String(current.parent_id ?? '')
    const { level, path } = parentChanged
      ? locationAncestry(data.id, parentId)
      : { level: current.level, path: current.path }

    const hexSizeM = data.hex_size_m ?? data.hex?.sizeM ?? current.hex_size_m ?? null
    const isBattle = data.is_battlemap !== undefined
      ? (data.is_battlemap ? 1 : 0)
      : (locationIsBattlemap(hexSizeM, current.is_battlemap) ? 1 : 0)

    db.prepare(`
      UPDATE table_locations SET
        parent_id = ?, kind = ?, level = ?, path = ?,
        name = ?, region = ?, address = ?, sub_region = ?, is_indoor = ?,
        other = ?, country = ?, area = ?, dimensions = ?, description = ?,
        hex_size_m = ?, width_hexes = ?, height_hexes = ?, center_q = ?, center_r = ?,
        orientation = ?, rotation_deg = ?, is_battlemap = ?, shop_name = ?,
        tiles = ?, drawing = ?, bg_image_url = ?, floor = ?, floor_name = ?
      WHERE id = ?
    `).run(
      parentId,
      data.kind ?? current.kind ?? 'site',
      level,
      path,
      data.name ?? current.name ?? null,
      data.region ?? current.region ?? null,
      data.address ?? current.address ?? null,
      data.sub_region ?? data.subRegion ?? current.sub_region ?? null,
      data.is_indoor !== undefined ? (data.is_indoor ? 1 : 0) : current.is_indoor ?? 0,
      data.other ?? current.other ?? null,
      data.country ?? current.country ?? null,
      data.area ?? current.area ?? null,
      data.dimensions ?? current.dimensions ?? null,
      data.description ?? current.description ?? null,
      hexSizeM,
      data.width_hexes ?? data.hex?.width ?? current.width_hexes ?? null,
      data.height_hexes ?? data.hex?.height ?? current.height_hexes ?? null,
      data.center_q ?? data.hex?.centerQ ?? current.center_q ?? 0,
      data.center_r ?? data.hex?.centerR ?? current.center_r ?? 0,
      data.orientation ?? data.hex?.orientation ?? current.orientation ?? 'flat',
      data.rotation_deg ?? data.hex?.rotationDeg ?? current.rotation_deg ?? 0,
      isBattle,
      data.shop_name ?? data.shopName ?? current.shop_name ?? null,
      data.tiles !== undefined ? JSON.stringify(data.tiles ?? []) : current.tiles ?? '[]',
      data.drawing !== undefined ? JSON.stringify(data.drawing ?? []) : current.drawing ?? '[]',
      data.bgImageUrl !== undefined ? data.bgImageUrl : data.bg_image_url !== undefined ? data.bg_image_url : current.bg_image_url ?? null,
      data.floor ?? data.hex?.floor ?? current.floor ?? null,
      data.floor_name ?? data.floorName ?? data.hex?.floorName ?? current.floor_name ?? null,
      data.id
    )

    if (data.images !== undefined || data.gallery !== undefined) {
      setGallery('location_images', 'location_id', data.id, galleryUrls(data))
    }
    if (data.bannerUrl !== undefined || data.banner_url !== undefined) {
      setLocationImage(data.id, data.bannerUrl ?? data.banner_url ?? null)
    }

    if (parentChanged) this.recomputeLocationSubtree(data.id)
  }

  /**
   * Reescreve só a galeria (`role='gallery'`) de um local.
   *
   * O PUT da location já faz merge campo a campo, mas obriga o front a
   * reenviar a entidade inteira só para trocar uma foto. Este caminho
   * curto toca apenas `location_images`, sem passar pela árvore de hex.
   */
  async editGameLocationImages(id: string, data: any): Promise<void> {
    if (data.images !== undefined || data.gallery !== undefined) {
      setGallery('location_images', 'location_id', id, galleryUrls(data))
    }
    if (data.bannerUrl !== undefined || data.banner_url !== undefined) {
      setLocationImage(id, data.bannerUrl ?? data.banner_url ?? null)
    }
  }

  /**
   * Remove uma folha do território. Recusa se o local tiver subdivisões
   * (apague os filhos primeiro) e desvincula referências antigas
   * (narration_locations / visibility) para não violar as FKs.
   */
  async deleteGameLocation(id: string): Promise<any> {
    const row: any = db.prepare('SELECT id, name, parent_id FROM table_locations WHERE id = ?').get(id)
    if (!row) throw new Error('Location not found')

    const child = db.prepare('SELECT COUNT(*) AS c FROM table_locations WHERE parent_id = ?').get(id) as { c: number }
    if (child.c > 0) {
      throw new Error(`Location "${row.name}" has ${child.c} subdivision(s); remove them first`)
    }

    const tx = db.transaction(() => {
      db.prepare('UPDATE narration_locations SET location_id = NULL WHERE location_id = ?').run(id)
      db.prepare('UPDATE visibility SET location_id = NULL WHERE location_id = ?').run(id)
      db.prepare('UPDATE visibility SET connection_id = NULL WHERE connection_id = ?').run(id)
      db.prepare('DELETE FROM location_connections WHERE from_location_id = ? OR to_location_id = ?').run(id, id)
      db.prepare('DELETE FROM location_images WHERE location_id = ?').run(id)
      db.prepare('DELETE FROM table_locations WHERE id = ?').run(id)
    })
    tx()

    return { success: true, id, parent_id: row.parent_id ?? null, name: row.name }
  }

  /** Duplica um território (com toda a subárvore) para outra mesa.
      A raiz ganha "(cópia)"; filhos/níveis e caminhos são recalculados. */
  async duplicateGameLocation(id: string, targetTableId: string): Promise<any> {
    const root: any = db.prepare('SELECT * FROM table_locations WHERE id = ?').get(id)
    if (!root) throw new Error('Location not found')

    const rows: any[] = []
    const queue: any[] = [id]
    while (queue.length) {
      const cur = queue.shift()
      const row: any = db.prepare('SELECT * FROM table_locations WHERE id = ?').get(cur)
      if (!row) continue
      rows.push(row)
      const kids = db.prepare('SELECT id FROM table_locations WHERE parent_id = ? ORDER BY hex_size_m IS NULL, hex_size_m ASC, name ASC').all(cur) as any[]
      queue.push(...kids.map((k) => k.id))
    }

    const idMap = new Map<string, string>()
    const tx = db.transaction(() => {
      for (const row of rows) {
        const newId = crypto.randomUUID()
        idMap.set(row.id, newId)
        const parentId = row.parent_id ? (idMap.get(row.parent_id) ?? null) : null
        const { level, path } = locationAncestry(newId, parentId)
        const name = row.id === id ? `${row.name ?? ''} (cópia)` : row.name
        db.prepare(`
          INSERT INTO table_locations (
            id, table_id, parent_id, kind, level, path,
            name, region, address, sub_region, is_indoor, other, country, area, dimensions, description,
            hex_size_m, width_hexes, height_hexes, center_q, center_r, orientation, rotation_deg, is_battlemap,
            shop_name, tiles, drawing, floor, floor_name
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          newId,
          targetTableId,
          parentId,
          row.kind ?? 'site',
          level,
          path,
          name,
          row.region ?? null,
          row.address ?? null,
          row.sub_region ?? null,
          row.is_indoor ?? 0,
          row.other ?? null,
          row.country ?? null,
          row.area ?? null,
          row.dimensions ?? null,
          row.description ?? null,
          row.hex_size_m ?? null,
          row.width_hexes ?? null,
          row.height_hexes ?? null,
          row.center_q ?? 0,
          row.center_r ?? 0,
          row.orientation ?? 'flat',
          row.rotation_deg ?? 0,
          row.is_battlemap ?? 0,
          row.shop_name ?? null,
          row.tiles ?? '[]',
          row.drawing ?? '[]',
          row.floor ?? null,
          row.floor_name ?? null
        )
      }

      // Copia conexões cujas DUAS pontas ficam na subárvore duplicada
      // (as demais ligam para locais fora da mesa-alvo e não fazem sentido).
      const subtreeIds = new Set(rows.map((r) => r.id).map(String))
      const connRows = db.prepare('SELECT * FROM location_connections WHERE table_id = ?')
        .all(root.table_id) as any[]
      const connByOrigId = new Map<string, any[]>()
      for (const c of connRows) {
        const key = String(c.id)
        if (!connByOrigId.has(key)) connByOrigId.set(key, [])
        connByOrigId.get(key)!.push(c)
      }
      for (const [, langs] of connByOrigId) {
        const f = langs[0]
        const fromIn = subtreeIds.has(String(f.from_location_id))
        const toIn = subtreeIds.has(String(f.to_location_id))
        if (!fromIn || !toIn) continue
        const newConnId = crypto.randomUUID()
        for (const langRow of langs) {
          db.prepare(`
            INSERT INTO location_connections (
              id, lang, table_id, from_location_id, to_location_id,
              kind, label, from_q, from_r, to_q, to_r,
              floor_from, floor_to, bidirectional, sort, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            newConnId,
            langRow.lang ?? 'pt',
            targetTableId,
            idMap.get(String(langRow.from_location_id)) ?? null,
            idMap.get(String(langRow.to_location_id)) ?? null,
            langRow.kind ?? 'door',
            langRow.label ?? null,
            langRow.from_q ?? 0,
            langRow.from_r ?? 0,
            langRow.to_q ?? 0,
            langRow.to_r ?? 0,
            langRow.floor_from ?? null,
            langRow.floor_to ?? null,
            langRow.bidirectional ?? 1,
            langRow.sort ?? 0,
            langRow.description ?? null
          )
        }
      }
    })
    tx()
    const copyId = idMap.get(id)
    return { success: true, id: copyId, name: root.name }
  }

  /** Recalcula level/path de toda a subárvore (após mover de pai). */
  private recomputeLocationSubtree(rootId: string): void {
    const queue: string[] = [rootId]
    while (queue.length) {
      const parentId = queue.shift()!
      const parent: any = db.prepare('SELECT id, level, path FROM table_locations WHERE id = ?').get(parentId)
      if (!parent) continue
      const children = db.prepare('SELECT id FROM table_locations WHERE parent_id = ?').all(parentId) as any[]
      for (const child of children) {
        let base = parent.path ?? ''
        if (!base || !base.endsWith('/')) base = base ? `${base}/` : '/'
        db.prepare('UPDATE table_locations SET level = ?, path = ? WHERE id = ?')
          .run((parent.level ?? 0) + 1, `${base}${child.id}/`, child.id)
        queue.push(child.id)
      }
    }
  }

  /* ==============================================================
     LOCATION CONNECTIONS — portas/escadas/portais entre plantas
     --------------------------------------------------------------
     Uma conexão aponta de UM hex da planta de origem (from_q/r) para
     UM hex da planta de destino (to_q/r). O front desenha um marcador
     em cada ponta; ao clicar, navega para o local parceiro (e destaca
     o hex em que a conexão "chega"). Rows são por idioma (label e
     description localizadas); id é compartilhado entre os idiomas.
     ============================================================== */

  async tableLocationConnections(tableId: string): Promise<any[]> {
    return (db.prepare(`
      SELECT * FROM location_connections
      WHERE table_id = ?
      ORDER BY sort ASC, id ASC
    `).all(tableId) as any[]).map(connectionToDTO)
  }

  /** Conexões que tocam um local (ambas as direções). Usado pela UI de
      autor (lista de links para editar/remover). */
  async findLocationConnections(locationId: string): Promise<any[]> {
    return (db.prepare(`
      SELECT * FROM location_connections
      WHERE from_location_id = ? OR to_location_id = ?
      ORDER BY sort ASC, id ASC
    `).all(locationId, locationId) as any[]).map(connectionToDTO)
  }

  async createLocationConnection(data: any): Promise<any> {
    const tableId = data.table_id ?? data.tableId ?? null
    const fromId = data.from?.id ?? data.from_location_id ?? null
    const toId = data.to?.id ?? data.to_location_id ?? null
    if (!tableId || !fromId || !toId) {
      throw new Error('Connection requires table_id, from.id and to.id')
    }
    const inTable = (lid: string): boolean => {
      const row: any = db.prepare('SELECT id, table_id FROM table_locations WHERE id = ?').get(lid)
      return !!row && String(row.table_id) === String(tableId)
    }
    if (!inTable(fromId)) throw new Error('From location not found in this table')
    if (!inTable(toId)) throw new Error('To location not found in this table')

    const id = crypto.randomUUID()
    db.prepare(`
      INSERT INTO location_connections (
        id, lang, table_id, from_location_id, to_location_id,
        kind, label, from_q, from_r, to_q, to_r,
        floor_from, floor_to, bidirectional, sort, direction, description
      ) VALUES (?, 'pt', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      tableId,
      fromId,
      toId,
      data.kind ?? 'door',
      data.label ?? null,
      data.from?.q ?? data.from_q ?? 0,
      data.from?.r ?? data.from_r ?? 0,
      data.to?.q ?? data.to_q ?? 0,
      data.to?.r ?? data.to_r ?? 0,
      data.floorFrom ?? data.floor_from ?? null,
      data.floorTo ?? data.floor_to ?? null,
      data.bidirectional ? 1 : 0,
      data.sort ?? 0,
      data.direction ?? null,
      data.description ?? null
    )
    return this.findGameLocation(fromId)
  }

  async editLocationConnection(id: string, data: any): Promise<any> {
    const current: any = db.prepare('SELECT * FROM location_connections WHERE id = ?').get(id)
    if (!current) throw new Error('Connection not found')
    db.prepare(`
      UPDATE location_connections SET
        kind = ?, label = ?, from_q = ?, from_r = ?, to_q = ?, to_r = ?,
        floor_from = ?, floor_to = ?, bidirectional = ?, sort = ?, direction = ?, description = ?
      WHERE id = ?
    `).run(
      data.kind ?? current.kind ?? 'door',
      data.label !== undefined ? data.label : current.label ?? null,
      data.from?.q ?? data.from_q ?? current.from_q ?? 0,
      data.from?.r ?? data.from_r ?? current.from_r ?? 0,
      data.to?.q ?? data.to_q ?? current.to_q ?? 0,
      data.to?.r ?? data.to_r ?? current.to_r ?? 0,
      data.floorFrom ?? data.floor_from ?? current.floor_from ?? null,
      data.floorTo ?? data.floor_to ?? current.floor_to ?? null,
      data.bidirectional !== undefined ? (data.bidirectional ? 1 : 0) : current.bidirectional ?? 1,
      data.sort ?? current.sort ?? 0,
      data.direction !== undefined ? data.direction : current.direction ?? null,
      data.description !== undefined ? data.description : current.description ?? null,
      id
    )
    return this.findGameLocation(current.from_location_id)
  }

  async deleteLocationConnection(id: string): Promise<any> {
    const row: any = db.prepare('SELECT id, from_location_id FROM location_connections WHERE id = ?').get(id)
    if (!row) throw new Error('Connection not found')
    const tx = db.transaction(() => {
      db.prepare('UPDATE visibility SET connection_id = NULL WHERE connection_id = ?').run(id)
      db.prepare('DELETE FROM location_connections WHERE id = ?').run(id)
    })
    tx()
    return { success: true, id, from_location_id: row.from_location_id }
  }

  /* =============== */
  /*       NPCS      */
  /* =============== */

  async createGameNPC(data: any): Promise<any> {
    const characterId = data.character_id || crypto.randomUUID()
    const sheetId = crypto.randomUUID()

    const insertTransaction = db.transaction(() => {
      db.prepare(`
        INSERT INTO game_table_characters (id, user_id, table_id)
        VALUES (?, ?, ?)
      `).run(characterId, data.user_id || null, data.table_id)

      if (data.sheet) {
        db.prepare(`
          INSERT INTO game_table_character_sheets (id, character_id, name, bio, backstory, points, hp, st, dx, iq, ht, fatigue, encumbrance)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          sheetId, characterId,
          data.sheet.name || '',
          data.sheet.bio || '',
          data.sheet.backstory || '',
          data.sheet.points ?? 0,
          data.sheet.hp ?? 10,
          data.sheet.st ?? 10,
          data.sheet.dx ?? 10,
          data.sheet.iq ?? 10,
          data.sheet.ht ?? 10,
          data.sheet.fatigue ?? 10,
          data.sheet.encumbrance || 'None'
        )
      }

      const insertAdvantage = db.prepare(`
        INSERT INTO game_table_character_advantages (id, advantage_id, name, character_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const adv of (data.advantages || [])) {
        insertAdvantage.run(crypto.randomUUID(), adv.advantage_id || null, adv.name, characterId, adv.cost_points, adv.effect || '')
      }

      const insertDisadvantage = db.prepare(`
        INSERT INTO game_table_character_disadvantages (id, disadvantage_id, name, character_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const dis of (data.disadvantages || [])) {
        insertDisadvantage.run(crypto.randomUUID(), dis.disadvantage_id || null, dis.name, characterId, dis.cost_points, dis.effect || '')
      }

      const insertSkill = db.prepare(`
        INSERT INTO game_table_character_skills (id, character_id, skill_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?)
      `)
      for (const sk of (data.skills || [])) {
        insertSkill.run(crypto.randomUUID(), characterId, sk.skill_id, sk.cost_points ?? 0, sk.effect || '')
      }

      db.prepare(`
        INSERT INTO game_table_npcs (id, character_id, status, location_id)
        VALUES (?, ?, ?, ?)
      `).run(crypto.randomUUID(), characterId, data.status || 'active', data.location_id ?? null)
      applyCharacterImages(characterId, data)
    })

    insertTransaction()
    return { character_id: characterId, sheet_id: sheetId }
  }
  /** Duplica um NPC (ficha + vantagens + desvantagens + perícias + quirks)
      para outra mesa — novo personagem, sem vínculo de local/inventário. */
  async duplicateGameNPC(npcId: string, targetTableId: string): Promise<any> {
    const npc: any = db.prepare('SELECT * FROM game_table_npcs WHERE id = ?').get(npcId)
    if (!npc) throw new Error('NPC not found')
    const charId = npc.character_id as string
    const characterRow: any = db.prepare('SELECT user_id FROM game_table_characters WHERE id = ?').get(charId)
    const sheet: any = db.prepare('SELECT * FROM game_table_character_sheets WHERE character_id = ?').get(charId)
    const advantages = db.prepare('SELECT * FROM game_table_character_advantages WHERE character_id = ?').all(charId) as any[]
    const disadvantages = db.prepare('SELECT * FROM game_table_character_disadvantages WHERE character_id = ?').all(charId) as any[]
    const skills = db.prepare('SELECT * FROM game_table_character_skills WHERE character_id = ?').all(charId) as any[]
    const quirks = db.prepare('SELECT * FROM game_table_characters_quirks WHERE character_id = ?').all(charId) as any[]

    const newCharId = crypto.randomUUID()
    const newNpcId = crypto.randomUUID()
    const tx = db.transaction(() => {
      db.prepare(`
        INSERT INTO game_table_characters (id, user_id, table_id)
        VALUES (?, ?, ?)
      `).run(newCharId, characterRow?.user_id ?? null, targetTableId)

      if (sheet) {
        db.prepare(`
          INSERT INTO game_table_character_sheets (id, character_id, name, bio, backstory, points, hp, st, dx, iq, ht, fatigue, encumbrance)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          crypto.randomUUID(), newCharId,
          `${sheet.name || ''} (cópia)`,
          sheet.bio || '',
          sheet.backstory || '',
          sheet.points ?? 0,
          sheet.hp ?? 10,
          sheet.st ?? 10,
          sheet.dx ?? 10,
          sheet.iq ?? 10,
          sheet.ht ?? 10,
          sheet.fatigue ?? 10,
          sheet.encumbrance || 'None'
        )
      }

      const insertAdvantage = db.prepare(`
        INSERT INTO game_table_character_advantages (id, advantage_id, name, character_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const adv of advantages) {
        insertAdvantage.run(crypto.randomUUID(), adv.advantage_id ?? null, adv.name ?? null, newCharId, adv.cost_points ?? 0, adv.effect ?? '')
      }

      const insertDisadvantage = db.prepare(`
        INSERT INTO game_table_character_disadvantages (id, disadvantage_id, name, character_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const dis of disadvantages) {
        insertDisadvantage.run(crypto.randomUUID(), dis.disadvantage_id ?? null, dis.name ?? null, newCharId, dis.cost_points ?? 0, dis.effect ?? '')
      }

      const insertSkill = db.prepare(`
        INSERT INTO game_table_character_skills (id, character_id, skill_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?)
      `)
      for (const sk of skills) {
        insertSkill.run(crypto.randomUUID(), newCharId, sk.skill_id ?? null, sk.cost_points ?? 0, sk.effect ?? '')
      }

      const insertQuirk = db.prepare(`
        INSERT INTO game_table_characters_quirks (id, character_id, name, cost_points, effect, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const q of quirks) {
        insertQuirk.run(crypto.randomUUID(), newCharId, q.name ?? null, q.cost_points ?? 0, q.effect ?? '', q.description ?? null)
      }

      db.prepare(`
        INSERT INTO game_table_npcs (id, character_id, status, location_id, module_id, category, subcategory)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(newNpcId, newCharId, npc.status || 'active', null, npc.module_id ?? null, npc.category ?? null, npc.subcategory ?? null)
      copyCharacterImages(charId, newCharId)
    })
    tx()
    return { success: true, id: newNpcId, character_id: newCharId, name: sheet?.name ?? null }
  }

  async duplicateGameCharacter(characterId: string, targetTableId: string): Promise<any> {
    const character: any = db.prepare('SELECT * FROM game_table_characters WHERE id = ?').get(characterId)
    if (!character) throw new Error('Character not found')

    // O dono da cópia é o administrador (narrador titular) da mesa de destino.
    const ownerRow = db.prepare(`
      SELECT n.user_id AS owner_id
      FROM game_tables g
      LEFT JOIN narrators n ON n.id = g.narrator_id
      WHERE g.id = ?
      LIMIT 1
    `).get(targetTableId) as { owner_id: string | null } | undefined
    const ownerUserId = ownerRow?.owner_id ?? character.user_id ?? null

    const sheet: any = db.prepare('SELECT * FROM game_table_character_sheets WHERE character_id = ?').get(characterId)
    const advantages = db.prepare('SELECT * FROM game_table_character_advantages WHERE character_id = ?').all(characterId) as any[]
    const disadvantages = db.prepare('SELECT * FROM game_table_character_disadvantages WHERE character_id = ?').all(characterId) as any[]
    const skills = db.prepare('SELECT * FROM game_table_character_skills WHERE character_id = ?').all(characterId) as any[]
    const quirks = db.prepare('SELECT * FROM game_table_characters_quirks WHERE character_id = ?').all(characterId) as any[]
    const equipment = db.prepare('SELECT * FROM character_equipment WHERE character_id = ?').all(characterId) as any[]

    const newCharId = crypto.randomUUID()
    const tx = db.transaction(() => {
      db.prepare(`
        INSERT INTO game_table_characters (id, user_id, table_id)
        VALUES (?, ?, ?)
      `).run(newCharId, ownerUserId, targetTableId)

      if (sheet) {
        db.prepare(`
          INSERT INTO game_table_character_sheets (id, character_id, name, bio, backstory, points, hp, st, dx, iq, ht, fatigue, encumbrance)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          crypto.randomUUID(), newCharId,
          `${sheet.name || ''} (cópia)`,
          sheet.bio || '',
          sheet.backstory || '',
          sheet.points ?? 0,
          sheet.hp ?? 10,
          sheet.st ?? 10,
          sheet.dx ?? 10,
          sheet.iq ?? 10,
          sheet.ht ?? 10,
          sheet.fatigue ?? 10,
          sheet.encumbrance || 'None'
        )
      }

      const insertAdvantage = db.prepare(`
        INSERT INTO game_table_character_advantages (id, advantage_id, name, character_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const adv of advantages) {
        insertAdvantage.run(crypto.randomUUID(), adv.advantage_id ?? null, adv.name ?? null, newCharId, adv.cost_points ?? 0, adv.effect ?? '')
      }

      const insertDisadvantage = db.prepare(`
        INSERT INTO game_table_character_disadvantages (id, disadvantage_id, name, character_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const dis of disadvantages) {
        insertDisadvantage.run(crypto.randomUUID(), dis.disadvantage_id ?? null, dis.name ?? null, newCharId, dis.cost_points ?? 0, dis.effect ?? '')
      }

      const insertSkill = db.prepare(`
        INSERT INTO game_table_character_skills (id, character_id, skill_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?)
      `)
      for (const sk of skills) {
        insertSkill.run(crypto.randomUUID(), newCharId, sk.skill_id ?? null, sk.cost_points ?? 0, sk.effect ?? '')
      }

      const insertQuirk = db.prepare(`
        INSERT INTO game_table_characters_quirks (id, character_id, name, cost_points, effect, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const q of quirks) {
        insertQuirk.run(crypto.randomUUID(), newCharId, q.name ?? null, q.cost_points ?? 0, q.effect ?? '', q.description ?? null)
      }

      const insertEquipment = db.prepare(`
        INSERT INTO character_equipment (id, character_id, item_id, quantity, status, location)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const eq of equipment) {
        if (!eq.item_id) continue
        insertEquipment.run(crypto.randomUUID(), newCharId, eq.item_id, eq.quantity ?? 1, eq.status || 'in_inventory', eq.location || 'none')
      }
      copyCharacterImages(characterId, newCharId)
    })
    tx()
    return { success: true, character_id: newCharId, name: sheet?.name ?? null }
  }

  async editGameNPC(data: any): Promise<void> {
    db.prepare(`
      UPDATE game_table_npcs
      SET character_id = ?, status = ?, location_id = ?
      WHERE id = ?
    `).run(
      data.character_id,
      data.status,
      data.location_id ?? null,
      data.id
    )
    if (data.character_id) applyCharacterImages(data.character_id, data)
  }
  async findGameNPC(id: any): Promise<any> {
    const npcData = db.prepare(`
      SELECT
        npc.id as npc_id,
        npc.status,
        npc.location_id,
        npc.character_id,
        c.table_id,
        c.user_id,
        cs.id as sheet_id,
        cs.name as sheet_name,
        cs.bio,
        cs.backstory,
        cs.points,
        cs.hp,
        cs.st,
        cs.dx,
        cs.iq,
        cs.ht,
        cs.fatigue,
        cs.encumbrance,
        u.username,
        u.email,
        u.phone,
        g.title as table_title,
        g.intro as table_intro,
        g.system as table_system
      FROM game_table_npcs npc
      LEFT JOIN game_table_characters c ON c.id = npc.character_id
      LEFT JOIN game_table_character_sheets cs ON cs.character_id = c.id
      LEFT JOIN users u ON u.id = c.user_id
      LEFT JOIN game_tables g ON g.id = c.table_id
      WHERE npc.id = ?
    `).get(id) as any

    if (!npcData) return null

    const characterId = npcData.character_id
    const tableId = npcData.table_id
    const userId = npcData.user_id

    const advantages = db.prepare(`
      SELECT * FROM game_table_character_advantages
      WHERE character_id = ?
    `).all(characterId) as any[]

    const skills = db.prepare(`
      SELECT
        csk.id,
        csk.skill_id,
        csk.cost_points,
        csk.effect,
        s.name as skill_name,
        s.predefinition_type,
        s.predefinition_difficulty
      FROM game_table_character_skills csk
      LEFT JOIN game_table_skills s ON s.id = csk.skill_id
      WHERE csk.character_id = ?
    `).all(characterId) as any[]

    const items = db.prepare(`
      SELECT
        i.*,
        ce.id AS equipment_id,
        ce.quantity AS equipment_quantity,
        ce.status AS equipment_status,
        ce.location AS equipment_location
      FROM character_equipment ce
      LEFT JOIN game_table_items i ON i.id = ce.item_id
      WHERE ce.character_id = ?
    `).all(characterId) as any[]

    const peculiarities = db.prepare(`
      SELECT * FROM game_table_characters_quirks
      WHERE character_id = ?
    `).all(characterId) as any[]

    return {
      npc: {
        id: npcData.npc_id,
        status: npcData.status,
        location_id: npcData.location_id ?? null
      },
      character: {
        id: npcData.character_id,
        name: npcData.character_name,
        user: {
          id: npcData.user_id,
          username: npcData.username,
          email: npcData.email,
          phone: npcData.phone
        },
        sheet: npcData.sheet_id ? {
          id: npcData.sheet_id,
          name: npcData.sheet_name,
          bio: npcData.bio,
          backstory: npcData.backstory,
          points: npcData.points,
          hp: npcData.hp,
          st: npcData.st,
          dx: npcData.dx,
          iq: npcData.iq,
          ht: npcData.ht,
          fatigue: npcData.fatigue,
          encumbrance: npcData.encumbrance
        } : null,
        portraitUrl: characterImageMap([characterId]).get(characterId)?.portrait ?? null,
        bodyUrl: characterImageMap([characterId]).get(characterId)?.body ?? null,
        advantages,
        skills,
        items
      },
      table: {
        id: npcData.table_id,
        title: npcData.table_title,
        intro: npcData.table_intro,
        system: npcData.table_system
      },
      peculiarities
    }
  }
  async findAllGameNPCS(tableId: any, location?: any, page?: PageWindow): Promise<any> {
    const pw: PageWindow = page ?? { offset: 0 }
    const table = db.prepare(`
      SELECT
        id,
        narrator_id,
        intro,
        title
      FROM game_tables
      WHERE id = ?
    `).get(tableId as string)

    const npcWhere = `c.table_id = ? AND (? IS NULL OR npc.location_id = ?)`
    const npcsTotal = (db.prepare(`
      SELECT COUNT(*) AS n
      FROM game_table_npcs npc
      LEFT JOIN game_table_characters c ON c.id = npc.character_id
      WHERE ${npcWhere}
    `).get(tableId, location ?? null, location ?? null) as any).n as number

    const gameTablesNPCS = db.prepare(`
      SELECT 
        npc.id as id,
        npc.status,
        npc.character_id,
        npc.location_id,
        cs.name as name,
        cs.points,
        cs.hp,
        cs.st,
        cs.dx,
        cs.iq,
        cs.ht
      FROM game_table_npcs npc
      LEFT JOIN game_table_characters c ON c.id = npc.character_id
      LEFT JOIN game_table_character_sheets cs ON cs.character_id = c.id
      WHERE ${npcWhere}${pageSqlClause(pw)}
    `).all(tableId, location ?? null, location ?? null, ...pageSqlParams(pw)) as any[]

    const npcImages = characterImageMap(gameTablesNPCS.map((n) => n.character_id))
    for (const npc of gameTablesNPCS) {
      npc.portraitUrl = npcImages.get(npc.character_id)?.portrait ?? null
      npc.bodyUrl = npcImages.get(npc.character_id)?.body ?? null
    }

    return ({
        'table': table,
        'npcs': gameTablesNPCS,
        ...pageMeta(npcsTotal, pw)
    })
  }
  
  /* =============== */
  /* NPCS VISIBILITY */
  /* =============== */

  async createGameNPCVisibility(data: any): Promise<void> {
    db.prepare(`
      INSERT INTO narration_npcs (id, narration_id, npc_id)
      VALUES (?, ?, ?)
    `).run(
      crypto.randomUUID(),
      data.narration_id,
      data.npc_id
    )
  }
  async editGameNPCVisibility(data: any): Promise<void> {
    db.prepare(`
      UPDATE narration_npcs
      SET narration_id = ?, npc_id = ?
      WHERE id = ?
    `).run(
      data.narration_id,
      data.npc_id,
      data.id
    )
  }
  async findGameNPCVisibility(id: any): Promise<any> {
    const npcVisibility = db.prepare(`
      SELECT *
      FROM narration_npcs
      WHERE id = ?
    `).get(id) as any
    return npcVisibility
  }
  async findAllGameNPCVisibility(id: any): Promise<any> {
    const npcVisibility = db.prepare(`
      SELECT nn.*, n.title as narration_title, npc.character_id
      FROM narration_npcs nn
      LEFT JOIN narrations n ON n.id = nn.narration_id
      LEFT JOIN game_table_npcs npc ON npc.id = nn.npc_id
      WHERE nn.npc_id = ?
    `).all(id) as any[]
    return npcVisibility
  }

  /* =============== */
  /*    CHARACTERS   */
  /* =============== */

  async createGameCharacter(data: any): Promise<any> {
    const characterId = data.character_id || crypto.randomUUID()
    const sheetId = crypto.randomUUID()

    // A primeira ficha do jogador respeita o orçamento de pontos da mesa.
    // Orçamento 0 = não configurado, a mesa não usa o sistema de pontos.
    if (data.respect_budget) {
      const settings = await this.findTableSettings(data.table_id)
      const budget = settings?.starting_points ?? 0
      if (budget > 0) {
        const spent = Number(data.sheet?.points ?? 0)
        if (!Number.isFinite(spent) || spent > budget) {
          throw new Error(`A ficha gasta ${spent} pontos, mas o orçamento da mesa é ${budget}.`)
        }
      }
    }

    const insertTransaction = db.transaction(() => {
      db.prepare(`
        INSERT INTO game_table_characters (id, user_id, table_id)
        VALUES (?, ?, ?)
      `).run(characterId, data.user_id, data.table_id)

      if (data.sheet) {
        db.prepare(`
          INSERT INTO game_table_character_sheets (id, character_id, name, bio, backstory, points, hp, st, dx, iq, ht, fatigue, encumbrance)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          sheetId, characterId,
          data.sheet.name || '',
          data.sheet.bio || '',
          data.sheet.backstory || '',
          data.sheet.points ?? 0,
          data.sheet.hp ?? 10,
          data.sheet.st ?? 10,
          data.sheet.dx ?? 10,
          data.sheet.iq ?? 10,
          data.sheet.ht ?? 10,
          data.sheet.fatigue ?? 10,
          data.sheet.encumbrance || 'None'
        )
      }

      const insertAdvantage = db.prepare(`
        INSERT INTO game_table_character_advantages (id, advantage_id, name, character_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const adv of (data.advantages || [])) {
        insertAdvantage.run(crypto.randomUUID(), adv.advantage_id || null, adv.name, characterId, adv.cost_points, adv.effect || '')
      }

      const insertDisadvantage = db.prepare(`
        INSERT INTO game_table_character_disadvantages (id, disadvantage_id, name, character_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const dis of (data.disadvantages || [])) {
        insertDisadvantage.run(crypto.randomUUID(), dis.disadvantage_id || null, dis.name, characterId, dis.cost_points, dis.effect || '')
      }

      const insertSkill = db.prepare(`
        INSERT INTO game_table_character_skills (id, character_id, skill_id, cost_points, effect)
        VALUES (?, ?, ?, ?, ?)
      `)
      for (const sk of (data.skills || [])) {
        insertSkill.run(crypto.randomUUID(), characterId, sk.skill_id, sk.cost_points ?? 0, sk.effect || '')
      }

      const insertEquipment = db.prepare(`
        INSERT INTO character_equipment (id, character_id, item_id, quantity, status, location)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const eq of (data.equipment || [])) {
        if (!eq.item_id) continue
        insertEquipment.run(crypto.randomUUID(), characterId, eq.item_id, eq.quantity ?? 1, eq.status || 'in_inventory', eq.location || 'none')
      }

      const insertPeculiarity = db.prepare(`
        INSERT INTO game_table_characters_quirks (id, character_id, name, cost_points, effect, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const pec of (data.peculiarities || [])) {
        insertPeculiarity.run(crypto.randomUUID(), characterId, pec.name, pec.cost_points ?? 0, pec.effect || '', pec.description || '')
      }
      applyCharacterImages(characterId, data)
    })

    insertTransaction()
    return { character_id: characterId, sheet_id: sheetId }
  }

  async editGameCharacter(data: any): Promise<void> {
    const transaction = db.transaction(() => {
      /* Campos condicionais: o payload pode vir parcial (ex.: o mestre só
         alternando `edit_enabled`), então cada campo é gravado só se veio
         definido — diferente do PUT antigo que gravava user_id/table_id
         sempre e desvinculava o personagem num PATCH parcial. */
      const sets: string[] = []
      const params: any[] = []
      if (data.user_id !== undefined) {
        sets.push('user_id = ?')
        params.push(data.user_id)
      }
      if (data.table_id !== undefined) {
        sets.push('table_id = ?')
        params.push(data.table_id)
      }
      if (data.edit_enabled !== undefined) {
        sets.push('edit_enabled = ?')
        params.push(data.edit_enabled ? 1 : 0)
      }
      if (sets.length) {
        db.prepare(`
          UPDATE game_table_characters
          SET ${sets.join(', ')}
          WHERE id = ?
        `).run(...params, data.id)
      }

      if (data.sheet) {
        const updated = db.prepare(`
          UPDATE game_table_character_sheets
          SET name = ?, bio = ?, backstory = ?, points = ?, hp = ?, st = ?, dx = ?, iq = ?, ht = ?, fatigue = ?, encumbrance = ?
          WHERE character_id = ?
        `).run(
          data.sheet.name || '',
          data.sheet.bio || '',
          data.sheet.backstory || '',
          data.sheet.points ?? 0,
          data.sheet.hp ?? 10,
          data.sheet.st ?? 10,
          data.sheet.dx ?? 10,
          data.sheet.iq ?? 10,
          data.sheet.ht ?? 10,
          data.sheet.fatigue ?? 10,
          data.sheet.encumbrance || 'None',
          data.id
        )
        if (updated.changes === 0) {
          db.prepare(`
            INSERT INTO game_table_character_sheets (id, character_id, name, bio, backstory, points, hp, st, dx, iq, ht, fatigue, encumbrance)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            crypto.randomUUID(), data.id,
            data.sheet.name || '',
            data.sheet.bio || '',
            data.sheet.backstory || '',
            data.sheet.points ?? 0,
            data.sheet.hp ?? 10,
            data.sheet.st ?? 10,
            data.sheet.dx ?? 10,
            data.sheet.iq ?? 10,
            data.sheet.ht ?? 10,
            data.sheet.fatigue ?? 10,
            data.sheet.encumbrance || 'None'
          )
        }
      }

      /* Traços: quando o array vem no payload, ele é a fonte da verdade —
         apaga as linhas antigas e reinsere (mesma semântica do create).
         Equipamento NÃO é enviado pelo form, então fica intocado aqui. */
      if (Array.isArray(data.advantages)) {
        db.prepare('DELETE FROM game_table_character_advantages WHERE character_id = ?').run(data.id)
        const insertAdvantage = db.prepare(`
          INSERT INTO game_table_character_advantages (id, advantage_id, name, character_id, cost_points, effect)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        for (const adv of data.advantages) {
          insertAdvantage.run(crypto.randomUUID(), adv.advantage_id || null, adv.name, data.id, adv.cost_points, adv.effect || '')
        }
      }

      if (Array.isArray(data.disadvantages)) {
        db.prepare('DELETE FROM game_table_character_disadvantages WHERE character_id = ?').run(data.id)
        const insertDisadvantage = db.prepare(`
          INSERT INTO game_table_character_disadvantages (id, disadvantage_id, name, character_id, cost_points, effect)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        for (const dis of data.disadvantages) {
          insertDisadvantage.run(crypto.randomUUID(), dis.disadvantage_id || null, dis.name, data.id, dis.cost_points, dis.effect || '')
        }
      }

      if (Array.isArray(data.skills)) {
        db.prepare('DELETE FROM game_table_character_skills WHERE character_id = ?').run(data.id)
        const insertSkill = db.prepare(`
          INSERT INTO game_table_character_skills (id, character_id, skill_id, cost_points, effect)
          VALUES (?, ?, ?, ?, ?)
        `)
        for (const sk of data.skills) {
          insertSkill.run(crypto.randomUUID(), data.id, sk.skill_id, sk.cost_points ?? 0, sk.effect || '')
        }
      }

      if (Array.isArray(data.peculiarities)) {
        db.prepare('DELETE FROM game_table_characters_quirks WHERE character_id = ?').run(data.id)
        const insertPeculiarity = db.prepare(`
          INSERT INTO game_table_characters_quirks (id, character_id, name, cost_points, effect, description)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        for (const pec of data.peculiarities) {
          insertPeculiarity.run(crypto.randomUUID(), data.id, pec.name, pec.cost_points ?? 0, pec.effect || '', pec.description || '')
        }
      }

      applyCharacterImages(data.id, data)
    })
    transaction()
  }

  /**
   * Reescreve só as imagens de um personagem (retrato/corpo/galeria).
   *
   * Mantido à parte de `editGameCharacter` como PATCH de imagens: não toca
   * nem `user_id`/`table_id` nem a ficha. Hoje `editGameCharacter` só grava
   * o que vier definido no payload, mas este caminho continua sendo o barato
   * para a galeria.
   */
  async editGameCharacterImages(id: string, data: any): Promise<void> {
    applyCharacterImages(id, data)
  }

  async editGameCharacterEquipment(data: any): Promise<any> {
    const characterId = data.character_id
    const itemId = data.item_id
    if (!characterId || !itemId) return { success: false }

    const existing = db.prepare(`
      SELECT * FROM character_equipment WHERE character_id = ? AND item_id = ?
    `).get(characterId, itemId) as any

    const status = data.status ?? existing?.status ?? 'in_inventory'
    const location = data.location ?? existing?.location ?? 'none'
    const quantity = data.quantity ?? existing?.quantity ?? 1

    if (existing) {
      db.prepare(`
        UPDATE character_equipment
        SET status = ?, location = ?, quantity = ?, rendered_st = ?
        WHERE id = ?
      `).run(
        status,
        location,
        quantity,
        data.rendered_st ?? existing.rendered_st ?? null,
        existing.id
      )
    } else {
      db.prepare(`
        INSERT INTO character_equipment (id, character_id, item_id, quantity, status, location, rendered_st)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), characterId, itemId, quantity, status, location, data.rendered_st ?? null)
    }

    return { success: true }
  }

  async deleteGameCharacterEquipment(data: any): Promise<any> {
    const characterId = data.character_id
    const itemId = data.item_id
    if (!characterId || !itemId) return { success: false }

    const existing = db.prepare(`
      SELECT * FROM character_equipment WHERE character_id = ? AND item_id = ?
    `).get(characterId, itemId) as any

    if (!existing) return { success: false, error: 'Character does not possess this item.' }

    db.prepare(`
      DELETE FROM character_equipment WHERE id = ?
    `).run(existing.id)

    return { success: true }
  }

  async transferGameCharacterEquipment(data: any): Promise<any> {
    const characterId = data.character_id
    const itemId = data.item_id
    const targetCharacterId = data.target_character_id
    if (!characterId || !itemId || !targetCharacterId) return { success: false }
    if (characterId === targetCharacterId) return { success: false, error: 'Target cannot be the owner.' }

    const source = db.prepare(`
      SELECT * FROM character_equipment WHERE character_id = ? AND item_id = ?
    `).get(characterId, itemId) as any
    if (!source) return { success: false, error: 'Character does not possess this item.' }

    db.prepare(`
      DELETE FROM character_equipment WHERE id = ?
    `).run(source.id)

    const quantity = source.quantity ?? 1
    const targetExisting = db.prepare(`
      SELECT * FROM character_equipment WHERE character_id = ? AND item_id = ?
    `).get(targetCharacterId, itemId) as any
    if (targetExisting) {
      db.prepare(`
        UPDATE character_equipment
        SET quantity = ?, status = ?, location = ?
        WHERE id = ?
      `).run((targetExisting.quantity ?? 1) + quantity, 'in_inventory', 'none', targetExisting.id)
    } else {
      db.prepare(`
        INSERT INTO character_equipment (id, character_id, item_id, quantity, status, location, rendered_st)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), targetCharacterId, itemId, quantity, 'in_inventory', 'none', null)
    }

    return { success: true }
  }

  async sellGameCharacterEquipment(data: any): Promise<any> {
    const sellerId = data.character_id
    const buyerId = data.buyer_character_id
    const itemId = data.item_id
    const priceItemId = data.price_item_id
    const priceQuantity = Number(data.price_quantity ?? 1)
    if (!sellerId || !buyerId || !itemId || !priceItemId || priceQuantity < 1) {
      return { success: false, error: 'Missing sale details.' }
    }
    if (sellerId === buyerId) return { success: false, error: 'You cannot sell to yourself.' }

    const source = db.prepare(`
      SELECT * FROM character_equipment WHERE character_id = ? AND item_id = ?
    `).get(sellerId, itemId) as any
    if (!source) return { success: false, error: 'Character does not possess this item.' }
    const itemQty = source.quantity ?? 1

    const priceRow = db.prepare(`
      SELECT * FROM character_equipment WHERE character_id = ? AND item_id = ?
    `).get(buyerId, priceItemId) as any
    if (!priceRow || (priceRow.quantity ?? 1) < priceQuantity) {
      return { success: false, error: 'Buyer cannot afford the price.' }
    }

    const error = db.transaction((): string | null => {
      const moveItem = moveEquipmentStash(sellerId, buyerId, itemId, itemQty)
      if (!moveItem.ok) return moveItem.error ?? 'Sale failed.'
      const movePrice = moveEquipmentStash(buyerId, sellerId, priceItemId, priceQuantity)
      if (!movePrice.ok) return movePrice.error ?? 'Sale failed.'
      return null
    })()
    if (error) return { success: false, error }

    return {
      success: true,
      item_id: itemId,
      quantity: itemQty,
      buyer_character_id: buyerId,
      price_item_id: priceItemId,
      price_quantity: priceQuantity
    }
  }

  /** Remove um NPC: desamarra as narrações, apaga o vínculo (game_table_npcs)
    e limpa a ficha/personagem por trás dele. */
  async deleteGameNPC(id: any): Promise<any> {
    const npc: any = db.prepare('SELECT id, character_id, status FROM game_table_npcs WHERE id = ?').get(id)
    if (!npc) throw new Error('NPC not found')

    const tx = db.transaction(() => {
      db.prepare('DELETE FROM narration_npcs WHERE npc_id = ?').run(id)
      db.prepare('DELETE FROM game_table_npcs WHERE id = ?').run(id)
      if (npc.character_id) this.deleteCharacterRows(npc.character_id)
    })
    tx()

    return { success: true, id, character_id: npc.character_id ?? null }
  }

  /** Remove um personagem (ou a ficha atrás de um NPC) e tudo que o referencia,
      preservando a cronologia: actions de narração ficam com character_id nulo. */
  async deleteGameCharacter(id: any): Promise<any> {
    const character: any = db.prepare('SELECT id FROM game_table_characters WHERE id = ?').get(id)
    if (!character) throw new Error('Character not found')

    const tx = db.transaction(() => this.deleteCharacterRows(id))
    tx()

    return { success: true, id }
  }

  private deleteCharacterRows(characterId: string): void {
    const npc = db.prepare('SELECT id FROM game_table_npcs WHERE character_id = ?').get(characterId) as any
    if (npc) {
      db.prepare('DELETE FROM narration_npcs WHERE npc_id = ?').run(npc.id)
      db.prepare('DELETE FROM game_table_npcs WHERE character_id = ?').run(characterId)
    }
    db.prepare('DELETE FROM game_table_character_sheets WHERE character_id = ?').run(characterId)
    db.prepare('DELETE FROM game_table_character_images WHERE character_id = ?').run(characterId)
    db.prepare('DELETE FROM game_table_character_advantages WHERE character_id = ?').run(characterId)
    db.prepare('DELETE FROM game_table_character_disadvantages WHERE character_id = ?').run(characterId)
    db.prepare('DELETE FROM game_table_character_skills WHERE character_id = ?').run(characterId)
    db.prepare('DELETE FROM game_table_characters_quirks WHERE character_id = ?').run(characterId)
    db.prepare('DELETE FROM character_equipment WHERE character_id = ?').run(characterId)
    db.prepare('DELETE FROM modifiers WHERE character_id = ?').run(characterId)
    db.prepare('DELETE FROM visibility WHERE character_id = ?').run(characterId)
    db.prepare('UPDATE visibility SET other_character_id = NULL WHERE other_character_id = ?').run(characterId)
    db.prepare('DELETE FROM queue WHERE character_id = ?').run(characterId)
    db.prepare('UPDATE narration_actions SET character_id = NULL WHERE character_id = ?').run(characterId)
    db.prepare('UPDATE narration_actions SET target = NULL WHERE target = ?').run(characterId)
    db.prepare('DELETE FROM narration_characters WHERE character_id = ?').run(characterId)
    db.prepare('DELETE FROM game_table_characters WHERE id = ?').run(characterId)
  }

  async findGameCharacter(id: any, moment?: number, viewer?: any): Promise<any> {
    const characterData = db.prepare(`
      SELECT
        c.id as character_id,
        c.user_id,
        c.table_id,
        c.edit_enabled,
        cs.id as sheet_id,
        cs.name as sheet_name,
        cs.bio,
        cs.backstory,
        cs.points,
        cs.hp,
        cs.st,
        cs.dx,
        cs.iq,
        cs.ht,
        cs.fatigue,
        cs.encumbrance,
        u.username,
        u.email,
        u.phone,
        u.type as user_type,
        g.title as table_title,
        g.intro as table_intro,
        g.system as table_system,
        CASE WHEN npc.id IS NOT NULL THEN 1 ELSE 0 END as is_npc
      FROM game_table_characters c
      LEFT JOIN game_table_character_sheets cs ON cs.character_id = c.id
      LEFT JOIN users u ON u.id = c.user_id
      LEFT JOIN game_tables g ON g.id = c.table_id
      LEFT JOIN game_table_npcs npc ON npc.character_id = c.id
      WHERE c.id = ?
    `).get(id) as any

    if (!characterData) {
      const missing: any = new Error('Personagem não encontrado.')
      missing.status = 404
      throw missing
    }

    const characterId = characterData.character_id
    const tableId = characterData.table_id
    const userId = characterData.user_id

    const advantages = db.prepare(`
      SELECT * FROM game_table_character_advantages
      WHERE character_id = ?
    `).all(characterId) as any[]

    const skills = db.prepare(`
      SELECT
        csk.id,
        csk.skill_id,
        csk.cost_points,
        csk.effect,
        s.name as skill_name,
        s.predefinition_type,
        s.predefinition_difficulty
      FROM game_table_character_skills csk
      LEFT JOIN game_table_skills s ON s.id = csk.skill_id
      WHERE csk.character_id = ?
    `).all(characterId) as any[]

    // Items do personagem via character_equipment (estado/equipamento)
    const items = db.prepare(`
      SELECT
        i.*,
        ce.id AS equipment_id,
        ce.quantity AS equipment_quantity,
        ce.status AS equipment_status,
        ce.location AS equipment_location,
        ce.rendered_st AS equipment_rendered_st,
        w.id AS weapon_id,
        a.id AS armor_id
      FROM character_equipment ce
      LEFT JOIN game_table_items i ON i.id = ce.item_id
      LEFT JOIN game_table_weapons w ON w.item_id = i.id
      LEFT JOIN game_table_armors a ON a.item_id = i.id
      WHERE ce.character_id = ?
    `).all(characterId) as any[]

    // Enriquece cada item com weapon (e ataques) / armor aninhados
    const weaponByItem = new Map<string, any>()
    const armorByItem = new Map<string, any>()
    for (const item of items) {
      if (item.weapon_id && !weaponByItem.has(item.weapon_id)) {
        const w = db.prepare(`SELECT * FROM game_table_weapons WHERE id = ?`).get(item.weapon_id) as any
        if (w) {
          w.attacks = db.prepare(`SELECT * FROM weapon_attacks WHERE weapon_id = ? ORDER BY rowid ASC`).all(w.id) as any[]
          weaponByItem.set(item.weapon_id, w)
        }
      }
      if (item.armor_id && !armorByItem.has(item.armor_id)) {
        const arm = db.prepare(`SELECT * FROM game_table_armors WHERE id = ?`).get(item.armor_id) as any
        if (arm) armorByItem.set(item.armor_id, arm)
      }
    }
    for (const item of items) {
      if (item.weapon_id) item.weapon = weaponByItem.get(item.weapon_id) || null
      if (item.armor_id) item.armor = armorByItem.get(item.armor_id) || null
    }

    const peculiarities = db.prepare(`
      SELECT * FROM game_table_characters_quirks
      WHERE character_id = ?
    `).all(characterId) as any[]

    const disadvantages = db.prepare(`
      SELECT * FROM game_table_character_disadvantages
      WHERE character_id = ?
    `).all(characterId) as any[]

    // Armaduras equipadas pelo personagem (defesa já resolvida pela engine)
    const armors = db.prepare(`
      SELECT a.* FROM character_equipment ce
      INNER JOIN game_table_armors a ON a.item_id = ce.item_id
      WHERE ce.character_id = ? AND ce.status = 'equipped'
    `).all(characterId) as any[]

    const moments = db.prepare(`
      SELECT DISTINCT n.moment
      FROM narrations n
      WHERE n.table_id = ? AND n.moment IS NOT NULL
      ORDER BY n.moment ASC
    `).all(tableId) as any[]

    const modifiers = resolveCharacterModifiers(characterId, moment)

    const activeEffects = modifiers
      .filter((m) =>
        m.mod_hp != null || m.mod_st != null || m.mod_dx != null ||
        m.mod_iq != null || m.mod_ht != null || m.mod_fatigue != null ||
        m.mod_encumbrance != null || m.hp != null || m.st != null || m.dx != null ||
        m.iq != null || m.ht != null || m.fatigue != null || m.encumbrance != null)
      .map((m) => {
        const e: any = { id: m.id }
        for (const k of [
          'name', 'effect', 'description', 'damage_value',
          'mod_hp', 'mod_st', 'mod_dx', 'mod_iq', 'mod_ht', 'mod_fatigue', 'mod_encumbrance',
          'hp', 'st', 'dx', 'iq', 'ht', 'fatigue', 'encumbrance',
          'skill_value', 'advantage_value', 'disadvantage_value', 'armor_value',
          'item_quantity', 'item_weight',
          'kind', 'enabled', 'from_model', 'instance_id'
        ]) {
          if (m[k] != null) e[k] = m[k]
        }
        return e
      })

    const baseStats = {
      hp: characterData.hp ?? 10,
      st: characterData.st ?? 10,
      dx: characterData.dx ?? 10,
      iq: characterData.iq ?? 10,
      ht: characterData.ht ?? 10,
      fatigue: characterData.fatigue ?? 10,
    }

    const currentStats = { ...baseStats }

    for (const mod of modifiers) {
      if (mod.apply_on_roll === 1) continue
      if (mod.enabled === 0) continue
      if (mod.hp != null) currentStats.hp = mod.hp
      if (mod.st != null) currentStats.st = mod.st
      if (mod.dx != null) currentStats.dx = mod.dx
      if (mod.iq != null) currentStats.iq = mod.iq
      if (mod.ht != null) currentStats.ht = mod.ht
      if (mod.fatigue != null) currentStats.fatigue = mod.fatigue

      if (mod.mod_hp != null) currentStats.hp += mod.mod_hp
      if (mod.mod_st != null) currentStats.st += mod.mod_st
      if (mod.mod_dx != null) currentStats.dx += mod.mod_dx
      if (mod.mod_iq != null) currentStats.iq += mod.mod_iq
      if (mod.mod_ht != null) currentStats.ht += mod.mod_ht
      if (mod.mod_fatigue != null) currentStats.fatigue += mod.mod_fatigue
    }

    const basicSpeed = (currentStats.dx + currentStats.ht) / 4
    const itemsWeight = items.reduce(
      (total, item) => total + ((item.weight_lb as number || 0) * (item.equipment_quantity || 1)),
      0
    )
    const st = currentStats.st;

  const encumbranceValue =
      itemsWeight <= st * 2 ? 0 :
      itemsWeight <= st * 4 ? 1 :
      itemsWeight <= st * 6 ? 2 :
      itemsWeight <= st * 12 ? 3 :
      itemsWeight <= st * 20 ? 4 :
      0;

    // Regra de Fadiga (GURPS 4e adaptada): a barra de FP guarda o cansaço
    // acumulado. Zerada (0) o personagem está descansado; conforme o FP
    // enche em direção ao máximo (HT), ele vai cansando. Quando resta menos
    // de 1/3 do FP máximo (remaining < fatigueThreshold), ST, Move e Dodge
    // caem pela metade (arredondando para cima). No topo (0 restante) ele
    // está à beira do colapso: cada FP a mais custa 1 HP de injúria e
    // qualquer ação exige um teste de Vontade.
    const fatigueMax = Math.max(1, baseStats.fatigue > 0 ? baseStats.fatigue : baseStats.ht)
    const fatigueThreshold = Math.ceil(fatigueMax / 3)
    const remainingFatigue = fatigueMax - currentStats.fatigue
    const fatigueState = remainingFatigue <= 0
      ? 'exhausted'
      : remainingFatigue < fatigueThreshold
        ? 'tired'
        : 'active'
    const fatiguedPenalty = fatigueState === 'tired' || fatigueState === 'exhausted'
    const move = basicSpeed - encumbranceValue
    const dodge = Math.round((basicSpeed + 3) * 10) / 10
    const effectiveSt = fatiguedPenalty ? Math.ceil(currentStats.st / 2) : currentStats.st
    const effectiveMove = fatiguedPenalty ? Math.ceil(move / 2) : move
    const effectiveDodge = fatiguedPenalty ? Math.ceil(dodge / 2) : dodge

    const result: any = {
      table: {
        id: characterData.table_id,
        title: characterData.table_title,
        intro: characterData.table_intro,
        system: characterData.table_system
      },
      character: {
        id: characterData.character_id,
        isNpc: !!characterData.is_npc,
        edit_enabled: !!characterData.edit_enabled,
        name: characterData.sheet_name,
        user: {
          id: characterData.user_id,
          username: characterData.username,
          email: characterData.email,
          phone: characterData.phone,
          type: characterData.user_type
        },
        sheet: characterData.sheet_id ? {
          id: characterData.sheet_id,
          name: characterData.sheet_name,
          bio: characterData.bio,
          backstory: characterData.backstory,
          points: characterData.points,
          hp: currentStats.hp,
          st: currentStats.st,
          dx: currentStats.dx,
          iq: currentStats.iq,
          ht: currentStats.ht,
          fatigue: currentStats.fatigue,
          fatigue_max: fatigueMax,
          fatigue_threshold: fatigueThreshold,
          fatigue_state: fatigueState,
          encumbrance: characterData.encumbrance,
          basic_speed: basicSpeed,
          move,
          dodge,
          effective_st: effectiveSt,
          effective_move: effectiveMove,
          effective_dodge: effectiveDodge,
          base_hp: baseStats.hp,
          base_st: baseStats.st,
          base_dx: baseStats.dx,
          base_iq: baseStats.iq,
          base_ht: baseStats.ht,
          base_fatigue: baseStats.fatigue,
          } : null,
        advantages,
        disadvantages,
        armors,
        skills,
        items,
        peculiarities,
        active_effects: activeEffects,
        portraitUrl: characterImageMap([characterId]).get(characterId)?.portrait ?? null,
        bodyUrl: characterImageMap([characterId]).get(characterId)?.body ?? null,
        images: galleryMap('game_table_character_images', 'character_id', [characterId]).get(characterId) ?? []
      },
      peculiarities,
      moments: moments.map((r: any) => r.moment).filter((m: any) => m != null),
      selected_moment: moment ?? null
    }

    const charImages = characterImageMap([characterId]).get(characterId)
    if (charImages) {
      result.character.portraitUrl = charImages.portrait
      result.character.bodyUrl = charImages.body
    }

    // Visibilidade — se um observador (type 1) de outro personagem pede,
    // molde o payload pelas regras de visibilidade desse observador.
    if (viewer && viewer !== characterId) {
      const viewerRow = db.prepare(`
        SELECT u.type as t
        FROM game_table_characters c
        LEFT JOIN users u ON u.id = c.user_id
        WHERE c.id = ?
      `).get(viewer) as any
      if (viewerRow && viewerRow.t !== 0) {
        const rules = db.prepare(`
          SELECT * FROM visibility
          WHERE character_id = ?
            AND (other_character_id IS NULL OR other_character_id = ?)
        `).all(viewer, characterId) as any[]
        shapeCharacterForViewer(result.character, rules)
      }
    }

    return result
  }

  async findGameCharacterHistory(id: any, moment?: number, limit?: number): Promise<any> {
    const characterData = db.prepare(`
      SELECT
        c.id as character_id,
        c.user_id,
        c.table_id,
        cs.name as sheet_name,
        cs.hp,
        cs.st,
        cs.dx,
        cs.iq,
        cs.ht,
        cs.fatigue,
        u.username,
        g.title as table_title,
        g.system as table_system
      FROM game_table_characters c
      LEFT JOIN game_table_character_sheets cs ON cs.character_id = c.id
      LEFT JOIN users u ON u.id = c.user_id
      LEFT JOIN game_tables g ON g.id = c.table_id
      WHERE c.id = ?
    `).get(id) as any

    if (!characterData) return null

    const characterId = characterData.character_id

    // Consequências aplicadas (modifiers ativos) + rolagens registradas
    // (narration_actions com dice_roll, SEM consequência materializada).
    // Ambas as fontes viram eventos na mesma linha do tempo — o teste
    // aparece como marco; a consequência carrega a mudança de estado.
    const consQuery = `
      SELECT
        'consequence' AS kind,
        m.*,
        m.rowid AS _rowid,
        n.moment AS narration_moment,
        n.title AS narration_title,
        n.narration AS narration_body,
        s.title AS scene_title,
        s.moment AS scene_moment,
        s.chapter AS chapter,
        na.queue AS action_queue,
        na.description AS action_description,
        na.result AS action_result,
        na.dice_roll AS action_dice_roll
      FROM modifiers m
      LEFT JOIN narrations n ON n.id = m.narration_id
      LEFT JOIN scenes s ON s.id = n.scene_id
      LEFT JOIN narration_actions na ON na.id = m.action_id
      WHERE m.character_id = ?
        AND (m.apply_on_roll IS NULL OR m.apply_on_roll = 0)
        ${moment != null ? 'AND (n.moment IS NULL OR n.moment <= ?)' : ''}
    `
    const testQuery = `
      SELECT
        'test' AS kind,
        na.id AS id,
        na.queue AS action_queue,
        na.description AS action_description,
        na.result AS action_result,
        na.dice_roll AS action_dice_roll,
        na.rowid AS _rowid,
        n.moment AS narration_moment,
        n.title AS narration_title,
        n.narration AS narration_body,
        s.title AS scene_title,
        s.moment AS scene_moment,
        s.chapter AS chapter,
        q.test_kind AS test_kind,
        q.test_skill AS test_skill,
        q.test_skill_name AS test_skill_name
      FROM narration_actions na
      LEFT JOIN narrations n ON n.id = na.narrations_id
      LEFT JOIN scenes s ON s.id = n.scene_id
      LEFT JOIN (
        SELECT
          q0.action_id,
          MAX(q0.test_kind) AS test_kind,
          MAX(q0.test_skill) AS test_skill,
          MAX(sk.name) AS test_skill_name
        FROM queue q0
        LEFT JOIN game_table_skills sk ON sk.id = q0.test_skill
        GROUP BY q0.action_id
      ) q ON q.action_id = na.id
      WHERE na.character_id = ?
        AND na.dice_roll IS NOT NULL AND TRIM(na.dice_roll) != ''
        ${moment != null ? 'AND (n.moment IS NULL OR n.moment <= ?)' : ''}
        AND NOT EXISTS (
          SELECT 1 FROM modifiers mx
          WHERE mx.action_id = na.id AND mx.character_id = na.character_id
            AND (mx.apply_on_roll IS NULL OR mx.apply_on_roll = 0)
        )
    `

    const consParams = moment != null ? [characterId, moment] : [characterId]
    const testParams = moment != null ? [characterId, moment] : [characterId]
    const consequences = db.prepare(consQuery).all(...consParams) as any[]
    const tests = db.prepare(testQuery).all(...testParams) as any[]

    const combined = [...tests, ...consequences].sort((a, b) => {
      const ak = a.chapter ?? Infinity
      const bk = b.chapter ?? Infinity
      if (ak !== bk) return ak - bk
      const am = a.scene_moment ?? Infinity
      const bm = b.scene_moment ?? Infinity
      if (am !== bm) return am - bm
      const an = a.narration_moment ?? Infinity
      const bn = b.narration_moment ?? Infinity
      if (an !== bn) return an - bn
      const aq = a.action_queue ?? Infinity
      const bq = b.action_queue ?? Infinity
      if (aq !== bq) return aq - bq
      const ao = a.kind === 'test' ? 0 : 1
      const bo = b.kind === 'test' ? 0 : 1
      if (ao !== bo) return ao - bo
      return (a._rowid ?? 0) - (b._rowid ?? 0)
    })

    // Estado acumulado: cada evento carrega o snapshot antes/depois (mesma regra da ficha).
    const baseStats = {
      hp: characterData.hp ?? 10,
      st: characterData.st ?? 10,
      dx: characterData.dx ?? 10,
      iq: characterData.iq ?? 10,
      ht: characterData.ht ?? 10,
      fatigue: characterData.fatigue ?? 10,
    }
    const snapshot = (s: any) => ({
      hp: s.hp, st: s.st, dx: s.dx, iq: s.iq, ht: s.ht, fatigue: s.fatigue,
    })
    let cur = { ...baseStats }
    const enriched: any[] = []
    for (const m of combined) {
      const before = snapshot(cur)
      if (m.hp != null) cur.hp = m.hp
      if (m.st != null) cur.st = m.st
      if (m.dx != null) cur.dx = m.dx
      if (m.iq != null) cur.iq = m.iq
      if (m.ht != null) cur.ht = m.ht
      if (m.fatigue != null) cur.fatigue = m.fatigue
      if (m.mod_hp != null) cur.hp += m.mod_hp
      if (m.mod_st != null) cur.st += m.mod_st
      if (m.mod_dx != null) cur.dx += m.mod_dx
      if (m.mod_iq != null) cur.iq += m.mod_iq
      if (m.mod_ht != null) cur.ht += m.mod_ht
      if (m.mod_fatigue != null) cur.fatigue += m.mod_fatigue
      enriched.push({ ...m, state_before: before, state_after: snapshot(cur) })
    }
    for (const ev of enriched) delete ev._rowid

    /* Teto opcional: devolve apenas os N eventos mais recentes, mas o estado
       acumulado (state_before/state_after) é calculado sobre TODOS os eventos,
       então continua correto. Sem `limit`, mantém o comportamento antigo. */
    const total = enriched.length
    const visible = limit != null && limit > 0 ? enriched.slice(-limit) : enriched

    return {
      character: {
        id: characterData.character_id,
        name: characterData.sheet_name,
        user: {
          id: characterData.user_id,
          username: characterData.username
        }
      },
      table: {
        id: characterData.table_id,
        title: characterData.table_title,
        system: characterData.table_system
      },
      baseline: baseStats,
      total,
      limited: visible.length !== total,
      events: visible
    }
  }

  async findAllGameCharacters(tableId: any, viewer?: any, page?: PageWindow): Promise<any> {
    const pw: PageWindow = page ?? { offset: 0 }
    const table = db.prepare(`
      SELECT
        id,
        narrator_id,
        intro,
        title
      FROM game_tables
      WHERE id = ?
    `).get(tableId as string)

    const charactersTotal = (db.prepare(`
      SELECT COUNT(*) AS n
      FROM game_table_characters c
      WHERE c.table_id = ?
    `).get(tableId) as any).n as number

    const characters = db.prepare(`
      SELECT
        c.id as character_id,
        c.user_id,
        c.is_active,
        c.edit_enabled,
        u.type as user_type,
        cs.id as sheet_id,
        cs.name as sheet_name,
        cs.points,
        cs.hp,
        cs.st,
        cs.dx,
        cs.iq,
        cs.ht,
        u.username,
        CASE WHEN npc.id IS NOT NULL THEN 1 ELSE 0 END as is_npc
      FROM game_table_characters c
      LEFT JOIN game_table_character_sheets cs ON cs.character_id = c.id
      LEFT JOIN users u ON u.id = c.user_id
      LEFT JOIN game_table_npcs npc ON npc.character_id = c.id
      WHERE c.table_id = ?${pageSqlClause(pw)}
    `).all(tableId, ...pageSqlParams(pw)) as any[]

    // Povoa cada linha com os stats efetivos (base + modificadores ativos),
    // igual à semântica do findGameCharacter: sheet.hp é o HP atual, base_hp
    // é o máximo original, e active_effects lista os efeitos em vigor.
    const characterImages = characterImageMap(characters.map((c: any) => c.character_id))

    /* Uma única query para todos os modificadores dos personagens desta página
       (antes era uma query por personagem — N+1). Agrupamos em memória por
       character_id, preservando a ordem por rowid. */
    const modifiersByCharacter = new Map<string, any[]>()
    const pageCharacterIds = characters.map((c: any) => c.character_id).filter(Boolean)
    const allModifiers = pageCharacterIds.length
      ? db.prepare(`
          SELECT m.* FROM modifiers m
          WHERE m.character_id IN (${pageCharacterIds.map(() => '?').join(', ')})
          ORDER BY m.rowid ASC
        `).all(...pageCharacterIds) as any[]
      : []
    for (const m of allModifiers) {
      const list = modifiersByCharacter.get(m.character_id)
      if (list) list.push(m)
      else modifiersByCharacter.set(m.character_id, [m])
    }

    const rows = characters.map(char => {
      const baseStats = {
        hp: char.hp ?? 10,
        st: char.st ?? 10,
        dx: char.dx ?? 10,
        iq: char.iq ?? 10,
        ht: char.ht ?? 10,
      }
      const modifiers = modifiersByCharacter.get(char.character_id) ?? []

      const activeEffects = modifiers
        .filter((m) =>
          m.mod_hp != null || m.mod_st != null || m.mod_dx != null ||
          m.mod_iq != null || m.mod_ht != null || m.mod_fatigue != null ||
          m.hp != null || m.st != null || m.dx != null ||
          m.iq != null || m.ht != null || m.encumbrance != null)
        .map((m) => {
          const e: any = { id: m.id }
          for (const k of [
            'name', 'effect', 'description', 'damage_value',
            'mod_hp', 'mod_st', 'mod_dx', 'mod_iq', 'mod_ht', 'mod_fatigue',
            'hp', 'st', 'dx', 'iq', 'ht'
          ]) {
            if (m[k] != null) e[k] = m[k]
          }
          return e
        })

      const currentStats = { ...baseStats }
      for (const mod of modifiers) {
        if (mod.apply_on_roll === 1) continue
        if (mod.hp != null) currentStats.hp = mod.hp
        if (mod.st != null) currentStats.st = mod.st
        if (mod.dx != null) currentStats.dx = mod.dx
        if (mod.iq != null) currentStats.iq = mod.iq
        if (mod.ht != null) currentStats.ht = mod.ht
        if (mod.mod_hp != null) currentStats.hp += mod.mod_hp
        if (mod.mod_st != null) currentStats.st += mod.mod_st
        if (mod.mod_dx != null) currentStats.dx += mod.mod_dx
        if (mod.mod_iq != null) currentStats.iq += mod.mod_iq
        if (mod.mod_ht != null) currentStats.ht += mod.mod_ht
      }

      return {
        id: char.character_id,
        name: char.sheet_name,
        isNpc: !!char.is_npc,
        is_active: !!char.is_active,
        edit_enabled: !!char.edit_enabled,
        user: {
          id: char.user_id,
          username: char.username,
          type: char.user_type
        },
        sheet: char.sheet_id ? {
          id: char.sheet_id,
          name: char.sheet_name,
          points: char.points,
          hp: currentStats.hp,
          st: currentStats.st,
          dx: currentStats.dx,
          iq: currentStats.iq,
          ht: currentStats.ht,
          current_hp: currentStats.hp,
          base_hp: baseStats.hp,
          base_st: baseStats.st,
          base_dx: baseStats.dx,
          base_iq: baseStats.iq,
          base_ht: baseStats.ht
        } : null,
        portraitUrl: characterImages.get(char.character_id)?.portrait ?? null,
        bodyUrl: characterImages.get(char.character_id)?.body ?? null,
        active_effects: activeEffects
      }
    })

    /* Visibilidade — se um observador (type 1) de outro personagem
       pede a lista, molde cada linha pelas regras desse observador
       (mesma semântica do findGameCharacter com ?viewer). type-0
       (narrator) ou a própria personagem mantêm o payload completo.
       `known` = existe ao menos uma regra de visibilidade escopada
       ao alvo (global ou específica). */
    if (viewer) {
      const viewerRow = db.prepare(`
        SELECT u.type as t
        FROM game_table_characters c
        LEFT JOIN users u ON u.id = c.user_id
        WHERE c.id = ?
      `).get(viewer) as any
      if (viewerRow && viewerRow.t !== 0) {
        const shaped = rows.map((ch: any) => {
          if (ch.id === viewer) {
            return { ...ch, known: true }
          }
          const rules = db.prepare(`
            SELECT * FROM visibility
            WHERE character_id = ?
              AND (other_character_id IS NULL OR other_character_id = ?)
          `).all(viewer, ch.id) as any[]
          const shapedChar = shapeCharacterForViewer(
            { ...ch, items: [], skills: [], advantages: [], disadvantages: [], armors: [] },
            rules
          )
          // `known` = existe regra de status VISÍVEL (not unknown) para o alvo.
          // NPCs sem regra visível ficam ocultos das listas do jogador até o
          // mestre liberá-los (seguindo a lógica "mestre vai liberando").
          const known = rules.some((r: any) => r.status === 'known' || r.status === 'specialist')
          return { ...shapedChar, known }
        })
        return { table, characters: shaped, ...pageMeta(charactersTotal, pw) }
      }
    }

    return {
      table,
      characters: rows.map((ch: any) => ({ ...ch, known: true })),
      ...pageMeta(charactersTotal, pw)
    }
  }

  /* =============== */
  /*    MODIFIERS    */
  /* =============== */

  async createGameModifier(data: any): Promise<any> {
    const id = crypto.randomUUID()
    const kind = normalizeModifierKind(data.kind)
    // Um modelo sem dono é um modelo que nunca aplica em ninguém: cobra o
    // vínculo aqui em vez de deixar a linha Morta no catálogo.
    if (kind === MODIFIER_KIND_MODEL && !data.character_id) {
      const owner = MODIFIER_LINK_COLUMNS.some((column) => column !== 'character_id' && data[column])
      if (!owner) {
        throw new Error('Uma modificação padrão precisa de um dono: vantagem, desvantagem, perícia ou item.')
      }
    }
    db.prepare(`
      INSERT INTO modifiers (id, character_id, item_id, skill_id, advantage_id, disadvantage_id, location_id, action_id, narration_id, scene_id, name, cost_points, effect, description, hp, st, dx, iq, ht, fatigue, encumbrance, mod_hp, mod_st, mod_dx, mod_iq, mod_ht, mod_fatigue, mod_encumbrance, skill_value, advantage_value, disadvantage_value, armor_value, damage_value, item_quantity, item_dimension, item_weight, item_range, item_status, apply_on_roll, kind, enabled, source_modifier_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.character_id || null,
      data.item_id || null,
      data.skill_id || null,
      data.advantage_id || null,
      data.disadvantage_id || null,
      data.location_id || null,
      data.action_id || null,
      data.narration_id || null,
      data.scene_id || null,
      data.name || '',
      data.cost_points ?? null,
      data.effect || '',
      data.description || '',
      data.hp ?? null,
      data.st ?? null,
      data.dx ?? null,
      data.iq ?? null,
      data.ht ?? null,
      data.fatigue ?? null,
      data.encumbrance || null,
      data.mod_hp ?? null,
      data.mod_st ?? null,
      data.mod_dx ?? null,
      data.mod_iq ?? null,
      data.mod_ht ?? null,
      data.mod_fatigue ?? null,
      data.mod_encumbrance || null,
      data.skill_value || null,
      data.advantage_value || null,
      data.disadvantage_value || null,
      data.armor_value || null,
      data.damage_value || null,
      data.item_quantity ?? null,
      data.item_dimension || null,
      data.item_weight ?? null,
      data.item_range || null,
      data.item_status || null,
      data.apply_on_roll ?? 0,
      kind,
      data.enabled == null ? 1 : data.enabled ? 1 : 0,
      data.source_modifier_id || null
    )
    return { id }
  }

  async editGameModifier(data: any): Promise<void> {
    // Colunas de vínculo com o "dono" do modificador. Só são sobrescritas quando a
    // chave chega no payload: um UPDATE incondicional apagaria, por exemplo, a
    // vantagem que originou o modificador sempre que a UI salvasse sem conhecê-la.
    const links = MODIFIER_LINK_COLUMNS.filter((column) => column in data)
    const scalars: Array<[string, any]> = [
      ['name', data.name || ''],
      ['cost_points', data.cost_points ?? null],
      ['effect', data.effect || ''],
      ['description', data.description || ''],
      ['hp', data.hp ?? null],
      ['st', data.st ?? null],
      ['dx', data.dx ?? null],
      ['iq', data.iq ?? null],
      ['ht', data.ht ?? null],
      ['fatigue', data.fatigue ?? null],
      ['encumbrance', data.encumbrance || null],
      ['mod_hp', data.mod_hp ?? null],
      ['mod_st', data.mod_st ?? null],
      ['mod_dx', data.mod_dx ?? null],
      ['mod_iq', data.mod_iq ?? null],
      ['mod_ht', data.mod_ht ?? null],
      ['mod_fatigue', data.mod_fatigue ?? null],
      ['mod_encumbrance', data.mod_encumbrance || null],
      ['skill_value', data.skill_value || null],
      ['advantage_value', data.advantage_value || null],
      ['disadvantage_value', data.disadvantage_value || null],
      ['armor_value', data.armor_value || null],
      ['damage_value', data.damage_value || null],
      ['item_quantity', data.item_quantity ?? null],
      ['item_dimension', data.item_dimension || null],
      ['item_weight', data.item_weight || null],
      ['item_range', data.item_range || null],
      ['item_status', data.item_status || null],
      ['apply_on_roll', data.apply_on_roll ?? 0],
    ]

    const sets: string[] = links.map((column) => `${column} = ?`)
    const values: any[] = links.map((column) => data[column] || null)
    for (const [column, value] of scalars) {
      sets.push(`${column} = ?`)
      values.push(value)
    }
    // kind/enabled/source_modifier_id também são escritos só quando chegam no
    // payload: um PUT vindo de um form antigo (ou de uma tela que só conhece o
    // histórico) não pode rebaixar um modelo para efeito solto nem desligar
    // uma passiva por acidente.
    for (const column of ['kind', 'enabled', 'source_modifier_id'] as const) {
      if (!(column in data)) continue
      sets.push(`${column} = ?`)
      if (column === 'kind') values.push(normalizeModifierKind(data.kind))
      else if (column === 'enabled') values.push(data.enabled ? 1 : 0)
      else values.push(data.source_modifier_id || null)
    }
    values.push(data.id)

    db.prepare(`UPDATE modifiers SET ${sets.join(', ')} WHERE id = ?`).run(...values)
  }

  /* ============================================================
     GM QUICK ACTIONS
     Materialize a change on the target character AND keep a
     modifier row as the story log — the same read-path the
     narrator uses, so the award is replayable by scene moment.
     ============================================================ */

  async grantGameItem(data: any): Promise<any> {
    const characterId = data.character_id
    const itemId = data.item_id
    if (!characterId || !itemId) return { success: false, error: 'character_id and item_id are required' }

    const existing = db.prepare(`
      SELECT * FROM character_equipment WHERE character_id = ? AND item_id = ?
    `).get(characterId, itemId) as any
    const quantity = data.quantity ?? existing?.quantity ?? 1
    const status = data.status ?? existing?.status ?? 'in_inventory'
    const location = data.location ?? existing?.location ?? 'none'

    if (existing) {
      db.prepare(`
        UPDATE character_equipment
        SET status = ?, location = ?, quantity = ?
        WHERE id = ?
      `).run(status, location, quantity, existing.id)
    } else {
      db.prepare(`
        INSERT INTO character_equipment (id, character_id, item_id, quantity, status, location)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), characterId, itemId, quantity, status, location)
    }

    const item = db.prepare(`SELECT name FROM game_table_items WHERE id = ?`).get(itemId) as any
    const id = crypto.randomUUID()
    db.prepare(`
      INSERT INTO modifiers (id, character_id, item_id, action_id, narration_id, scene_id, name, item_quantity, item_status, description, apply_on_roll)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      id,
      characterId,
      itemId,
      data.action_id || null,
      data.narration_id || null,
      data.scene_id || null,
      data.name || (item?.name ? `Granted ${item.name}` : 'Item granted'),
      quantity,
      status,
      data.description || (item?.name ? `+${quantity}× ${item.name}` : `+${quantity} item`)
    )

    return { success: true, id, character_id: characterId, item_id: itemId, quantity, status }
  }

  async awardGameCharacterPoints(data: any): Promise<any> {
    const characterId = data.character_id
    if (!characterId) return { success: false, error: 'character_id is required' }
    const delta = Number(data.points)
    if (!Number.isFinite(delta) || delta === 0) return { success: false, error: 'points must be a non-zero number' }

    const sheet = db.prepare(`
      SELECT id, points FROM game_table_character_sheets WHERE character_id = ?
    `).get(characterId) as any
    if (!sheet) return { success: false, error: 'Character has no sheet' }

    db.prepare(`UPDATE game_table_character_sheets SET points = points + ? WHERE id = ?`).run(delta, sheet.id)

    const id = crypto.randomUUID()
    const name = data.name || (delta > 0 ? 'Experience award' : 'Experience cost')
    db.prepare(`
      INSERT INTO modifiers (id, character_id, action_id, narration_id, scene_id, name, cost_points, description, apply_on_roll)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      id,
      characterId,
      data.action_id || null,
      data.narration_id || null,
      data.scene_id || null,
      name,
      delta,
      data.description || (delta > 0 ? `+${delta} campaign points` : `${delta} campaign points`)
    )

    return { success: true, id, character_id: characterId, points: delta }
  }

  async findGameModifier(id: any): Promise<any> {
    const modifier = db.prepare(`SELECT * FROM modifiers WHERE id = ?`).get(id) as any
    return modifier
  }

  async findAllGameModifiers(tableId: any): Promise<any> {
    const table = db.prepare(`SELECT id, narrator_id, intro, title FROM game_tables WHERE id = ?`).get(tableId as string)

    const modifiers = db.prepare(`
      SELECT DISTINCT m.* FROM modifiers m
      LEFT JOIN game_table_characters gc ON gc.id = m.character_id
      LEFT JOIN scenes s ON s.id = m.scene_id
      LEFT JOIN narrations n ON n.id = m.narration_id
      LEFT JOIN narration_actions na ON na.id = m.action_id
      LEFT JOIN game_table_items gi ON gi.id = m.item_id
      LEFT JOIN game_table_skills gsk ON gsk.id = m.skill_id
      LEFT JOIN game_table_advantages ga ON ga.id = m.advantage_id
      LEFT JOIN game_table_disadvantages gd ON gd.id = m.disadvantage_id
      LEFT JOIN table_locations tl ON tl.id = m.location_id
      WHERE gc.table_id = ?
         OR s.table_id = ?
         OR n.table_id = ?
         OR na.narrations_id IN (SELECT id FROM narrations WHERE table_id = ?)
         OR gi.table_id = ?
         OR gsk.table_id = ?
         OR ga.table_id = ?
         OR gd.table_id = ?
         OR tl.table_id = ?
    `).all(tableId, tableId, tableId, tableId, tableId, tableId, tableId, tableId, tableId) as any[]

    return { table, modifiers }
  }

  /* Consequência automática de skill (por rolagem): quando o teste
     baseado na skill passa, cada modifier do ator marcado com
     apply_on_roll=1 é materializado como um efeito ativo (cópia com
     apply_on_roll=0), que passa a alterar HP/fadiga/atributos do sheet.
     Assim o dano/cura/custo persiste e o máximo de HP/FP não muda.
     A cópia é um efeito solto: source_modifier_id fica vazio de
     propósito, porque essa coluna é reservada à instância de um modelo
     e uma instância nunca compõe sozinha. */
  async applyGameSkillEffect(characterId: string, skillId: string): Promise<any[]> {
    assertCharacterNotMuted(characterId)
    const templates = db.prepare(`
      SELECT * FROM modifiers
      WHERE character_id = ? AND skill_id = ? AND apply_on_roll = 1
    `).all(characterId, skillId) as any[]

    let applied: any[] = []
    for (const t of templates) {
      const id = crypto.randomUUID()
      db.prepare(`
        INSERT INTO modifiers (id, character_id, item_id, skill_id, advantage_id, disadvantage_id, location_id, action_id, narration_id, scene_id, name, cost_points, effect, description, hp, st, dx, iq, ht, fatigue, encumbrance, mod_hp, mod_st, mod_dx, mod_iq, mod_ht, mod_fatigue, mod_encumbrance, skill_value, advantage_value, disadvantage_value, armor_value, damage_value, item_quantity, item_dimension, item_weight, item_range, item_status, apply_on_roll, kind, enabled, source_modifier_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        t.character_id || null,
        t.item_id || null,
        t.skill_id || null,
        t.advantage_id || null,
        t.disadvantage_id || null,
        t.location_id || null,
        t.action_id || null,
        t.narration_id || null,
        t.scene_id || null,
        t.name || '',
        t.cost_points ?? null,
        t.effect || '',
        t.description || '',
        t.hp ?? null,
        t.st ?? null,
        t.dx ?? null,
        t.iq ?? null,
        t.ht ?? null,
        t.fatigue ?? null,
        t.encumbrance || null,
        t.mod_hp ?? null,
        t.mod_st ?? null,
        t.mod_dx ?? null,
        t.mod_iq ?? null,
        t.mod_ht ?? null,
        t.mod_fatigue ?? null,
        t.mod_encumbrance || null,
        t.skill_value || null,
        t.advantage_value || null,
        t.disadvantage_value || null,
        t.armor_value || null,
        t.damage_value || null,
        t.item_quantity ?? null,
        t.item_dimension || null,
        t.item_weight ?? null,
        t.item_range || null,
        t.item_status || null,
        0,
        MODIFIER_KIND_EFFECT,
        1,
        null
      )
      applied.push({
        id,
        name: t.name || 'Effect',
        effect: t.effect || '',
        mod_hp: t.mod_hp ?? null,
        mod_fatigue: t.mod_fatigue ?? null,
        damage_value: t.damage_value ?? null
      })
    }

    return applied
  }

  /* =============== */
  /*    VISIBILITY   */
  /* =============== */

  async createGameVisibility(data: any): Promise<any> {
    const id = crypto.randomUUID()
    db.prepare(`
      INSERT INTO visibility (id, character_id, other_character_id, skill_id, advantage_id, disadvantage_id, attribute, additionals_attributes, item_id, location_id, value, status, scene_id, narration_id, moment, previous_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.character_id || null,
      data.other_character_id || null,
      data.skill_id || null,
      data.advantage_id || null,
      data.disadvantage_id || null,
      data.attribute || null,
      data.additionals_attributes || null,
      data.item_id || null,
      data.location_id || null,
      data.value || '',
      data.status || 'unknown',
      data.scene_id || null,
      data.narration_id || null,
      data.moment ?? null,
      data.previous_status ?? null
    )
    return { id }
  }

  async editGameVisibility(data: any): Promise<void> {
    const existing = data.id
      ? db.prepare(`SELECT * FROM visibility WHERE id = ?`).get(data.id) as any
      : null
    const statusChanged =
      !!existing && !!data.status && existing.status !== data.status
    // Ao mudar de status, registra o estado anterior (delta de descoberta);
    // o contexto cena/narração/momento acompanha a mudança (ou o atual).
    const previousStatus = statusChanged
      ? (existing.status ?? null)
      : (existing?.previous_status ?? null)
    const sceneId = data.scene_id || (existing?.scene_id ?? null)
    const narrationId = data.narration_id || (existing?.narration_id ?? null)
    const moment = data.moment != null ? data.moment : (existing?.moment ?? null)

    db.prepare(`
      UPDATE visibility SET
        character_id = ?, other_character_id = ?, skill_id = ?, advantage_id = ?, disadvantage_id = ?,
        attribute = ?, additionals_attributes = ?, item_id = ?, location_id = ?, value = ?, status = ?,
        scene_id = ?, narration_id = ?, moment = ?, previous_status = ?
      WHERE id = ?
    `).run(
      data.character_id || null,
      data.other_character_id || null,
      data.skill_id || null,
      data.advantage_id || null,
      data.disadvantage_id || null,
      data.attribute || null,
      data.additionals_attributes || null,
      data.item_id || null,
      data.location_id || null,
      data.value || '',
      data.status || 'unknown',
      sceneId,
      narrationId,
      moment,
      previousStatus,
      data.id
    )
  }

  async findGameVisibility(id: any): Promise<any> {
    const visibility = db.prepare(`SELECT * FROM visibility WHERE id = ?`).get(id) as any
    return visibility
  }

  async findAllGameVisibility(characterId: any): Promise<any> {
    const visibility = db.prepare(`SELECT * FROM visibility WHERE character_id = ?`).all(characterId) as any[]
    return visibility
  }

  /* =============== */
  /*      QUEUE      */
  /* =============== */

  async createGameQueue(data: any): Promise<any> {
    assertCharacterNotMuted(data.character_id)
    const id = crypto.randomUUID()
    db.prepare(`
      INSERT INTO queue (id, character_id, action_id, queue, status, test_dice, test_count, test_mod, test_attr, test_kind, test_skill)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.character_id || null,
      data.action_id || null,
      data.queue || '',
      data.status || 'pending',
      data.test_dice || '6',
      data.test_count ?? 3,
      data.test_mod ?? 0,
      data.test_attr || 'dx',
      data.test_kind || 'attr',
      data.test_skill || null
    )
    return { id }
  }

  async editGameQueue(data: any): Promise<void> {
    assertCharacterNotMuted(data.character_id)
    db.prepare(`
      UPDATE queue SET character_id = ?, action_id = ?, queue = ?, status = ?, test_dice = ?, test_count = ?, test_mod = ?, test_attr = ?, test_kind = ?, test_skill = ?
      WHERE id = ?
    `).run(
      data.character_id || null,
      data.action_id || null,
      data.queue || '',
      data.status || 'pending',
      data.test_dice || '6',
      data.test_count ?? 3,
      data.test_mod ?? 0,
      data.test_attr || 'dx',
      data.test_kind || 'attr',
      data.test_skill || null,
      data.id
    )
  }

  /** Encerra o turno de um jogador num único passo atômico:
      grava a ação (narration_actions) e tira o personagem da fila.
      Só a pessoa que está NA VEZ na fila pode fazê-lo. */
  async endPlayerTurn(data: any): Promise<any> {
    assertCharacterNotMuted(data.character_id)
    const tx = db.transaction(() => {
      const front = db
        .prepare(`
          SELECT id, character_id FROM queue
          WHERE status != 'done'
          ORDER BY CAST(queue AS INTEGER) ASC, rowid ASC
          LIMIT 1
        `)
        .get() as any
      if (!front) throw new Error('Queue is empty — no one is acting right now')
      if (front.character_id !== data.character_id) {
        throw new Error('It is not your turn — wait for the spotlight')
      }

      const actionId = crypto.randomUUID()
      db.prepare(`
        INSERT INTO narration_actions (id, narrations_id, queue, result, dice_roll, modificator, target, multitarget, description, character_id, location_id, q, r, facing)
        VALUES (?, ?, ?, ?, ?, NULL, NULL, 0, ?, ?, ?, ?, ?, ?)
      `).run(
        actionId,
        data.narrations_id || null,
        data.queue ?? 0,
        data.result ?? null,
        data.dice_roll ?? null,
        data.description ?? null,
        data.character_id,
        data.location_id ?? null,
        data.q != null ? Math.round(data.q) : null,
        data.r != null ? Math.round(data.r) : null,
        data.facing ?? 0
      )

      db.prepare(`UPDATE queue SET status = 'done', queue = '' WHERE id = ?`).run(front.id)
      return { action_id: actionId }
    })
    return tx()
  }

  async findGameQueue(id: any): Promise<any> {
    const queueItem = db.prepare(`SELECT * FROM queue WHERE id = ?`).get(id) as any
    return queueItem
  }

  async findAllGameQueue(tableId: any): Promise<any> {
    const queueItems = db.prepare(`
      SELECT q.*, cs.name as character_name
      FROM queue q
      LEFT JOIN game_table_characters gc ON gc.id = q.character_id
      LEFT JOIN game_table_character_sheets cs ON cs.character_id = gc.id
      WHERE gc.table_id = ?
      ORDER BY (q.status = 'done') ASC, CAST(q.queue AS INTEGER) ASC, q.rowid ASC
    `).all(tableId) as any[]
    return queueItems
  }

  /* ============ TABLE SETTINGS ============ */

  async findTableSettings(tableId: any): Promise<any> {
    // starting_points = 0 significa "orçamento não configurado": a mesa não
    // usa o sistema de pontos, então nada de barra nem limite de gasto.
    const defaults = {
      table_id: tableId,
      turn_end_mode: 'after_test',
      item_mode: 'gm',
      reaction_mode: 'gm',
      gm_adds_item: 1,
      money_item_id: null,
      starting_shop: 0,
      starting_points: 0
    }
    const row = db
      .prepare(`SELECT * FROM game_table_settings WHERE table_id = ?`)
      .get(tableId) as any
    // Uma mesa pode ter várias moedas — game_table_currencies é a fonte. O nome
    // vem junto para o front não precisar resolver o item a cada tela.
    const currencies = db
      .prepare(`
        SELECT c.item_id, c.starting_amount, i.name
        FROM game_table_currencies c
        LEFT JOIN game_table_items i ON i.id = c.item_id
        WHERE c.table_id = ?
        ORDER BY c.rowid
      `)
      .all(tableId) as any[]
    const settings = row ? { ...row } : { ...defaults, currencies: [] }
    settings.currencies = currencies.map((c) => ({
      item_id: c.item_id,
      name: c.name ?? null,
      starting_amount: c.starting_amount ?? 0
    }))
    return settings
  }

  async updateTableSettings(data: any): Promise<void> {
    const tableId = data.table_id
    if (!tableId) throw new Error('table_id is required')
    const turnEndMode = data.turn_end_mode === 'after_move' ? 'after_move' : 'after_test'
    const itemMode = data.item_mode === 'points' ? 'points' : 'gm'
    const reactionMode = data.reaction_mode === 'points' ? 'points' : 'gm'
    const gmAddsItem = data.gm_adds_item ? 1 : 0
    const startingShop = data.starting_shop ? 1 : 0
    const startingPoints = Number.isFinite(Number(data.starting_points)) ? Math.max(0, Math.floor(Number(data.starting_points))) : 0

    // Moedas declaradas: [{ item_id?, name?, starting_amount }]. O padrão do
    // catálogo pode chegar só com o nome — aí o item é criado na hora, como
    // quando se adiciona um local. Duplicadas (por id ou por nome) caem fora.
    const seenIds = new Set<string>()
    const seenNames = new Set<string>()
    const currencies: Array<{ item_id?: string; name?: string; starting_amount: number }> = []
    for (const c of Array.isArray(data.currencies) ? data.currencies : []) {
      const itemId = typeof c?.item_id === 'string' && c.item_id ? c.item_id : null
      const name = typeof c?.name === 'string' && c.name.trim() ? c.name.trim() : null
      if (!itemId && !name) continue
      const key = itemId ?? name!.toLowerCase()
      if (seenIds.has(key)) continue
      seenIds.add(key)
      if (name) {
        const nameKey = name.toLowerCase()
        if (seenNames.has(nameKey)) continue
        seenNames.add(nameKey)
      }
      const amount = Number.isFinite(Number(c?.starting_amount))
        ? Math.max(0, Math.floor(Number(c.starting_amount)))
        : 0
      currencies.push({ item_id: itemId ?? undefined, name: name ?? undefined, starting_amount: amount })
    }

    const save = db.transaction(() => {
      // A PK é (table_id, lang) e a API é por mesa (sem lang). Preserva o
      // lang da linha existente para não criar uma segunda linha por tabela.
      const current = db
        .prepare(`SELECT lang FROM game_table_settings WHERE table_id = ? LIMIT 1`)
        .get(tableId) as any
      const lang = current?.lang ?? 'pt'
      db.prepare(`
        INSERT INTO game_table_settings (
          table_id, lang, turn_end_mode, item_mode, reaction_mode, gm_adds_item, money_item_id, starting_shop, starting_points
        ) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)
        ON CONFLICT(table_id, lang) DO UPDATE SET
          turn_end_mode = excluded.turn_end_mode,
          item_mode = excluded.item_mode,
          reaction_mode = excluded.reaction_mode,
          gm_adds_item = excluded.gm_adds_item,
          money_item_id = NULL,
          starting_shop = excluded.starting_shop,
          starting_points = excluded.starting_points
      `).run(tableId, lang, turnEndMode, itemMode, reactionMode, gmAddsItem, startingShop, startingPoints)

      // Resolve a moeda: id válido, item homônimo já existente, ou item novo.
      const byId = db.prepare(`SELECT id, name FROM game_table_items WHERE table_id = ? AND id = ? LIMIT 1`)
      const byName = db.prepare(`SELECT id, name FROM game_table_items WHERE table_id = ? AND lower(name) = lower(?) LIMIT 1`)
      const createCurrency = db.prepare(`
        INSERT INTO game_table_items (id, table_id, name, kind, category, weight_lb, cost, description, quality, condition)
        VALUES (?, ?, ?, 'currency', 'currency', 0, NULL, ?, 'standard', 'new')
      `)

      const resolved: Array<{ item_id: string; starting_amount: number }> = []
      for (const c of currencies) {
        let itemId = c.item_id ?? null
        let itemName = c.name ?? null
        if (itemId) {
          const hit = byId.get(tableId, itemId) as any
          if (hit) {
            itemId = hit.id
            itemName = hit.name
          } else {
            itemId = null
          }
        }
        if (!itemId && itemName) {
          const hit = byName.get(tableId, itemName) as any
          if (hit) itemId = hit.id
        }
        if (!itemId && itemName) {
          itemId = crypto.randomUUID()
          createCurrency.run(itemId, tableId, itemName, `Moeda da mesa ${itemName}.`)
        }
        if (!itemId) continue
        resolved.push({ item_id: itemId, starting_amount: c.starting_amount })
      }

      db.prepare(`DELETE FROM game_table_currencies WHERE table_id = ?`).run(tableId)
      const insertCurrency = db.prepare(`
        INSERT INTO game_table_currencies (table_id, item_id, starting_amount) VALUES (?, ?, ?)
      `)
      for (const c of resolved) insertCurrency.run(tableId, c.item_id, c.starting_amount)
    })
    save()
  }
}