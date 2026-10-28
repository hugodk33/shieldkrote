import type { IUserRepository } from '../../../domain/irepositories/IUserRepository'

export class FindAllUsersUseCase {
  constructor(private repo: IUserRepository) {}

  async execute() {
    const users = await this.repo.findAll()
    return users
  }
}
