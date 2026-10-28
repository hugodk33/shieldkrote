import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameTableCharacterUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any) {
    await this.repo.editGameCharacter(data)
  }
}
