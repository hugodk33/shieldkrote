import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameTableSettingsUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any): Promise<void> {
    await this.repo.updateTableSettings(data)
  }
}