import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditSkillRelationUseCase {
  constructor(private repo: IGameTableRulesRepository) {}

  async execute(kind: 'predefinition' | 'dependency', id: string, data: any) {
    return this.repo.editSkillRelation(kind, id, data)
  }
}