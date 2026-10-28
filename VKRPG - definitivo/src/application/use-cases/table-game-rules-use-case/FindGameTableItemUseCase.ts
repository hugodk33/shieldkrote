import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameTableItemUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any) {
    const item = await this.repo.findGameItems(id)
    return item
  }
}