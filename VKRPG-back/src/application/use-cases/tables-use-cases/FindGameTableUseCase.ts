import { IGameTableRepository } from '../../../domain/irepositories/IGameTableRepository'

export class FindGameTableUseCase {
  constructor(private repo: IGameTableRepository) {}

  async execute(id: string) {
    const gameTable = await this.repo.findById(id)
    return gameTable
  }
}
