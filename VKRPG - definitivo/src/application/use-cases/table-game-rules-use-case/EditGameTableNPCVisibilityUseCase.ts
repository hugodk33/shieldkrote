import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameTableNPCVisibilityUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(visibility: any) {
    await this.repo.editGameNPCVisibility(visibility)
  }
}