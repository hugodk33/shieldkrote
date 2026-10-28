import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class DeleteGameTableDisadvantageUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: string): Promise<any> {
    return this.repo.deleteGameDisadvantage(id)
  }
}