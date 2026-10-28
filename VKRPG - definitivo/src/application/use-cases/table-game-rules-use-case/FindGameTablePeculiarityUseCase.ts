import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameTablePeculiarityUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any) {
    const peculiarity = await this.repo.findGamePeculiarites(id)
    return peculiarity
  }
}