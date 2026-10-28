import type { IGameTableRepository } from '../../../domain/irepositories/IGameTableRepository'

export class FindAllGameTablesUseCase {
  constructor(private repo: IGameTableRepository) {}

  async execute() {
    const gameTables = await this.repo.findAll()
    return gameTables
  }
}
