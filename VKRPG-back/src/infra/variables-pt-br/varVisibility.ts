// src/infra/variables-pt-br/varVisibility.ts
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
   Seeds de visibilidade da mesa PT-BR.

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

   Os nomes abaixo são os nomes PT-BR dos itens/locais da própria mesa.
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
  { name: 'Espada Curta', kind: 'weapon' },
  { name: 'Adaga', kind: 'weapon' },
  { name: 'Machado de Mão', kind: 'weapon' },
  { name: 'Arco Recurvo', kind: 'weapon' },
  { name: 'Escudo Médio', kind: 'shield' },
  { name: 'Capa de Viagem', kind: 'equipment' },
  { name: 'Armadura de Couro', kind: 'armor' },
]

// Itens conhecidos apenas por um apelido (não identificados).
const ALIAS_ITEMS: Array<{ name: string; alias: string }> = [
  { name: 'Adaga Fina', alias: 'uma lâmina finamente trabalhada' },
  { name: 'Faca de Arremesso', alias: 'um par de facas equilibradas' },
  { name: 'Cajado de Mago', alias: 'um bastão arcano' },
  { name: 'Cajado Arcano', alias: 'um cajado entalhado com um brasão' },
  { name: 'Grimório', alias: 'um tomo gasto' },
  { name: 'Cristal de Foco Arcano', alias: 'um fragmento que fende o brilho' },
  { name: 'Elixir de Cura Menor', alias: 'uma destilação de flores pálidas' },
  { name: 'Kit de Gazuas', alias: 'gazuas de aço fino' },
  { name: 'Bolsas de Bomba de Fumaça', alias: 'uma bolsa que solta fumaça' },
  { name: 'Cinto de Poções', alias: 'um cinto de frascos tintilantes' },
  { name: 'Capa Escura com Capuz', alias: 'uma capa escura com capuz' },
  { name: 'Vestes', alias: 'vestes dobradas' },
]

// Locais de conhecimento comum do mundo (nome real).
const KNOWN_LOCATIONS = [
  'Terrah',
  'Thalassia',
  'Valorian Empire',
  'Valorian Heartland',
  'Valorholm',
  'Distrito dos Mercadores',
  'Distrito Central',
  'Cidade Baixa',
  'Distrito Portuário',
  'Distrito dos Estudiosos',
  'Distrito Antigo',
  'O Caneco Sombrio',
  'Praça do Mercado do Rei',
  'Beco dos Ferreiros',
  'Quartel da Guarda da Cidade',
  'Os Telhados',
]

// Locais conhecidos apenas por um apelido.
const ALIAS_LOCATIONS: Array<{ name: string; alias: string }> = [
  { name: 'A Biblioteca Arcana', alias: 'o arquivo dos estudiosos' },
]

// NPCs por índice em newNpcs: null = oculto, 'REAL' = nome real, senão apelido.
const NPC_KNOWLEDGE: Array<string | null> = [
  'o duelista de lâminas gêmeas', // enemy
  'o caçador de recompensas encapuzado', // enemy
  null, // boss (oculto)
  'o jogador de cartas quieto', // neutral
  'REAL', // ally
  null, // enemy
  null, // enemy
  'REAL', // ally
  'o aprendiz do herbalista', // neutral
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
// locais (e quem age neles) precisam vê-los no atlas (As Catacumbas Antigas,
// O Templo Esquecido, ...).
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
  { id: locWatchUpperId, value: 'Quartel da Guarda · Andar dos Sargentos', status: 'specialist' },
  { id: locLibraryUpperId, value: 'um andar de estantes acorrentadas acima do salão de leitura', status: 'known' },
  { id: locTankardCellarId, value: 'o porão dos contrabandistas abaixo da taverna', status: 'known' },
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
  { id: connMarketLibraryId, value: 'Porta do átrio da biblioteca', status: 'specialist' },
  { id: connWatchUpperId, value: 'Escada de serviço da guarda da cidade', status: 'specialist' },
  { id: connLibraryUpperId, value: 'uma escada estreita que sobe para fora de vista', status: 'known' },
  { id: connTankardCellarId, value: 'um alçapão sob os tonéis', status: 'known' },
]
for (const observerId of PARTY_IDS) {
  for (const conn of CONNECTION_KNOWLEDGE) {
    visibilityRules.push(
      newRule(observerId, { connection_id: conn.id, value: conn.value, status: conn.status })
    )
  }
}