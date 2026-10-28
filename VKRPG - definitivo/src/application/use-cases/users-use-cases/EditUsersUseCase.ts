import type { IUserRepository } from '../../../domain/irepositories/IUserRepository'
import { User } from '../../../domain/entities/User'
import { isUserType, USER_TYPE_LABELS, UserType } from '../../../domain/types/UserType'

export class EditUsersUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(user: User) {
    // O `type` vinha passando sem validação nenhuma; agora ele só aceita os
    // tipos conhecidos, para ninguém gravar um valor solto no banco.
    if (user.type !== undefined && user.type !== null && !isUserType(user.type)) {
      const known = Object.values(UserType)
        .map((v) => `${v} (${USER_TYPE_LABELS[v].en})`)
        .join(', ')
      throw new Error(`Invalid user type. Expected one of: ${known}.`)
    }

    await this.repo.editUser(user)
  }
}
