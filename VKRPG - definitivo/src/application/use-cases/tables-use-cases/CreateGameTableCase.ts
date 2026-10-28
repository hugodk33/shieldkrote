import type { IGameTableRepository } from '../../../domain/irepositories/IGameTableRepository'
import crypto from 'crypto'
import { GameTable } from '../../../domain/entities/GameTable'
import { ContentCatalogRepository, type ContentSelection } from '../../../domain/repositories/ContentCatalogRepository'

export class CreateGameTableUseCase {
  constructor(
    private repo: IGameTableRepository,
    private contentCatalog?: ContentCatalogRepository
  ) {}

  async execute(data: any) {
    const gameTable = new GameTable(
      crypto.randomUUID(),
      data.narratorId,
      data.title,
      data.system,
      data.intro
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