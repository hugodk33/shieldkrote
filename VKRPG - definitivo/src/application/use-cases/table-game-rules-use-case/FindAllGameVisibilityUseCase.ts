import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindAllGameVisibilityUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(characterId: any) {
    return await this.repo.findAllGameVisibility(characterId)
  }
}
