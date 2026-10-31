import {
  ContentCatalogRepository,
  type CreateContentModuleInput
} from '../../../domain/repositories/ContentCatalogRepository'

/** Registra um pacote (kit) no catálogo global. Uso exclusivo do superadmin. */
export class CreateContentModuleUseCase {
  constructor(private repo: ContentCatalogRepository) {}

  async execute(input: CreateContentModuleInput) {
    return this.repo.createModule(input)
  }
}
