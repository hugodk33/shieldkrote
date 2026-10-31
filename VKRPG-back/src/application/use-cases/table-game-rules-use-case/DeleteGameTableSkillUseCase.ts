import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class DeleteGameTableSkillUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: string): Promise<any> {
    return this.repo.deleteGameTableSkill(id)
  }
}