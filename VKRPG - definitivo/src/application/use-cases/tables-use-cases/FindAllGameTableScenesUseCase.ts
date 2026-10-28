import type { IGameTableRepository } from '../../../domain/irepositories/IGameTableRepository'

export class FindAllGameTableScenesUseCase {
  constructor(private repo: IGameTableRepository) {}

  async execute(id: string) {
    const users = await this.repo.findByAllScenes(id)
    return users
  }
}
