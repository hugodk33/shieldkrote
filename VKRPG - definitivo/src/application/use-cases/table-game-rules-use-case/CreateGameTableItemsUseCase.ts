import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class CreateGameTableItemsUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(item: any): Promise<any> {
    const result = await this.repo.createGameItems(item)
    return result
  }
}