// src/infra/variables/varLocationConnections.ts
// Conexões entre plantas da mesa EN — portas/escadas/alçapões que ligam
// mapas próximos da escala real (hex ~ metros). Cada conexão aponta de UM
// hex da planta de origem (from_q/r) para UM hex da planta de destino
// (to_q/r); o front desenha um marcador em cada ponta e navega para o
// local parceiro ao clicar. floor_from/floor_to registram o andar de cada
// ponta (0 = térreo, -1 = subsolo, 2 = segundo pavimento...).
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
  // King's Market Square ⇄ The Arcane Library — porta da praça para o átrio
  {
    id: connMarketLibraryId,
    table_id: mainGameTableId,
    kind: 'door',
    from_location_id: locationId2,
    to_location_id: locArcaneLibraryId,
    label: 'Arcane Library doorstep',
    from_q: 30,
    from_r: 30,
    to_q: 15,
    to_r: 15,
    floor_from: 0,
    floor_to: 0,
    bidirectional: 1,
    sort: 1,
    direction: 'L',
    description: 'A wide oak door thrown open between the market stalls and the library atrium.',
  },
  // The Arcane Library → Sealed Stack (andares 0 → 2) — escada em caracol
  {
    id: connLibraryUpperId,
    table_id: mainGameTableId,
    kind: 'stairs',
    from_location_id: locArcaneLibraryId,
    to_location_id: locLibraryUpperId,
    label: 'Stairs to the Sealed Stack',
    from_q: 1,
    from_r: 1,
    to_q: 6,
    to_r: 6,
    floor_from: 0,
    floor_to: 2,
    bidirectional: 1,
    sort: 2,
    direction: 'N',
    description: 'A narrow spiral staircase behind the reading desks, rising into the upper shelves.',
  },
  // The Shadowy Tankard → Cellar (0 → -1) — alçapão no depósito
  {
    id: connTankardCellarId,
    table_id: mainGameTableId,
    kind: 'trapdoor',
    from_location_id: locShadowyTankardId,
    to_location_id: locTankardCellarId,
    label: 'Cellar trapdoor',
    from_q: 12,
    from_r: 9,
    to_q: 4,
    to_r: 6,
    floor_from: 0,
    floor_to: -1,
    bidirectional: 1,
    sort: 1,
    direction: 'S',
    description: 'A hidden trapdoor behind the barrels, dropping into the smuggler cellar.',
  },
  // City Watch Barracks → Sergeants Floor (0 → 1) — escada da ala de serviço
  {
    id: connWatchUpperId,
    table_id: mainGameTableId,
    kind: 'stairs',
    from_location_id: locWatchBarracksId,
    to_location_id: locWatchUpperId,
    label: 'Stairs to the Sergeants’ Floor',
    from_q: 20,
    from_r: 12,
    to_q: 10,
    to_r: 6,
    floor_from: 0,
    floor_to: 1,
    bidirectional: 1,
    sort: 1,
    direction: 'NO',
    description: 'The service stairwell at the back of the muster hall.',
  },
]