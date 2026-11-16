import type { IGameTableRepository } from '../../../domain/irepositories/IGameTableRepository'
import type { IUserRepository } from '../../../domain/irepositories/IUserRepository'
import type { INarratorRepository } from '../../../domain/irepositories/INarratorRepository'
import crypto from 'crypto'
import { GameTable } from '../../../domain/entities/GameTable'
import { Narrator } from '../../../domain/entities/Narrator'
import { isTableOwner } from '../../../domain/types/UserType'
import { ContentCatalogRepository, type ContentSelection } from '../../../domain/repositories/ContentCatalogRepository'

class CreateTableError extends Error {
  constructor(message: string, public status = 400) {
    super(message)
  }
}

export class CreateGameTableUseCase {
  constructor(
    private repo: IGameTableRepository,
    private users: IUserRepository,
    private narrators: INarratorRepository,
    private contentCatalog?: ContentCatalogRepository
  ) {}

  /**
   * A mesa pertence a um registro de `narrators`, não diretamente ao usuário.
   * Quem cria a mesa chega como `actorId` (o usuário logado); aqui o vínculo é
   * resolvido — e criado se ainda não existir, para que um usuário cadastrado
   * direto no banco não precise ganhar a linha de narrador na mão.
   */
  private async resolveNarratorId(data: any): Promise<string> {
    const actorId = String(data.actorId ?? data.actor ?? '').trim()

    if (actorId) {
      const user = await this.users.findById(actorId)

      if (!user) {
        throw new CreateTableError('Sessão inválida: usuário não encontrado.', 401)
      }

      if (!isTableOwner(user.type)) {
        throw new CreateTableError('Apenas narradores podem criar mesas.', 403)
      }

      const existing = await this.narrators.findByUserId(user.id)
      if (existing) return existing.id

      const narrator = new Narrator(
        crypto.randomUUID(),
        user.id,
        user.username || user.email || 'Narrador'
      )
      await this.narrators.create(narrator)
      return narrator.id
    }

    /* Compatibilidade com clientes antigos que mandavam o id de `narrators`
       diretamente. Clientes atuais mandam o usuário logado (`actor`). */
    const legacyNarratorId = String(data.narratorId ?? '').trim()
    if (legacyNarratorId) return legacyNarratorId

    throw new CreateTableError('Informe quem está criando a mesa (actor).', 401)
  }

  async execute(data: any) {
    const narratorId = await this.resolveNarratorId(data)

    const gameTable = new GameTable(
      crypto.randomUUID(),
      narratorId,
      data.title,
      data.system,
      data.intro,
      undefined,
      data.lang === 'en' ? 'en' : 'pt'
    )

    const content: ContentSelection = {
      modules: Array.isArray(data.modules) ? data.modules : undefined,
      categories: Array.isArray(data.categories) ? data.categories : undefined,
      references: Array.isArray(data.references) ? data.references : undefined
    }

    const hasSelection =
      !!content.modules?.length || !!content.categories?.length || !!content.references?.length

    if (this.contentCatalog && hasSelection) {
      await this.repo.create(gameTable)
      const installed = await this.contentCatalog.installContent(gameTable.id, content)
      return { gameTable, installed }
    }

    await this.repo.create(gameTable)
    return gameTable
  }
}
