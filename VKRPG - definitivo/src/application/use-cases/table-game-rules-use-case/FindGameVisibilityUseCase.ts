import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameVisibilityUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any) {
    return await this.repo.findGameVisibility(id)
  }
}
