// src/infra/variables-pt-br/varLocationConnections.ts
// Conexões entre plantas da mesa PT-BR — portas/escadas/alçapões que ligam
// mapas próximos da escala real (hex ~ metros). Espelha o arquivo EN com os
// ids/constantes próprios da variante PT-BR (labels e descrições em pt-br).
import { mainGameTableId } from "./MainUUIDIds/uuidGeral"
import {
  locationId2,
  locArcaneLibraryId,
  locLibraryUpperId,
  locShadowyTankardId,
  locTankardCellarId,
  locWatchBarracksId,
  locWatchUpperId,
  connMarketLibraryId,
  connLibraryUpperId,
  connTankardCellarId,
  connWatchUpperId,
} from "./MainUUIDIds/uuidLocation"

export type SeedModifierLocationConnection = {
  id: string
  table_id: string
  kind?: string
  from_location_id: string
  to_location_id: string
  label?: string
  from_q?: number
  from_r?: number
  to_q?: number
  to_r?: number
  floor_from?: number | null
  floor_to?: number | null
  bidirectional?: number
  sort?: number
  /** Ponto cardeal de saída da passagem (N|NE|L|SE|S|SO|O|NO). */
  direction?: string
  description?: string
}

export const modifierTableLocationConnections: SeedModifierLocationConnection[] = [
  // Praça do Mercado do Rei ⇄ A Biblioteca Arcana — porta da praça para o átrio
  {
    id: connMarketLibraryId,
    table_id: mainGameTableId,
    kind: 'door',
    from_location_id: locationId2,
    to_location_id: locArcaneLibraryId,
    label: 'Porta da Biblioteca Arcana',
    from_q: 30,
    from_r: 30,
    to_q: 15,
    to_r: 15,
    floor_from: 0,
    floor_to: 0,
    bidirectional: 1,
    sort: 1,
    direction: 'L',
    description: 'Uma porta larga de carvalho entre as bancas da praça e o átrio da biblioteca.',
  },
  // A Biblioteca Arcana → Acervo Selado (andares 0 → 2) — escada em caracol
  {
    id: connLibraryUpperId,
    table_id: mainGameTableId,
    kind: 'stairs',
    from_location_id: locArcaneLibraryId,
    to_location_id: locLibraryUpperId,
    label: 'Escada para o Acervo Selado',
    from_q: 1,
    from_r: 1,
    to_q: 6,
    to_r: 6,
    floor_from: 0,
    floor_to: 2,
    bidirectional: 1,
    sort: 2,
    direction: 'N',
    description: 'Uma escada em caracol atrás das mesas de leitura, subindo para as estantes altas.',
  },
  // O Caneco Sombrio → Adega (0 → -1) — alçapão no depósito
  {
    id: connTankardCellarId,
    table_id: mainGameTableId,
    kind: 'trapdoor',
    from_location_id: locShadowyTankardId,
    to_location_id: locTankardCellarId,
    label: 'Alçapão da adega',
    from_q: 12,
    from_r: 9,
    to_q: 4,
    to_r: 6,
    floor_from: 0,
    floor_to: -1,
    bidirectional: 1,
    sort: 1,
    direction: 'S',
    description: 'Um alçapão oculto atrás dos tonéis, descendo para a adega dos contrabandistas.',
  },
  // Quartel da Guarda da Cidade → Andar dos Sargentos (0 → 1) — escada da ala de serviço
  {
    id: connWatchUpperId,
    table_id: mainGameTableId,
    kind: 'stairs',
    from_location_id: locWatchBarracksId,
    to_location_id: locWatchUpperId,
    label: 'Escada para o Andar dos Sargentos',
    from_q: 20,
    from_r: 12,
    to_q: 10,
    to_r: 6,
    floor_from: 0,
    floor_to: 1,
    bidirectional: 1,
    sort: 1,
    direction: 'NE',
    description: 'A escadaria de serviço nos fundos da sala de formação.',
  },
]