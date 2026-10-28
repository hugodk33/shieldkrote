import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'
import type { PageWindow } from '../../../domain/pagination'

export class FindGameTableItemsUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any, search?: string, category?: string, type?: string, viewer?: any, location?: any, page?: PageWindow) {
    const gameTableItems = await this.repo.findAllGameItems(id, search, category, type, viewer, location, page)
    return gameTableItems
  }
}
