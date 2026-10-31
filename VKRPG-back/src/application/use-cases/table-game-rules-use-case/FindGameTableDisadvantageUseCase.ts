import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameTableDisadvantageUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any) {
    const disadvantage = await this.repo.findGameDisadvantages(id)
    return disadvantage
  }
}
