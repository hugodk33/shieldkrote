import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class DeleteSkillRelationUseCase {
  constructor(private repo: IGameTableRulesRepository) {}

  async execute(kind: 'predefinition' | 'dependency', id: string) {
    return this.repo.deleteSkillRelation(kind, id)
  }
}