import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameTableItemsUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(item: any) {
    await this.repo.editGameItems(item)
  }
}