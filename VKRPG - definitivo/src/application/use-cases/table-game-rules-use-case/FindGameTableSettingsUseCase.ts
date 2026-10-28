import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameTableSettingsUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(tableId: any): Promise<any> {
    return this.repo.findTableSettings(tableId)
  }
}