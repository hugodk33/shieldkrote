import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class SetDefaultGameLocationUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(tableId: any, locationId: any): Promise<any> {
    return await this.repo.setDefaultGameLocation(tableId, locationId)
  }
}