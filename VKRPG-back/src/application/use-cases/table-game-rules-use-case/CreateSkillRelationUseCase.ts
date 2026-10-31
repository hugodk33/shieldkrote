import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class CreateSkillRelationUseCase {
  constructor(private repo: IGameTableRulesRepository) {}

  async execute(kind: 'predefinition' | 'dependency', data: any) {
    return this.repo.createSkillRelation(kind, data)
  }
}