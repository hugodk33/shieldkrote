import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class DeleteGameTableCharacterUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(id: string): Promise<any> {
    return this.repo.deleteGameCharacter(id)
  }
}