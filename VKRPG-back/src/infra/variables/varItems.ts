import { mainGameTableId } from "./MainUUIDIds/uuidGeral"
import * as itemsIds from "./MainUUIDIds/uuidItems"

/* =====================================================================
   SEED ITEMS (novo modelo GURPS)
   ----------------------------------------------------------------
   NÃO guardamos dano final de arma. A arma guarda PARÂMETROS:
     damage_source  -> como o dano é derivado (st_swing/st_thrust/fixed/...)
     damage_modifier-> inteiro somado à base (ex: SW+1 -> +1)
     damage_dice    -> só p/ dano fixo (ex: '2d')
     damage_type    -> tipo de dano GURPS (cut/imp/cr/pi/...)
   A engine combina com ST/THR/SW do personagem via gurps_damage_table.

   tech_level = Nível Tecnológico GURPS da peça ('TL0'..'TL9'), exibido
   no front ao lado dos demais dados do item.
   ===================================================================== */

type SeedItem = {
  id: string
  table_id: string
  name: string
  kind: string
  category: string
  weight_lb: number
  cost: number
  dimensions: string
  description: string
  quality: string
  condition: string
  tech_level?: string
}

type SeedWeapon = {
  id: string
  item_id: string
  skill: string
  min_st: number | null
  rated_st: number | null
  handedness: number
  reach: string
  parry: string
  block: string | null
  fit: string
}

type SeedAttack = {
  id: string
  weapon_id: string
  name: string
  usage: string | null
  damage_source: string
  damage_modifier: number
  damage_dice: string | null
  damage_type: string
  armor_penetration: number
  accuracy: number | null
  range: string
  recoil: number | null
  shots: number | null
}

type SeedArmor = {
  id: string
  item_id: string
  dr: number
  flex: number
  locations: string
  fit: string
}

export const items: SeedItem[] = [
  {
    id: itemsIds.shortSwordId, table_id: mainGameTableId, name: 'Shortsword',
    kind: 'weapon', category: 'Melee', weight_lb: 3, cost: 400,
    dimensions: '90cm', description: 'A balanced steel shortsword for fast close combat.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.handAxeId, table_id: mainGameTableId, name: 'Hand Axe',
    kind: 'weapon', category: 'Melee', weight_lb: 2, cost: 40,
    dimensions: '45cm', description: 'A versatile one-handed axe.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.daggerId, table_id: mainGameTableId, name: 'Dagger',
    kind: 'weapon', category: 'Melee', weight_lb: 1, cost: 20,
    dimensions: '25cm', description: 'A small blade for fast close combat and throwing.',
    quality: 'fine', condition: 'new', tech_level: 'TL1'
  },
  {
    id: itemsIds.fineDaggerId, table_id: mainGameTableId, name: 'Fine Dagger',
    kind: 'weapon', category: 'Melee', weight_lb: 1, cost: 80,
    dimensions: '25cm', description: 'A razor-sharp dagger balanced for precise strikes.',
    quality: 'very_fine', condition: 'new', tech_level: 'TL1'
  },
  {
    id: itemsIds.throwingKnifeId, table_id: mainGameTableId, name: 'Throwing Knife',
    kind: 'weapon', category: 'Ranged', weight_lb: 0.5, cost: 15,
    dimensions: '20cm', description: 'A lightweight knife designed for throwing accuracy.',
    quality: 'fine', condition: 'new', tech_level: 'TL1'
  },
  {
    id: itemsIds.mediumShieldId, table_id: mainGameTableId, name: 'Medium Shield',
    kind: 'shield', category: 'Shield', weight_lb: 15, cost: 60,
    dimensions: '90cm', description: 'A wooden shield reinforced with metal bands.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.pistolId, table_id: mainGameTableId, name: 'Pistol (.45)',
    kind: 'weapon', category: 'Ranged', weight_lb: 2.4, cost: 600,
    dimensions: '22cm', description: 'A heavy pistol firing .45 ACP.',
    quality: 'standard', condition: 'new', tech_level: 'TL7'
  },
  {
    id: itemsIds.recurveBowId, table_id: mainGameTableId, name: 'Recurve Bow',
    kind: 'weapon', category: 'Ranged', weight_lb: 4, cost: 225,
    dimensions: '1.2m', description: 'A recurved bow with excellent range for an archer.',
    quality: 'fine', condition: 'new', tech_level: 'TL2'
  },
  {
    id: itemsIds.wizardStaffId, table_id: mainGameTableId, name: 'Wizard Staff',
    kind: 'weapon', category: 'Melee', weight_lb: 4, cost: 7,
    dimensions: '1.8m', description: 'A finely crafted wooden staff imbued with latent magical energy.',
    quality: 'fine', condition: 'worn', tech_level: 'TL3'
  },
  {
    id: itemsIds.leatherArmorId, table_id: mainGameTableId, name: 'Leather Armor',
    kind: 'armor', category: 'Armor', weight_lb: 15, cost: 100,
    dimensions: 'Torso', description: 'Light leather armor that protects without limiting movement.',
    quality: 'standard', condition: 'worn', tech_level: 'TL1'
  },
  {
    id: itemsIds.galhornLeatherArmorId, table_id: mainGameTableId, name: 'Leather Armor',
    kind: 'armor', category: 'Armor', weight_lb: 18, cost: 120,
    dimensions: 'Torso', description: 'Sturdy leather armor offering moderate protection.',
    quality: 'fine', condition: 'good', tech_level: 'TL1'
  },
  {
    id: itemsIds.leatherBracersId, table_id: mainGameTableId, name: 'Leather Bracers',
    kind: 'armor', category: 'Armor', weight_lb: 2, cost: 30,
    dimensions: 'Arms', description: 'Leather forearm guards for added protection.',
    quality: 'fine', condition: 'good', tech_level: 'TL1'
  },
  {
    id: itemsIds.leatherBootsId, table_id: mainGameTableId, name: 'Leather Boots',
    kind: 'armor', category: 'Armor', weight_lb: 3, cost: 40,
    dimensions: 'Legs', description: 'Sturdy leather boots that protect the feet and lower legs.',
    quality: 'fine', condition: 'good', tech_level: 'TL1'
  },
  {
    id: itemsIds.kaelLeatherArmorId, table_id: mainGameTableId, name: 'Leather Armor',
    kind: 'armor', category: 'Armor', weight_lb: 12, cost: 100,
    dimensions: 'Torso', description: 'Light leather armor optimized for stealth and mobility.',
    quality: 'fine', condition: 'good', tech_level: 'TL1'
  },
  {
    id: itemsIds.robesId, table_id: mainGameTableId, name: 'Robes',
    kind: 'armor', category: 'Clothing', weight_lb: 6, cost: 30,
    dimensions: 'Full Body', description: 'Simple but durable wizard robes enchanted for comfort.',
    quality: 'standard', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.spellbookId, table_id: mainGameTableId, name: 'Spellbook',
    kind: 'equipment', category: 'Equipment', weight_lb: 3, cost: 400,
    dimensions: '30cm', description: 'A leather-bound tome containing arcane rituals and notes.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.potionBeltId, table_id: mainGameTableId, name: 'Potion Belt',
    kind: 'equipment', category: 'Equipment', weight_lb: 2, cost: 25,
    dimensions: 'Waist', description: 'A belt with small pouches for carrying potions and reagents.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.lockpickSetId, table_id: mainGameTableId, name: 'Lockpick Set',
    kind: 'equipment', category: 'Equipment', weight_lb: 0.5, cost: 50,
    dimensions: '10cm', description: 'A professional set of lockpicks for opening locks.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.darkHoodedCloakId, table_id: mainGameTableId, name: 'Dark Hooded Cloak',
    kind: 'equipment', category: 'Clothing', weight_lb: 2, cost: 50,
    dimensions: 'Full body', description: 'A dark, hooded cloak that helps blend into shadows.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.travelCloakId, table_id: mainGameTableId, name: 'Travel Cloak',
    kind: 'equipment', category: 'Clothing', weight_lb: 2, cost: 15,
    dimensions: 'Shoulders', description: 'A simple travel cloak for weather protection.',
    quality: 'standard', condition: 'good', tech_level: 'TL2'
  },
  // ---- Mage items (Lyra & Kael) ----
  {
    id: itemsIds.arcanistStaffId, table_id: mainGameTableId, name: 'Arcanist Staff',
    kind: 'weapon', category: 'Melee', weight_lb: 4, cost: 60,
    dimensions: '1.8m', description: 'A staff carved from elderwood, humming with stored arcane charge.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.arcaneDaggerId, table_id: mainGameTableId, name: 'Arcane Dagger',
    kind: 'weapon', category: 'Melee', weight_lb: 0.75, cost: 300,
    dimensions: '28cm', description: 'A dagger engraved with runes that flare as the wielder channels magic.',
    quality: 'very_fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.arcaneFocusCrystalId, table_id: mainGameTableId, name: 'Arcane Focus Crystal',
    kind: 'equipment', category: 'Equipment', weight_lb: 0.25, cost: 200,
    dimensions: '5cm', description: 'A fist-sized crystal that anchors spellcasting and glows faintly in the presence of magic.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.elixirMinorHealingId, table_id: mainGameTableId, name: 'Elixir of Minor Healing',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.5, cost: 120,
    dimensions: '12cm', description: 'A glowing red elixir that soothes wounds and restores spent energy.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.shadowAmuletId, table_id: mainGameTableId, name: 'Shadow Amulet',
    kind: 'equipment', category: 'Clothing', weight_lb: 0.2, cost: 150,
    dimensions: 'Neck', description: 'A smoky amulet that muffles steps and hides the bearer\'s magical presence.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.smokeBombPouchId, table_id: mainGameTableId, name: 'Smoke Bomb Pouch',
    kind: 'equipment', category: 'Equipment', weight_lb: 1, cost: 60,
    dimensions: 'Waist', description: 'A pouch full of small pellets that burst into concealing smoke.',
    quality: 'standard', condition: 'good', tech_level: 'TL3'
  }
]

export const weapons: SeedWeapon[] = [
  {
    id: itemsIds.shortSwordWeaponId, item_id: itemsIds.shortSwordId,
    skill: 'Shortsword', min_st: 7, rated_st: null, handedness: 1,
    reach: '1', parry: '0', block: null, fit: 'tailored'
  },
  {
    id: itemsIds.handAxeWeaponId, item_id: itemsIds.handAxeId,
    skill: 'Axe', min_st: 11, rated_st: null, handedness: 1,
    reach: '1', parry: '0U', block: null, fit: 'normal'
  },
  {
    id: itemsIds.daggerWeaponId, item_id: itemsIds.daggerId,
    skill: 'Knife', min_st: 5, rated_st: null, handedness: 1,
    reach: 'C', parry: '-1', block: null, fit: 'normal'
  },
  {
    id: itemsIds.mediumShieldWeaponId, item_id: itemsIds.mediumShieldId,
    skill: 'Shield', min_st: null, rated_st: null, handedness: 1,
    reach: 'C', parry: 'No', block: '3', fit: 'normal'
  },
  {
    id: itemsIds.pistolWeaponId, item_id: itemsIds.pistolId,
    skill: 'Guns (Pistol)', min_st: null, rated_st: null, handedness: 1,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.recurveBowWeaponId, item_id: itemsIds.recurveBowId,
    skill: 'Bow', min_st: 7, rated_st: 10, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'tailored'
  },
  {
    id: itemsIds.wizardStaffWeaponId, item_id: itemsIds.wizardStaffId,
    skill: 'Staff', min_st: 5, rated_st: null, handedness: 2,
    reach: 'C,1', parry: '2', block: null, fit: 'normal'
  },
  {
    id: itemsIds.arcanistStaffWeaponId, item_id: itemsIds.arcanistStaffId,
    skill: 'Staff', min_st: 6, rated_st: null, handedness: 2,
    reach: 'C,1', parry: '2', block: null, fit: 'tailored'
  },
  {
    id: itemsIds.arcaneDaggerWeaponId, item_id: itemsIds.arcaneDaggerId,
    skill: 'Knife', min_st: 5, rated_st: null, handedness: 1,
    reach: 'C', parry: '0', block: null, fit: 'normal'
  }
]

export const weaponAttacks: SeedAttack[] = [
  // Espada: Swing SW+1 CUT | Thrust THR IMP
  {
    id: itemsIds.shortSwordSwingId, weapon_id: itemsIds.shortSwordWeaponId,
    name: 'Swing', usage: null, damage_source: 'st_swing', damage_modifier: 1,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  {
    id: itemsIds.shortSwordThrustId, weapon_id: itemsIds.shortSwordWeaponId,
    name: 'Thrust', usage: null, damage_source: 'st_thrust', damage_modifier: 0,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  // Machado: Swing SW+2 CUT | Thrust THR-1 IMP
  {
    id: itemsIds.handAxeSwingId, weapon_id: itemsIds.handAxeWeaponId,
    name: 'Swing', usage: null, damage_source: 'st_swing', damage_modifier: 2,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  {
    id: itemsIds.handAxeThrustId, weapon_id: itemsIds.handAxeWeaponId,
    name: 'Thrust', usage: null, damage_source: 'st_thrust', damage_modifier: -1,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  // Faca: Swing SW-3 CUT | Thrust THR IMP
  {
    id: itemsIds.daggerSwingId, weapon_id: itemsIds.daggerWeaponId,
    name: 'Swing', usage: null, damage_source: 'st_swing', damage_modifier: -3,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.daggerThrustId, weapon_id: itemsIds.daggerWeaponId,
    name: 'Thrust', usage: null, damage_source: 'st_thrust', damage_modifier: 0,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  // Escudo: Bash base SW-2 CUT (apenas exemplo)
  {
    id: itemsIds.mediumShieldBashId, weapon_id: itemsIds.mediumShieldWeaponId,
    name: 'Shield Bash', usage: null, damage_source: 'st_swing', damage_modifier: -2,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  // Pistola: dano fixo 2d+1 PI
  {
    id: itemsIds.pistolShotId, weapon_id: itemsIds.pistolWeaponId,
    name: 'Shot', usage: null, damage_source: 'fixed', damage_modifier: 1,
    damage_dice: '2d', damage_type: 'pi', armor_penetration: 0,
    accuracy: 2, range: '150/1600', recoil: 3, shots: 7
  },
  // Arco: baseado no Rated ST (THR @ rated_st) IMP
  {
    id: itemsIds.recurveBowShotId, weapon_id: itemsIds.recurveBowWeaponId,
    name: 'Shot', usage: null, damage_source: 'rated_st_thrust', damage_modifier: 0,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: 2, range: '150/200', recoil: null, shots: 1
  },
  // Cajado: Swing SW+1 CR | Thrust THR+1 CR
  {
    id: itemsIds.wizardStaffSwingId, weapon_id: itemsIds.wizardStaffWeaponId,
    name: 'Swing', usage: null, damage_source: 'st_swing', damage_modifier: 1,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C,1', recoil: null, shots: null
  },
  {
    id: itemsIds.wizardStaffThrustId, weapon_id: itemsIds.wizardStaffWeaponId,
    name: 'Thrust', usage: null, damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  // Cajado do Arcanista: Swing SW+2 CR | Thrust THR+1 CR
  {
    id: itemsIds.arcanistStaffSwingId, weapon_id: itemsIds.arcanistStaffWeaponId,
    name: 'Swing', usage: null, damage_source: 'st_swing', damage_modifier: 2,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C,1', recoil: null, shots: null
  },
  {
    id: itemsIds.arcanistStaffThrustId, weapon_id: itemsIds.arcanistStaffWeaponId,
    name: 'Thrust', usage: null, damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  // Adaga Arcana: Swing SW-3 CUT | Thrust THR+1 IMP
  {
    id: itemsIds.arcaneDaggerSwingId, weapon_id: itemsIds.arcaneDaggerWeaponId,
    name: 'Swing', usage: null, damage_source: 'st_swing', damage_modifier: -3,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.arcaneDaggerThrustId, weapon_id: itemsIds.arcaneDaggerWeaponId,
    name: 'Thrust', usage: null, damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  }
]

export const armors: SeedArmor[] = [
  { id: itemsIds.leatherArmorDefId, item_id: itemsIds.leatherArmorId, dr: 2, flex: 0, locations: 'torso', fit: 'normal' },
  { id: itemsIds.galhornLeatherArmorDefId, item_id: itemsIds.galhornLeatherArmorId, dr: 2, flex: 0, locations: 'torso', fit: 'tailored' },
  { id: itemsIds.leatherBracersDefId, item_id: itemsIds.leatherBracersId, dr: 2, flex: 0, locations: 'arms', fit: 'normal' },
  { id: itemsIds.leatherBootsDefId, item_id: itemsIds.leatherBootsId, dr: 2, flex: 0, locations: 'legs,feet', fit: 'normal' },
  { id: itemsIds.kaelLeatherArmorDefId, item_id: itemsIds.kaelLeatherArmorId, dr: 2, flex: 0, locations: 'torso', fit: 'tailored' },
  { id: itemsIds.robesDefId, item_id: itemsIds.robesId, dr: 0, flex: 1, locations: 'full_body', fit: 'loose' },
  { id: itemsIds.mediumShieldDefId, item_id: itemsIds.mediumShieldId, dr: 6, flex: 0, locations: 'arm', fit: 'normal' }
]
