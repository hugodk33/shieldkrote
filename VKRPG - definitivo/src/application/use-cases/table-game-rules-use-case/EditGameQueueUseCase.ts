import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameQueueUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any) {
    return await this.repo.editGameQueue(data)
  }
}
