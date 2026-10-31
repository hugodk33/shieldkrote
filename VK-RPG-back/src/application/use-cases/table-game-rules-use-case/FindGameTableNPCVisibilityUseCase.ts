import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameTableNPCVisibilityUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any) {
    const visibility = await this.repo.findGameNPCVisibility(id)
    return visibility
  }
}