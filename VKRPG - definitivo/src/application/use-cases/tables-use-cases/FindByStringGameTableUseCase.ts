import type { IUserRepository } from '../../../domain/irepositories/IUserRepository'

export class FindByStringUserUseCase {
  constructor(
    private repo: IUserRepository,
  ) { }

  async execute(data: any) {
    const user = await this.repo.findByString(data.searchTerm)
    if (!user) {
      console.log('User not found.')
    }
    return user
  }
}
