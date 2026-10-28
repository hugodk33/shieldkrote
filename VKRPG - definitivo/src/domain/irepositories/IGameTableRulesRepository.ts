import type { PageWindow } from '../pagination'

export interface IGameTableRulesRepository {
  createGameTableSkills(skill: any): Promise<void>
  editGameTableSkills(skill: any): Promise<void>
  deleteGameTableSkill(id: any): Promise<any>
  findGameTableSkill(id: any): Promise<any>
  createSkillRelation(kind: 'predefinition' | 'dependency', data: any): Promise<any>
  editSkillRelation(kind: 'predefinition' | 'dependency', id: string, data: any): Promise<any>
  deleteSkillRelation(kind: 'predefinition' | 'dependency', id: string): Promise<any>
  findAllGameTableSkills(id: any, search?: string, type?: string, difficulty?: string, viewer?: any, page?: PageWindow): Promise<any[] | void>

  createGameAdvantages(id: any): Promise<void>
  editGameAdvantages(id: any): Promise<void>
  deleteGameAdvantage(id: any): Promise<any>
  findGameAdvantages(id: any): Promise<void>
  findAllGameAdvantages(id: any, search?: string, category?: string, viewer?: any, page?: PageWindow): Promise<any[] | void>

  createGameDisadvantages(data: any): Promise<void>
  editGameDisadvantages(data: any): Promise<void>
  deleteGameDisadvantage(id: any): Promise<any>
  findAllGameDisadvantages(id: any, search?: string, category?: string, viewer?: any, page?: PageWindow): Promise<any[] | void>
  findGameDisadvantages(id: any): Promise<void>
  
  findGameLocation(id: any, viewer?: any): Promise<any>
  findAllGameLocations(id: any, viewer?: any): Promise<any[] | void>
  /** Personagens de um usuário dentro de uma mesa (resolve o viewer do player). */
  findCharacterIdsByUserAndTable(userId: string, tableId: string): Promise<string[]>
  createGameLocation(data: any): Promise<any>
  editGameLocation(data: any): Promise<void>
  deleteGameLocation(id: any): Promise<any>
  setDefaultGameLocation(tableId: any, locationId: any): Promise<any>
  
  createGamePeculiarites(id: any): Promise<void>
  editGamePeculiarites(id: any): Promise<void>
  findGamePeculiarites(id: any): Promise<void>
  findAllGamePeculiarites(id: any): Promise<any[] | void>
  
  createGameItems(id: any): Promise<any>
  editGameItems(id: any): Promise<void>
  deleteGameItems(id: any): Promise<any>
  /** Duplica um item para outra mesa (ou para a prateleira de um local da
      mesma mesa, quando `locationId` vem preenchido). */
  duplicateGameItems(id: string, targetTableId: string, locationId?: string | null): Promise<any>
  findGameItems(id: any): Promise<void>
  findAllGameItems(id: any, search?: string, category?: string, type?: string, viewer?: any, location?: any, page?: PageWindow): Promise<any[] | void>

  createGameCharacter(data: any): Promise<any>
  editGameCharacter(id: any): Promise<void>
  deleteGameCharacter(id: any): Promise<any>
  findGameCharacter(id: any, moment?: number, viewer?: any): Promise<void>
  findGameCharacterHistory(id: any, moment?: number, limit?: number): Promise<any>
  findAllGameCharacters(id: any, viewer?: any, page?: PageWindow): Promise<any[] | void>

  editGameCharacterEquipment(data: any): Promise<any>
  deleteGameCharacterEquipment(data: any): Promise<any>
  transferGameCharacterEquipment(data: any): Promise<any>
  sellGameCharacterEquipment(data: any): Promise<any>
  grantGameItem(data: any): Promise<any>
  awardGameCharacterPoints(data: any): Promise<any>
  grantGameTraitToCharacter(data: any): Promise<any>
  removeGameTraitFromCharacter(data: any): Promise<any>
  toggleGameModifierForCharacter(data: any): Promise<any>

  createGameNPC(data: any): Promise<any>
  editGameNPC(id: any): Promise<void>
  deleteGameNPC(id: any): Promise<any>
  findGameNPC(id: any): Promise<void>
  findAllGameNPCS(id: any, location?: any, page?: PageWindow): Promise<any[] | void>
  
  createGameNPCVisibility(id: any): Promise<void>
  editGameNPCVisibility(id: any): Promise<void>
  findGameNPCVisibility(id: any): Promise<void>
  findAllGameNPCVisibility(id: any): Promise<void>

  createGameModifier(data: any): Promise<any>
  editGameModifier(data: any): Promise<void>
  findGameModifier(id: any): Promise<any>
  findAllGameModifiers(tableId: any): Promise<any>
  deleteGameModifier(id: any): Promise<any>
  applyGameSkillEffect(characterId: string, skillId: string): Promise<any[]>

  createGameVisibility(data: any): Promise<any>
  editGameVisibility(data: any): Promise<void>
  findGameVisibility(id: any): Promise<any>
  findAllGameVisibility(characterId: any): Promise<any>

  createGameQueue(data: any): Promise<any>
  editGameQueue(data: any): Promise<void>
  findGameQueue(id: any): Promise<any>
  findAllGameQueue(tableId: any): Promise<any>
  endPlayerTurn(data: any): Promise<any>

  findTableSettings(tableId: any): Promise<any>
  updateTableSettings(data: any): Promise<void>
}
