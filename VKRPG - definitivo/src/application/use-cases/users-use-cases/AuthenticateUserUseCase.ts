import type { IUserRepository } from '../../../domain/irepositories/IUserRepository'
import { PublicUser } from '../../../domain/entities/User'

/**
 * Verifica usuário + senha.
 *
 * A base atual guarda a senha em texto puro (dados de seed), então a
 * comparação é direta. O retorno é sempre `PublicUser` — a senha nunca sai
 * deste caso de uso.
 */
export class AuthenticateUserUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(input: { username?: unknown; password?: unknown }): Promise<PublicUser | null> {
    const username = typeof input.username === 'string' ? input.username.trim() : ''
    const password = typeof input.password === 'string' ? input.password : ''

    if (!username || !password) return null

    const user = await this.repo.findByUsername(username)
    if (!user || user.password !== password) return null

    return new PublicUser(user.id, user.type, user.username, user.phone, user.email)
  }
}
