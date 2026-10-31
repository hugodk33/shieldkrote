import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class DeleteGameModifierUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: string): Promise<any> {
    return this.repo.deleteGameModifier(id)
  }
}