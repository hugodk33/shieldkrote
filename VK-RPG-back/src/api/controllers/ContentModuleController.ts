import { Request, Response } from 'express'
import { FindContentCatalogUseCase } from '../../application/use-cases/content-use-cases/FindContentCatalogUseCase'
import { CreateContentModuleUseCase } from '../../application/use-cases/content-use-cases/CreateContentModuleUseCase'
import { CreateContentCategoryUseCase } from '../../application/use-cases/content-use-cases/CreateContentCategoryUseCase'
import { ContentCatalogInputError } from '../../domain/repositories/ContentCatalogRepository'

export class ContentModuleController {
  constructor(
    private findContentCatalogUseCase: FindContentCatalogUseCase,
    private createContentModuleUseCase: CreateContentModuleUseCase,
    private createContentCategoryUseCase: CreateContentCategoryUseCase
  ) {}

  async findCatalog(req: Request, res: Response) {
    try {
      const catalog = await this.findContentCatalogUseCase.execute()
      return res.json(catalog)
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message })
    }
  }

  async createModule(req: Request, res: Response) {
    try {
      const module = await this.createContentModuleUseCase.execute(req.body ?? {})
      return res.status(201).json(module)
    } catch (e: any) {
      const status = e instanceof ContentCatalogInputError ? 400 : 500
      return res.status(status).json({ success: false, error: e.message })
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const category = await this.createContentCategoryUseCase.execute(req.body ?? {})
      return res.status(201).json(category)
    } catch (e: any) {
      const status = e instanceof ContentCatalogInputError ? 400 : 500
      return res.status(status).json({ success: false, error: e.message })
    }
  }
}
