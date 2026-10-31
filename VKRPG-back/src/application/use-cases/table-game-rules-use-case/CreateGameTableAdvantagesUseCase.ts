import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class CreateGameTableAdvantagesUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(advantage: any) {
    await this.repo.createGameAdvantages(advantage)
  }
}