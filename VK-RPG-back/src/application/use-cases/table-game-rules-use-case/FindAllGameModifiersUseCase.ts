import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindAllGameModifiersUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(tableId: any) {
    return await this.repo.findAllGameModifiers(tableId)
  }
}
