import crypto from 'crypto'

/* =====================================================================
   gurps_damage_table : relação ST -> THR/SW (tabela de regras do GURPS)
   Fonte: GURPS 4e Basic Set (Damage Table).
   Usada pela ENGINE de combate para derivar o dano básico do personagem.
   ===================================================================== */

type SeedGurpsDamage = {
  id: string
  st: number
  thrust: string
  swing: string
}

const rows: Array<[number, string, string]> = [
  [1, '1d-6', '1d-5'], [2, '1d-6', '1d-5'], [3, '1d-5', '1d-4'], [4, '1d-5', '1d-4'],
  [5, '1d-4', '1d-4'], [6, '1d-4', '1d-4'], [7, '1d-3', '1d-4'], [8, '1d-3', '1d-2'],
  [9, '1d-2', '1d-1'], [10, '1d-2', '1d'], [11, '1d-1', '1d+1'], [12, '1d-1', '1d+2'],
  [13, '1d', '2d-1'], [14, '1d', '2d'], [15, '1d+1', '2d+1'], [16, '1d+1', '2d+2'],
  [17, '1d+2', '3d-1'], [18, '1d+2', '3d'], [19, '2d-1', '3d+1'], [20, '2d-1', '3d+2'],
  [21, '2d', '4d-1'], [22, '2d', '4d'], [23, '2d+1', '4d+1'], [24, '2d+1', '4d+2'],
  [25, '2d+2', '5d-1'], [26, '2d+2', '5d'], [27, '3d-1', '5d+1'], [28, '3d-1', '5d+2'],
  [29, '3d', '6d-1'], [30, '3d', '6d'], [31, '3d+1', '6d+1'], [32, '3d+1', '6d+2'],
  [33, '3d+2', '7d-1'], [34, '3d+2', '7d'], [35, '4d-1', '7d+1'], [36, '4d-1', '7d+2'],
  [37, '4d', '8d-1'], [38, '4d', '8d'], [39, '4d+1', '8d+1'], [40, '4d+1', '8d+2'],
  [41, '4d+2', '9d'], [42, '4d+2', '9d'], [43, '5d-1', '9d+2'], [44, '5d-1', '9d+2'],
  [45, '5d', '10d'], [46, '5d', '10d'], [47, '5d+1', '10d+1'], [48, '5d+1', '10d+2'],
  [49, '5d+2', '11d-1'], [50, '5d+2', '11d-1']
]

export const gurpsDamageTable: SeedGurpsDamage[] = rows.map(([st, thrust, swing]) => ({
  id: crypto.randomUUID(),
  st,
  thrust,
  swing
}))
