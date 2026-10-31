import { Request, Response } from 'express'
import {
  CopyItemIntoLocationShopUseCase,
  EditLocationShopItemUseCase,
  FindLocationShopUseCase,
  LocationShopError,
  RemoveLocationShopItemUseCase,
  StockLocationShopItemUseCase,
} from '../../application/use-cases/location-shop-use-cases/LocationShopUseCases'
import { publishTable } from '../../infra/realtime/TableEvents'

/**
 * Estoque das lojas (narrador).
 *
 * NOTA DE SEGURANÇA: como o resto do backend de narrador, não há
 * autenticação de verdade — quem chega no endpoint é o narrador da mesa.
 */
export class LocationShopController {
  constructor(
    private findUseCase: FindLocationShopUseCase,
    private stockUseCase: StockLocationShopItemUseCase,
    private copyUseCase: CopyItemIntoLocationShopUseCase,
    private editUseCase: EditLocationShopItemUseCase,
    private removeUseCase: RemoveLocationShopItemUseCase
  ) {}

  private handle = async (res: Response, fn: () => Promise<unknown>) => {
    try {
      return res.json(await fn())
    } catch (error) {
      if (error instanceof LocationShopError) {
        return res.status(error.status).json({ error: error.message })
      }
      return res.status(500).json({ error: (error as Error)?.message ?? 'Erro inesperado' })
    }
  }

  /** O estoque da loja de um local. */
  async find(req: Request, res: Response) {
    return this.handle(res, () =>
      this.findUseCase.execute({ locationId: (req.params.locationId ?? '') as string })
    )
  }

  /** Entrada de item: a peça do catálogo passa a morar na prateleira. */
  async stock(req: Request, res: Response) {
    return this.handle(res, async () => {
      const shop = await this.stockUseCase.execute({
        locationId: (req.params.locationId ?? '') as string,
        itemId: (req.body?.item_id ?? '') as string,
        price: req.body?.price,
        stock: req.body?.stock,
        notes: req.body?.notes,
      })
      if (shop.table_id) publishTable(shop.table_id, 'shop')
      return shop
    })
  }

  /** Cópia de um item existente para dentro da loja. */
  async copy(req: Request, res: Response) {
    return this.handle(res, async () => {
      const shop = await this.copyUseCase.execute({
        locationId: (req.params.locationId ?? '') as string,
        itemId: (req.body?.item_id ?? '') as string,
        price: req.body?.price,
        stock: req.body?.stock,
        notes: req.body?.notes,
      })
      if (shop.table_id) publishTable(shop.table_id, 'shop')
      return shop
    })
  }

  /** Preço, estoque e observações de uma prateleira. */
  async edit(req: Request, res: Response) {
    return this.handle(res, async () => {
      const shop = await this.editUseCase.execute({
        locationId: (req.params.locationId ?? '') as string,
        itemId: (req.params.itemId ?? req.body?.item_id ?? '') as string,
        price: req.body?.price,
        stock: req.body?.stock,
        notes: req.body?.notes,
      })
      if (shop.table_id) publishTable(shop.table_id, 'shop')
      return shop
    })
  }

  /** Tira a peça da prateleira. */
  async remove(req: Request, res: Response) {
    return this.handle(res, async () => {
      const shop = await this.removeUseCase.execute({
        locationId: (req.params.locationId ?? '') as string,
        itemId: (req.params.itemId ?? req.body?.item_id ?? '') as string,
      })
      if (shop.table_id) publishTable(shop.table_id, 'shop')
      return shop
    })
  }
}
