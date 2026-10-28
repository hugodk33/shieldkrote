import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class CreateGameTableCharacterUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any) {
    return await this.repo.createGameCharacter(data)
  }
}
