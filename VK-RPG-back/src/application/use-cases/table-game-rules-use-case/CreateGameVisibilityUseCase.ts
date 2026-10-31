import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class CreateGameVisibilityUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any) {
    return await this.repo.createGameVisibility(data)
  }
}
