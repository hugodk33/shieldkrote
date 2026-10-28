import { Request, Response } from 'express'
import { FindContentCatalogUseCase } from '../../application/use-cases/content-use-cases/FindContentCatalogUseCase'

export class ContentModuleController {
  constructor(private findContentCatalogUseCase: FindContentCatalogUseCase) {}

  async findCatalog(req: Request, res: Response) {
    try {
      const catalog = await this.findContentCatalogUseCase.execute()
      return res.json(catalog)
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message })
    }
  }
}