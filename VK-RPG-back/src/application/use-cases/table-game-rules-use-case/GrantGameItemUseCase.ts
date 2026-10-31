import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class GrantGameItemUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any): Promise<any> {
    return this.repo.grantGameItem(data)
  }
}