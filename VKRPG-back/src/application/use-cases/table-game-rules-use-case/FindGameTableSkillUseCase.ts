import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameTableSkillUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: string) {
    const gameTableSkills = await this.repo.findGameTableSkill(id)
    return gameTableSkills
  }
}
