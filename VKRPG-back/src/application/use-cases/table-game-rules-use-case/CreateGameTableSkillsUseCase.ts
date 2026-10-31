import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class CreateGameTableSkillsUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(skill: any) {
    await this.repo.createGameTableSkills(skill)
  }
}