import { GameTable } from '../../domain/entities/GameTable'

export type GameTablePlayer = {
  id: string
  username: string
  email: string
  phone: string
  type: number
}

type GameTableCharacterSheet = {
  id: string
  name?: string
  bio?: string
  backstory?: string
  points?: number
  hp?: number
  current_hp?: number
  st?: number
  dx?: number
  iq?: number
  ht?: number
  fatigue?: number
  encumbrance?: string
  modifiers?: GameTableModifier[]
}

type GameTableEquipment = {
  id: string
  quantity: number
  status: string
  location: string
  renderedSt: number | null
}

type GameTableItem = {
  id: string
  name: string
  kind: string
  category: string
  weight: number
  cost: number
  description: string
  quality: string
  condition: string
  techLevel: string | null
  weaponId: string | null
  armorId: string | null
  equipment: GameTableEquipment | null
}

type GameTableAdvantage = {
  id: string
  name: string
  costPoints: number
  effect: string
}

type GameTableSkill = {
  id: string
  skillId: string
  costPoints: number
  effect: string
}

type GameTableArmor = {
  id: string
  name: string
  description: string
  type: string
  value: string
  fit: string
  itemId: string | null
}

type GameTablePeculiarity = {
  id: string
  name: string
  costPoints: number
  effect: string
}

type GameTableDisadvantage = {
  id: string
  name: string
  costPoints: number
  effect: string
}

type GameTableCharacter = {
  id: string
  userId: string
  name: string
  sheet: GameTableCharacterSheet | null
  armors: GameTableArmor[]
  equipment: GameTableEquipment[]
  items: GameTableItem[]
  advantages: GameTableAdvantage[]
  disadvantages: GameTableDisadvantage[]
  skills: GameTableSkill[]
  peculiarities: GameTablePeculiarity[]
}

export type GameTablePlayerWithCharacter = {
  userId: string
  username: string | null
  character: GameTableCharacter | null
}

export type GameTableSceneNarration = {
  id: string
  sceneId: string
  narration: string
  moment: number
  title: string
  actions: GameTableSceneAction[]
  characters?: []
  npcs?: []
  locals?:[]
}

export type GameTableScenes = {
  id: string
  title: string
  chapter?: number
  moment?: number
  imageUrl?: string | null
  narrations: GameTableSceneNarration[]
  characters?: any[]
}

export type GameTableWithScenes = {
  table: GameTable | null
  scenes: GameTableScenes[]
}

export type GameTableWithNarrator = {
  id: string
  narratorId: string
  intro: string
  title: string
  system?: string
  modules?: string[]
  narrator: {
    id: string
    userId: string
    name: string
    username: string
    email: string
    phone: string
    type: number
  }
  players: GameTablePlayerWithCharacter[]
}

type GameTableModifier = {
  id: string
  name: string
  description: string
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

type GameTableSceneAction = {
  id: string
  queue: number
  result: string
  description: string
  dice_roll: string
  character: {
    id: string
    name: string
    userId: string
    username: string
  } | null
  modifier?: GameTableModifier | null
}