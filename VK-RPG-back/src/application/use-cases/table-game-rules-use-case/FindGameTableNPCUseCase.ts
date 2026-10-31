import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameTableNPCUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any) {
    const npc = await this.repo.findGameNPC(id)
    return npc
  }
}