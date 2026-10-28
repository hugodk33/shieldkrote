import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class CreateGameTablePeculiaritiesUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(peculiarity: any) {
    await this.repo.createGamePeculiarites(peculiarity)
  }
}