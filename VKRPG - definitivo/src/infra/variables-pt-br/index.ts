// src/infra/variables-pt-br/index.ts
// Baril pt-BR da camada de conteúdo. Os arquivos cuja tradução caracter
// está adiada (users, gurpsDamage, equipment, dependecies, preDetermined,
// visibility, npc, modifiers) re-exportam a variante EN; conteúdo com
// tradução de nome/descrição usa os arquivos pt-BR.

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