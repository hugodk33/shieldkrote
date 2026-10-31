import type { IUserRepository } from '../../../domain/irepositories/IUserRepository'

export class FindUserByIdUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(id: string) {
    const user = await this.repo.findById(id)
    return user
  }
}
