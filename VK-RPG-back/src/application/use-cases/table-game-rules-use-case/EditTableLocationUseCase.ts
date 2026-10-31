import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditTableLocationUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any): Promise<void> {
    await this.repo.editGameLocation(data)
  }
}