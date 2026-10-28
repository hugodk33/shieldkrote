import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'
import type { PageWindow } from '../../../domain/pagination'

export class FindAllGameTableNPCSUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any, location?: any, page?: PageWindow) {
    const gameTableNPCS = await this.repo.findAllGameNPCS(id, location, page)
    return gameTableNPCS
  }
}
