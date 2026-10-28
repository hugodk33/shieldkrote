import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class DeleteGameTableItemUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: string): Promise<any> {
    return this.repo.deleteGameItems(id)
  }
}