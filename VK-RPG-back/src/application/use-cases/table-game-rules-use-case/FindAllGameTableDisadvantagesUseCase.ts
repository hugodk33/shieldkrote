import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'
import type { PageWindow } from '../../../domain/pagination'

export class FindGameTableDisadvantagesUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any, search?: string, category?: string, viewer?: any, page?: PageWindow) {
    const disadvantages = await this.repo.findAllGameDisadvantages(id, search, category, viewer, page)
    return disadvantages
  }
}
