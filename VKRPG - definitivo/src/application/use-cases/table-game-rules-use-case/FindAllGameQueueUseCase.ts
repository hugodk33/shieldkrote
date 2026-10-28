import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindAllGameQueueUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(tableId: any) {
    return await this.repo.findAllGameQueue(tableId)
  }
}
