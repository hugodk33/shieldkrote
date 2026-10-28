import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class CreateGameTableNPCVisibilityUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(visibility: any) {
    await this.repo.createGameNPCVisibility(visibility)
  }
}