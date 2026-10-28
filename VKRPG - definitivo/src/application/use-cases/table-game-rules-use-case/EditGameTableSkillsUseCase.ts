import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameTableSkillsUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(skill: any) {
    await this.repo.editGameTableSkills(skill)
  }
}