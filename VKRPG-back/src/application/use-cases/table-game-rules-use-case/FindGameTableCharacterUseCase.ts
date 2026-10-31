import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class FindGameTableCharacterUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: any, moment?: number, viewer?: any) {
    const character = await this.repo.findGameCharacter(id, moment, viewer)
    return character
  }
}
