import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameModifierUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any) {
    return await this.repo.editGameModifier(data)
  }
}
