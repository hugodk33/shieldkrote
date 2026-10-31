import {
  ContentCatalogRepository,
  type CreateContentCategoryInput
} from '../../../domain/repositories/ContentCatalogRepository'

/** Registra uma categoria/subcategoria no catálogo global. Uso exclusivo do superadmin. */
export class CreateContentCategoryUseCase {
  constructor(private repo: ContentCatalogRepository) {}

  async execute(input: CreateContentCategoryInput) {
    return this.repo.createCategory(input)
  }
}
