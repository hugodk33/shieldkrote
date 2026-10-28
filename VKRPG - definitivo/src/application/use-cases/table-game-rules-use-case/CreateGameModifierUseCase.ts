import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class CreateGameModifierUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any) {
    return await this.repo.createGameModifier(data)
  }
}
