import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'
import type { PageWindow } from '../../../domain/pagination'

export class FindAllGameTableCharactersUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(tableId: any, viewer?: any, page?: PageWindow) {
    const characters = await this.repo.findAllGameCharacters(tableId, viewer, page)
    return characters
  }
}