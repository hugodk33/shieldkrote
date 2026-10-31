import type { IUserRepository } from '../../../domain/irepositories/IUserRepository'
import type { INarratorRepository } from '../../../domain/irepositories/INarratorRepository'
import { User } from '../../../domain/entities/User'
import { Narrator } from '../../../domain/entities/Narrator'
import { isUserType, USER_TYPE_LABELS, UserType } from '../../../domain/types/UserType'
import crypto from 'crypto'

export class CreateUserUseCase {
  constructor(
    private repo: IUserRepository,
    private narratorRepo?: INarratorRepository
  ) {}

  async execute(data: any) {
    if (!isUserType(data.type)) {
      const known = Object.values(UserType)
        .map((v) => `${v} (${USER_TYPE_LABELS[v].en})`)
        .join(', ')
      throw new Error(`Invalid user type. Expected one of: ${known}.`)
    }

    const user = new User(
      crypto.randomUUID(),
      data.type,
      data.username,
      data.password,
      data.phone,
      data.email
    )

    await this.repo.create(user)

    // Só o narrador titular ganha registro em `narrators`, porque é ele que
    // pode ser dono de uma mesa. Narrador convidado, admin e jogador não.
    if (data.type === UserType.Narrator) {
      if (!this.narratorRepo) {
        throw new Error('Narrator repository not provided for narrator registration.')
      }

      const narrator = new Narrator(
        crypto.randomUUID(),
        user.id,
        data.name ?? user.username
      )

      await this.narratorRepo.create(narrator)
    }

    return user
  }
}
