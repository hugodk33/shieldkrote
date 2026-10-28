// src/infra/variables/varVisibility.ts
import crypto from 'crypto'

import { characterGalarhornId, characterLyraId, characterKaelId, characterGarrickId, characterNPCsIds } from './MainUUIDIds/uuidCharacters'
import { characterSheets } from './varCharacters'
import { newNpcs } from './varNPC'
import { items } from './varItems'
import { modifierTableLocations } from './varLocations'
import { modifierNarrationsActions, modifierNarrationsLocations } from './varModifiers'
import {
  connMarketLibraryId,
  connLibraryUpperId,
  connTankardCellarId,
  connWatchUpperId,
  locLibraryUpperId,
  locTankardCellarId,
  locWatchUpperId,
} from './MainUUIDIds/uuidLocation'

/* ============================================================
   Seeds de visibilidade da mesa principal.

   O que cada JOGADOR (observador) já conhece do mundo no início:
     · Party → Party: companheiros se conhecem — nome, bio, backstory
       e atributos-base visíveis entre si.
     · Party → NPCs: aliados conhecidos pelo nome real, alguns NPCs
       conhecidos por um apelido (máscara), inimigos/bosses ocultos.
     · Party → Itens: o conhecimento comum do mundo (armas comuns,
       armaduras, utilidades), itens exóticos ocultos.
     · Party → Locais: os lugares comuns do mundo (mundo/continente/
       nação/cidade/bairros/ponto de encontro), locais secretos ocultos.

   Status usados: 'known' (mostra o valor mascarado) e 'specialist'
   (revela o valor real). Regra ausente ⇒ unknown (oculto).
   ============================================================ */

export type VisibilitySeed = {
  id: string
  character_id: string
  other_character_id?: string | null
  skill_id?: string | null
  advantage_id?: string | null
  disadvantage_id?: string | null
  attribute?: string | null
  additionals_attributes?: string | null
  item_id?: string | null
  location_id?: string | null
  connection_id?: string | null
  value: string
  status: 'known' | 'specialist'
}

const sheetName = (characterId: string): string =>
  characterSheets.find((s) => s.characterId === characterId)?.name ?? characterId

const PARTY_IDS = [
  characterGalarhornId,
  characterLyraId,
  characterKaelId,
  characterGarrickId,
]

// Itens conhecidos como "conhecimento comum do mundo": nome real.
const KNOWN_ITEMS: Array<{ name: string; kind?: string }> = [
  { name: 'Shortsword', kind: 'weapon' },
  { name: 'Dagger', kind: 'weapon' },
  { name: 'Hand Axe', kind: 'weapon' },
  { name: 'Recurve Bow', kind: 'weapon' },
  { name: 'Medium Shield', kind: 'shield' },
  { name: 'Travel Cloak', kind: 'equipment' },
  { name: 'Leather Armor', kind: 'armor' },
]

// Itens conhecidos apenas por um apelido (não identificados).
const ALIAS_ITEMS: Array<{ name: string; alias: string }> = [
  { name: 'Fine Dagger', alias: 'a finely worked blade' },
  { name: 'Throwing Knife', alias: 'a pair of balanced knives' },
  { name: 'Wizard Staff', alias: 'an arcane stave' },
  { name: 'Arcanist Staff', alias: 'a crest-carved staff' },
  { name: 'Spellbook', alias: 'a weathered tome' },
  { name: 'Arcane Focus Crystal', alias: 'a glow-splintered shard' },
  { name: 'Elixir of Minor Healing', alias: 'a distillation of pale blooms' },
  { name: 'Lockpick Set', alias: 'thin steel picks' },
  { name: 'Smoke Bomb Pouch', alias: 'a smoking pouch' },
  { name: 'Potion Belt', alias: 'a belt of clinking vials' },
  { name: 'Dark Hooded Cloak', alias: 'a dark-hooded cloak' },
  { name: 'Robes', alias: 'plain folded robes' },
]

// Locais de conhecimento comum do mundo (nome real).
const KNOWN_LOCATIONS = [
  'Terrah',
  'Thalassia',
  'Valorian Empire',
  'Valorian Heartland',
  'Valorholm',
  'Merchant Quarter',
  'Central District',
  'Lower City',
  'Dock District',
  'Scholars Quarter',
  'Old District',
  'The Shadowy Tankard',
  "King's Market Square",
  "The Ironmongers' Alley",
  'City Watch Barracks',
  'The Rooftops',
]

// Locais conhecidos apenas por um apelido.
const ALIAS_LOCATIONS: Array<{ name: string; alias: string }> = [
  { name: 'The Arcane Library', alias: 'the scholars\u2019 archive' },
]

// NPCs por índice em newNpcs: null = oculto, 'REAL' = nome real, senão apelido.
const NPC_KNOWLEDGE: Array<string | null> = [
  'the twin-blade duelist', // enemy
  'the hooded bounty hunter', // enemy
  null, // boss (oculto)
  'the quiet card-player', // neutral
  'REAL', // ally
  null, // enemy
  null, // enemy
  'REAL', // ally
  'the herbalist\u2019s apprentice', // neutral
  null, // boss (oculto)
]

const itemIdByName = (name: string, kind?: string): string | undefined =>
  items.find((i) => i.name === name && (!kind || i.kind === kind))?.id

const locationIdByName = (name: string): string | undefined =>
  modifierTableLocations.find((l) => l.name === name)?.id

function newRule(characterId: string, extra: Partial<VisibilitySeed>): VisibilitySeed {
  return { id: crypto.randomUUID(), character_id: characterId, value: '', status: 'known', ...extra }
}

export const visibilityRules: VisibilitySeed[] = []

/* ---------- Party → Party ---------- */
for (const observerId of PARTY_IDS) {
  for (const mateId of PARTY_IDS) {
    if (mateId === observerId) continue
    const name = sheetName(mateId)
    // Identidade: nome conhecido (máscara = nome real).
    visibilityRules.push(newRule(observerId, { other_character_id: mateId, attribute: 'name', value: name }))
    // Núcleo da ficha revelado aos companheiros.
    for (const attr of ['bio', 'backstory', 'st', 'dx', 'iq', 'ht', 'hp', 'fatigue']) {
      visibilityRules.push(newRule(observerId, { other_character_id: mateId, attribute: attr, value: name }))
    }
  }
}

/* ---------- Party → NPCs ---------- */
for (const observerId of PARTY_IDS) {
  newNpcs.forEach((npc, index) => {
    const mode = NPC_KNOWLEDGE[index]
    if (!mode) return
    const npcCharId = characterNPCsIds[index] as string
    visibilityRules.push(
      newRule(observerId, {
        other_character_id: npcCharId,
        attribute: 'name',
        value: mode === 'REAL' ? sheetName(npcCharId) : mode,
      })
    )
  })
}

/* ---------- Party → Itens (conhecimento comum) ---------- */
for (const observerId of PARTY_IDS) {
  for (const kn of KNOWN_ITEMS) {
    const id = itemIdByName(kn.name, kn.kind)
    if (!id) continue
    visibilityRules.push(newRule(observerId, { item_id: id, value: kn.name }))
  }
  for (const al of ALIAS_ITEMS) {
    const id = itemIdByName(al.name)
    if (!id) continue
    visibilityRules.push(newRule(observerId, { item_id: id, value: al.alias }))
  }
}

/* ---------- Locais (lugar comum + mapas das actions) ---------- */
// Mapas de combate usados nas narrações/actions: os chars que vistam esses
// locais (e quem age neles) precisam vê-los no atlas (The Old Catacombs,
// The Forgotten Temple, ...).
const actionMapNames = new Set<string>()
for (const entry of [...modifierNarrationsActions, ...modifierNarrationsLocations]) {
  if (!entry.location_id) continue
  const loc = modifierTableLocations.find((l) => l.id === entry.location_id)
  if (loc) actionMapNames.add(loc.name)
}

const grantedLocationRules = new Set<string>()
const grantLocationRule = (charId: string, locId: string, value: string) => {
  const key = `${charId}|${locId}`
  if (grantedLocationRules.has(key)) return
  grantedLocationRules.add(key)
  visibilityRules.push(newRule(charId, { location_id: locId, value }))
}

/* ---------- Party → Locais (lugares comuns do mundo) ---------- */
for (const observerId of PARTY_IDS) {
  for (const name of KNOWN_LOCATIONS) {
    const id = locationIdByName(name)
    if (id) grantLocationRule(observerId, id, name)
  }
  for (const name of actionMapNames) {
    const id = locationIdByName(name)
    if (id) grantLocationRule(observerId, id, name)
  }
  for (const al of ALIAS_LOCATIONS) {
    const id = locationIdByName(al.name)
    if (id) grantLocationRule(observerId, id, al.alias)
  }
}

/* ---------- Party → Andares conectados (portas/escadas entre plantas) ---------- */
// Os pavimentos alcançados pelas escadas já conhecidas entram no atlas:
// alguns com nome real (specialist), outros só "de ouvir falar" (known =
// alias → o front mostra o nome mascarado até o narrador revelar).
const FLOOR_KNOWLEDGE: Array<{ id: string; value: string; status: 'known' | 'specialist' }> = [
  { id: locWatchUpperId, value: 'City Watch Barracks · Sergeants’ Floor', status: 'specialist' },
  { id: locLibraryUpperId, value: 'a chained shelf floor above the reading hall', status: 'known' },
  { id: locTankardCellarId, value: 'the smuggler hold below the tavern', status: 'known' },
]
for (const observerId of PARTY_IDS) {
  for (const loc of FLOOR_KNOWLEDGE) {
    visibilityRules.push(
      newRule(observerId, { location_id: loc.id, value: loc.value, status: loc.status })
    )
  }
}

/* ---------- Chars das actions → mapas dos combates ---------- */
// Quem executa uma action num mapa enxerga aquele mapa da própria mesa.
for (const action of modifierNarrationsActions) {
  if (!action.location_id || !action.character_id) continue
  const loc = modifierTableLocations.find((l) => l.id === action.location_id)
  if (loc) grantLocationRule(action.character_id, action.location_id, loc.name)
}

/* ---------- Party → Conexões (portas/escadas entre plantas) ---------- */
// A party conhece as passagens públicas (specialist = label real) e as
// discretas só "de ouvir falar" (known = label mascarado).
const CONNECTION_KNOWLEDGE: Array<{ id: string; value: string; status: 'known' | 'specialist' }> = [
  { id: connMarketLibraryId, value: 'Arcade doorway to the library atrium', status: 'specialist' },
  { id: connWatchUpperId, value: 'Service stairs of the City Watch', status: 'specialist' },
  { id: connLibraryUpperId, value: 'a narrow stair rising out of sight', status: 'known' },
  { id: connTankardCellarId, value: 'a trapdoor beneath the barrels', status: 'known' },
]
for (const observerId of PARTY_IDS) {
  for (const conn of CONNECTION_KNOWLEDGE) {
    visibilityRules.push(
      newRule(observerId, { connection_id: conn.id, value: conn.value, status: conn.status })
    )
  }
}