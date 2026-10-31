import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameTableCharacterHistoryUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any, moment?: number, limit?: number) {
    const history = await this.repo.findGameCharacterHistory(id, moment, limit)
    return history
  }
}