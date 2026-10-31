import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameTableNPCUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(npc: any) {
    await this.repo.editGameNPC(npc)
  }
}