/* ============================================================
   CharacterVisibility — server-side shaping of a character
   payload for a "player" viewer (user.type 1).

   Rules live in the `visibility` table:
     character_id       = the OBSERVING character
     other_character_id = the TARGET character (NULL = any target)
     skill/advantage/disadvantage/item_id/attribute = entity switched
     attribute          = 'name' or a sheet field
     status  = 'known' | 'specialist' | 'unknown'  (legacy 'hidden' → unknown)
     value   = alias/masked value shown in place of the real value

   Three-tier ladder (the narrator decides what each reader knows):
     unknown    → hidden (name '???', attrs null, entity absent)
     known      → masked: you know the entity *as something* —
                  the `value` field is shown (masked name for a
                  character, an unidentified item, a partial stat)
     specialist → full real values
     absent rule ⇒ unknown (default). type-0 viewers keep the full
     payload and never reach this module.

   A rule row scopes by observer (`character_id`) and, optionally, a
   target character (`other_character_id`). Location and catalog rows
   are observer-global (other_character_id NULL) — a place or the bare
   knowledge that an item exists isn't bound to a single target sheet.

   Discovery tracers (`scene_id`/`narration_id`/`moment`/`previous_status`)
   are stored per rule so a timeline can later show when each observer
   learned (or lost) knowledge of an entity.
   ============================================================ */

export type VisStatus = 'known' | 'specialist' | 'unknown'

interface VisRule {
  status: VisStatus
  value: string
}

const ATTR_KEYS = [
  'st',
  'dx',
  'iq',
  'ht',
  'hp',
  'fatigue',
  'points',
  'basic_speed',
  'move',
  'encumbrance',
]

const BASE_ATTR_MAP: Record<string, string> = {
  st: 'base_st',
  dx: 'base_dx',
  iq: 'base_iq',
  ht: 'base_ht',
  hp: 'base_hp',
  fatigue: 'base_fatigue',
}

const HIDEABLE_SHEET_TEXT = ['bio', 'backstory']

function isVisible(r?: VisRule): boolean {
  return !!r && (r.status === 'known' || r.status === 'specialist')
}

/** Masks an entity/name per the ladder: known (and unknown) show the
    alias `value`, specialist (or no rule) shows the real value. */
function maskedLabel(r: VisRule | undefined, real: string): string {
  if (!r) return '???'
  if (r.status === 'specialist') return real
  return r.value || '???'
}

interface RuleMap {
  attrs: Map<string, VisRule>
  items: Map<string, VisRule>
  skills: Map<string, VisRule>
  advantages: Map<string, VisRule>
  disadvantages: Map<string, VisRule>
  locations: Map<string, VisRule>
  connections: Map<string, VisRule>
}

function buildRuleMap(rules: any[]): RuleMap {
  const map: RuleMap = {
    attrs: new Map(),
    items: new Map(),
    skills: new Map(),
    advantages: new Map(),
    disadvantages: new Map(),
    locations: new Map(),
    connections: new Map(),
  }
  for (const r of rules ?? []) {
    if (!r) continue
    const status: VisStatus =
      r.status === 'known' || r.status === 'specialist' ? r.status : 'unknown'
    const rule: VisRule = { status, value: r.value ?? '' }
    if (r.attribute) {
      const names = [
        String(r.attribute).toLowerCase(),
        ...String(r.additionals_attributes ?? '')
          .split(',')
          .map((s: string) => s.trim().toLowerCase())
          .filter(Boolean),
      ]
      for (const n of names) map.attrs.set(n, rule)
    }
    if (r.item_id) map.items.set(String(r.item_id), rule)
    if (r.skill_id) map.skills.set(String(r.skill_id), rule)
    if (r.advantage_id) map.advantages.set(String(r.advantage_id), rule)
    if (r.disadvantage_id) map.disadvantages.set(String(r.disadvantage_id), rule)
    if (r.location_id) map.locations.set(String(r.location_id), rule)
    if (r.connection_id) map.connections.set(String(r.connection_id), rule)
  }
  return map
}

/** Item-specific fields a carrying character would not know for an
    unidentified item. Same list also covers armor rows. */
const ITEM_MASK_KEYS = [
  'weapon',
  'armor',
  'cost',
  'weight_lb',
  'dimensions',
  'description',
  'category',
  'quality',
  'condition',
  'kind',
  'dr',
  'locations',
  'fit',
  'flex',
  'weight',
]

/** For a 'known' (unidentified) item/armor: keep the presence and the
    equipment facts, mask the name, blank everything you wouldn't know. */
function maskItem(item: any, rule: VisRule): any {
  const masked = { ...item }
  for (const k of ITEM_MASK_KEYS) masked[k] = null
  masked.name = rule.value || '?'
  return masked
}

/** Location fields a reader who only "knows of" the place shouldn't see. */
const LOCATION_MASK_KEYS = [
  'region',
  'sub_region',
  'subRegion',
  'address',
  'is_indoor',
  'isIndoor',
  'country',
  'area',
  'dimensions',
  'description',
  'other',
]

function maskLocation(loc: any, rule: VisRule): any {
  const masked = { ...loc }
  for (const k of LOCATION_MASK_KEYS) masked[k] = null
  masked.name = rule.value || '?'
  return masked
}

export type CatalogKind = 'item' | 'skill' | 'advantage' | 'disadvantage' | 'location'

/**
 * Quem está vendo o catálogo, já resolvido no servidor.
 *
 * A distinção entre `unfiltered` e `characterId: null` é deliberada: um
 * jogador sem personagem resolvível precisa ver **nada**, e não o catálogo
 * inteiro. Tratar "sem viewer" como "sem filtro" é justamente o vazamento que
 * a resolução por `actor` veio fechar.
 */
export interface ViewerScope {
  /** Narrador dono ou convidado: o catálogo volta como veio do banco. */
  unfiltered?: boolean
  /** Personagem cujas regras de conhecimento filtram a resposta. */
  characterId?: string | null
}

/**
 * Normaliza o segundo argumento dos reads para um par inequívoco.
 *
 * - `undefined` → narrator, sem filtro (uso interno do servidor)
 * - string       → filtro por aquele personagem (compatibilidade)
 * - `{ unfiltered: true }` → narrador, sem filtro
 * - `{ characterId: null }` → filtro sem personagem: resultado vazio
 */
export function resolveViewerScope(
  scope?: ViewerScope | string | null
): { filter: boolean; characterId: string | null } {
  if (scope === undefined) return { filter: false, characterId: null }
  if (typeof scope === 'string') return { filter: true, characterId: scope }
  if (scope?.unfiltered) return { filter: false, characterId: null }
  return { filter: true, characterId: scope?.characterId ?? null }
}

/** Shape a whole catalog (items/skills/advantages/disadvantages/locations)
    for a viewer. Knowledge rules are observer-global: any visible rule for
    `rules` counts. Possessed items stay accessible even with no rule, but
    read as unidentified until the narrator marks them specialist. */
export function shapeCatalogForViewer(
  entities: any[],
  rules: any[],
  kind: CatalogKind,
  possessedIds?: Set<string>
): any[] {
  const map = buildRuleMap(rules)
  return (entities ?? []).filter((e: any) => {
    if (kind === 'item') {
      if (possessedIds?.has(String(e?.id))) return true
      return isVisible(map.items.get(String(e?.id)))
    }
    if (kind === 'location') return isVisible(map.locations.get(String(e?.id)))
    if (kind === 'skill') return isVisible(map.skills.get(String(e?.id)))
    if (kind === 'advantage') return isVisible(map.advantages.get(String(e?.id)))
    if (kind === 'disadvantage') return isVisible(map.disadvantages.get(String(e?.id)))
    return true
  }).map((e: any) => {
    if (kind === 'item') {
      const rule = map.items.get(String(e?.id))
      const possessed = possessedIds?.has(String(e?.id))
      if (rule?.status === 'specialist') return e
      if (rule?.status === 'known') return maskItem(e, rule)
      if (possessed) {
        const unidentified: VisRule = { status: 'unknown', value: '' }
        return maskItem(e, unidentified)
      }
      return e
    }
    if (kind === 'location') {
      const rule = map.locations.get(String(e?.id))
      if (rule?.status === 'specialist') return e
      if (rule?.status === 'known') return maskLocation(e, rule)
      return e
    }
    return e
  })
}

/**
 * Conexões entre locais (portas/escadas/portais...) e knowledge rules:
 * a passagem só é visível com regra 'known'/'specialist' E com as duas
 * pontas conhecidas (filtrar por `knownIds`); em 'known' o label vira o
 * alias (`value`) e a descrição some. Aceita tanto DTOs completos
 * (`from`/`to`) quanto entradas de link (with `partner`) vindas do
 * findGameLocation.
 */
export const CONNECTION_MASK_KEYS = ['description']

function maskLocationConnection(conn: any, rule: VisRule): any {
  const masked = { ...conn }
  for (const k of CONNECTION_MASK_KEYS) masked[k] = null
  masked.label = rule.value || '?'
  return masked
}

export function shapeLocationConnections(
  connections: any[],
  rules: any[],
  knownIds?: Set<string>
): any[] {
  const map = buildRuleMap(rules)
  return (connections ?? []).filter((c: any) => {
    if (!isVisible(map.connections.get(String(c?.id)))) return false
    if (knownIds?.size) {
      const partnerId = c?.partner?.id
      if (partnerId && !knownIds.has(String(partnerId))) return false
      const fromId = c?.from?.id ?? c?.from_location_id
      const toId = c?.to?.id ?? c?.to_location_id
      if (!partnerId && fromId && toId && (!knownIds.has(String(fromId)) || !knownIds.has(String(toId)))) return false
    }
    return true
  }).map((c: any) => {
    const rule = map.connections.get(String(c?.id))
    if (rule?.status === 'specialist') return c
    if (rule?.status === 'known') return maskLocationConnection(c, rule)
    return c
  })
}

export function shapeCharacterForViewer(character: any, rules: any[]): any {
  if (!character) return character
  const map = buildRuleMap(rules)
  const sheet = character.sheet
  const isNpc = !!character.isNpc

  // NPC liberado como specialist revela a ficha inteira (nome e atributos),
  // sem depender de regras individuais de cada stat.
  if (isNpc) {
    const nameRule = map.attrs.get('name')
    if (nameRule?.status === 'specialist') {
      if (sheet) sheet.name = character.sheet.name
      if (sheet && character.name) character.name = sheet.name
      return character
    }
  }

  if (character.user) {
    const nameRule = map.attrs.get('name')
    // Account identity only fully naked at specialist; a masked name
    // (known) still hides the account behind it.
    if (nameRule?.status !== 'specialist') {
      character.user.username = null
      character.user.email = null
      character.user.phone = null
    }
  }

  if (sheet) {
    const nameRule = map.attrs.get('name')
    const shownName = maskedLabel(nameRule, sheet.name)
    sheet.name = shownName
    character.name = shownName

    for (const key of HIDEABLE_SHEET_TEXT) {
      const r = map.attrs.get(key)
      if (r && !isVisible(r)) sheet[key] = r.value || null
    }

    for (const key of ATTR_KEYS) {
      const r = map.attrs.get(key)
      if (r && !isVisible(r)) sheet[key] = r.value || null
      else if (!r) sheet[key] = null
    }
    for (const [attr, baseKey] of Object.entries(BASE_ATTR_MAP)) {
      const r = map.attrs.get(attr)
      if (!isVisible(r)) sheet[baseKey] = null
    }
  }

  character.items = (character.items ?? []).map((it: any) => ({
    it,
    rule: map.items.get(String(it?.item_id ?? it?.id)),
  }))
    .filter(({ rule }: any) => isVisible(rule))
    .map(({ it, rule }: any) => {
      if (rule.status === 'specialist') return it
      return maskItem(it, rule)
    })
  character.skills = (character.skills ?? []).filter((sk: any) =>
    isVisible(map.skills.get(String(sk?.skill_id ?? sk?.id)))
  )
  character.advantages = (character.advantages ?? []).filter((a: any) =>
    isVisible(map.advantages.get(String(a?.advantage_id ?? a?.id)))
  )
  character.disadvantages = (character.disadvantages ?? []).filter((d: any) =>
    isVisible(map.disadvantages.get(String(d?.disadvantage_id ?? d?.id)))
  )
  character.peculiarities = (character.peculiarities ?? []).filter(() =>
    isVisible(map.attrs.get('peculiarity'))
  )
  character.armors = (character.armors ?? []).map((a: any) => ({
    a,
    rule: map.items.get(String(a?.item_id)),
  }))
    .filter(({ rule }: any) => isVisible(rule))
    .map(({ a, rule }: any) => {
      if (rule.status === 'specialist') return a
      return maskItem(a, rule)
    })

  return character
}