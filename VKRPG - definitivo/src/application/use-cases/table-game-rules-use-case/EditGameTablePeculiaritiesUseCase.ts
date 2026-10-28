import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameTablePeculiaritiesUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(peculiarity: any) {
    await this.repo.editGamePeculiarites(peculiarity)
  }
}