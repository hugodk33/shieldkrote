import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindAllGameTablePeculiaritiesUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any) {
    const peculiarities = await this.repo.findAllGamePeculiarites(id)
    return peculiarities
  }
}