import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'
import type { PageWindow } from '../../../domain/pagination'

export class FindGameTableAdvantagesUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any, search?: string, category?: string, viewer?: any, page?: PageWindow) {
    const gameTableAdvantages = await this.repo.findAllGameAdvantages(id, search, category, viewer, page)
    return gameTableAdvantages
  }
}
