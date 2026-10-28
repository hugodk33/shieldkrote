export interface GURPSCharacterSheet {
  id: string
  name: string
  bio: string | null
  backstory: string | null
  points: number
  hp: number
  st: number
  dx: number
  iq: number
  ht: number
  fatigue: number
  encumbrance: string | null
  basic_speed: number
  move: number
  base_hp: number
  base_st: number
  base_dx: number
  base_iq: number
  base_ht: number
  base_fatigue: number
}

export interface GURPSCharacterUser {
  id: string
  username: string | null
  email: string | null
  phone: string | null
  type: string | null
}

export interface GURPSTableRef {
  id: string
  title: string | null
  intro: string | null
  system: string | null
}

export interface GURPSModifier {
  id: string
  name: string
  description: string | null
  hp?: number | null
  st?: number | null
  dx?: number | null
  iq?: number | null
  ht?: number | null
  fatigue?: number | null
  mod_hp?: number | null
  mod_st?: number | null
  mod_dx?: number | null
  mod_iq?: number | null
  mod_ht?: number | null
  mod_fatigue?: number | null
  damage_value?: string | null
  skill_value?: string | null
  item_quantity?: number | null
  item_weight?: number | null
}

export class GURPSCharacter {
  constructor(
    public id: string,
    public name: string,
    public user: GURPSCharacterUser | null,
    public sheet: GURPSCharacterSheet | null,
    public advantages: string[],
    public disadvantages: string[],
    public skills: string[],
    public armors: any[],
    public items: any[],
    public damages: any[],
    public modifiers: GURPSModifier[],
  ) {}
}
