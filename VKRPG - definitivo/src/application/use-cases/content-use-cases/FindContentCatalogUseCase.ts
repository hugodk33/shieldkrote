import { ContentCatalogRepository } from '../../../domain/repositories/ContentCatalogRepository'

export class FindContentCatalogUseCase {
  constructor(private repo: ContentCatalogRepository) {}

  async execute() {
    return this.repo.findCatalog()
  }
}