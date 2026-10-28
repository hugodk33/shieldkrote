import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameTableAdvantagesUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(advantage: any) {
    await this.repo.editGameAdvantages(advantage)
  }
}