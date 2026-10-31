// src/infra/variables/index.ts
// Baril EN da camada de conteúdo. Mesma interface do baril pt-BR; a troca de
// variante é feita pelo seed via VKRPG_LOCALE.

export { narrators, gameTables, gameTablePlayers } from './varGameTable'
export {
  modifierNarrationsActions,
  modifierNarrationsLocations,
  modifierNarrationsCharacters,
  modifierNarrationsNPCs,
  modifierSeedEntries
} from './varModifiers'
export { skills } from './varSkills'
export { items, weapons, weaponAttacks, armors } from './varItems'
export { gurpsDamageTable } from './varGurpsDamage'
export { characterEquipment } from './varEquipment'
export { advantages } from './varAdvantages'
export { disadvantages } from './varDisadvantage'
export { users } from './varUsers'
export {
  characters,
  characterSheets,
  characterSkills,
  characterAdvantages,
  characterDisadvantages
} from './varCharacters'
export { newNpcs } from './varNPC'
export { peculiarities } from './varPeculiarites'
export { scenes } from './varScenes'
export { narrations } from './varNarrations'
export { modifierTableLocations } from './varLocations'
export { modifierTableLocationConnections } from './varLocationConnections'
export { modifierGameTableSkillsPreDetermined } from './varPreDetermined'
export { modifierGameTableSkillsDependecies } from './varDependecies'
export { visibilityRules } from './varVisibility'
export {
  contentModules,
  contentCategories,
  skillTag,
  advantageTagBy,
  disadvantageTagBy,
  itemTagBy,
  npcTagBy
} from './varContentModules'