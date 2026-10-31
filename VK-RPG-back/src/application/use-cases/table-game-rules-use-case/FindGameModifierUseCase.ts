import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameModifierUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any) {
    return await this.repo.findGameModifier(id)
  }
}
