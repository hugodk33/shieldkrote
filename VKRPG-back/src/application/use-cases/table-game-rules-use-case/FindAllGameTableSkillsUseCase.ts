import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'
import type { PageWindow } from '../../../domain/pagination'

export class FindGameTableSkillsUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any, search?: string, type?: string, difficulty?: string, viewer?: any, page?: PageWindow) {
    const gameTableSkills = await this.repo.findAllGameTableSkills(id, search, type, difficulty, viewer, page)
    return gameTableSkills
  }
}
