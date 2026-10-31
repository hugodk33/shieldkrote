import { IGameTableRepository } from '../../../domain/irepositories/IGameTableRepository'
import { GameTable } from '../../../domain/entities/GameTable'

export class EditGameTableUseCase {
  constructor(private repo: IGameTableRepository) {}

  async execute(gameTable: GameTable) {
    await this.repo.edit(gameTable)  
  }
}
