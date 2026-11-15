import { ContentCatalogRepository } from '../../../domain/repositories/ContentCatalogRepository'

export class FindContentCatalogUseCase {
  constructor(private repo: ContentCatalogRepository) {}

  async execute(lang?: string | null) {
    return this.repo.findCatalog(lang)
  }
}