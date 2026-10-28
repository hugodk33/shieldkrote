import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameQueueUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any) {
    return await this.repo.findGameQueue(id)
  }
}
