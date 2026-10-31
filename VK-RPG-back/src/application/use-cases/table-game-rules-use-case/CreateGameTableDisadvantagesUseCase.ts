import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class CreateGameTableDisadvantagesUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any) {
    await this.repo.createGameDisadvantages(data)
  }
}