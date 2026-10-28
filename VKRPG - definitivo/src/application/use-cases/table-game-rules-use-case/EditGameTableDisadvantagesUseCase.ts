import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameTableDisadvantagesUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any) {
    await this.repo.editGameDisadvantages(data)
  }
}