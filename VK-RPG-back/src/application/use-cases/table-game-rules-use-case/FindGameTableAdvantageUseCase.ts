import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameTableAdvantageUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any) {
    const advantage = await this.repo.findGameAdvantages(id)
    return advantage
  }
}