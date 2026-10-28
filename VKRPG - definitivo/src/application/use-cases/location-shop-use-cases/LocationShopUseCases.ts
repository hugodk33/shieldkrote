import type { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'
import type { ILocationShopRepository } from '../../../domain/irepositories/ILocationShopRepository'
import {
  LocationShopError,
  type LocationShop,
  type LocationShopEntryInput,
} from '../../../domain/types/LocationShop'

/**
 * Lojas por local.
 *
 * Uma LOJA é um local (table_locations) com `shop_name` preenchido. A
 * prateleira da loja é o vínculo do ITEM do catálogo com o local
 * (`game_table_items.location_id`), e `location_shop_items` guarda o que a
 * loja define por cima do item: o preço praticado nela e o estoque.
 *
 * Duas formas de pôr item na prateleira:
 *
 *   entrada  -> o item do catálogo passa a morar na loja (location_id)
 *   cópia    -> o item é DUPLICADO para dentro da loja, como uma peça
 *               própria do mercador (o catálogo continua com o original)
 *
 * NOTA DE SEGURANÇA: como o resto do backend de narrador, não há
 * autenticação real — quem chega no endpoint é o narrador da mesa. É regra de
 * produto, não segurança de verdade.
 */

export { LocationShopError }

const badRequest = (message: string, status = 400): LocationShopError =>
  new LocationShopError(message, status)

/** Preço: nulo (vale o custo do item) ou inteiro >= 0. */
const readPrice = (raw: unknown): number | null => {
  if (raw === undefined || raw === null || raw === '') return null
  const price = Number(raw)
  if (!Number.isInteger(price) || price < 0) {
    throw badRequest('O preço da loja tem de ser um inteiro maior ou igual a zero.')
  }
  return price
}

/** Estoque: -1 = ilimitado, 0 = esgotado, N = N unidades. */
const readStock = (raw: unknown): number => {
  if (raw === undefined || raw === null || raw === '') return -1
  const stock = Number(raw)
  if (!Number.isInteger(stock) || stock < -1) {
    throw badRequest('O estoque tem de ser -1 (ilimitado) ou um inteiro maior ou igual a zero.')
  }
  return stock
}

const readNotes = (raw: unknown): string | null => {
  if (raw === undefined || raw === null) return null
  const notes = String(raw).trim()
  return notes ? notes : null
}

export interface LocationShopInput {
  locationId: string
  itemId?: string
  price?: unknown
  stock?: unknown
  notes?: unknown
}

/** Base comum: resolver a loja e validar o item contra a mesa dela. */
abstract class LocationShopUseCase {
  constructor(
    protected shops: ILocationShopRepository,
    protected rules: IGameTableRulesRepository
  ) {}

  /** A loja precisa existir e ser de fato uma loja (local com `shop_name`). */
  protected async resolveShop(locationId: string): Promise<LocationShop> {
    const id = (locationId ?? '').trim()
    if (!id) throw badRequest('Informe o local da loja.')
    const shop = await this.shops.findShop(id)
    if (!shop) throw badRequest('Local não encontrado.', 404)
    if (!shop.name) {
      throw badRequest('Esta localização não tem nome de loja. Dê um nome a ela para poder estocar.')
    }
    return shop
  }

  /** O item precisa existir e ser da mesma mesa da loja. */
  protected async resolveItem(shop: LocationShop, itemId: string) {
    const id = (itemId ?? '').trim()
    if (!id) throw badRequest('Informe o item.')
    const item = await this.shops.findItem(id)
    if (!item) throw badRequest('Item não encontrado.', 404)
    if (item.table_id && shop.table_id && item.table_id !== shop.table_id) {
      throw badRequest('O item não pertence a esta mesa.')
    }
    return item
  }

  /** Prepara os dados de prateleira vindos do corpo da requisição. */
  protected readShelf(input: LocationShopInput) {
    return {
      price: readPrice(input.price),
      stock: readStock(input.stock),
      notes: readNotes(input.notes),
    }
  }

  protected async shelfInput(
    shop: LocationShop,
    itemId: string,
    input: LocationShopInput
  ): Promise<LocationShopEntryInput & { table_id: string | null; lang: string }> {
    const shelf = this.readShelf(input)
    return {
      location_id: shop.location_id,
      item_id: itemId,
      table_id: shop.table_id ?? null,
      lang: shop.lang,
      price: shelf.price,
      stock: shelf.stock,
      notes: shelf.notes,
    }
  }
}

/** O estoque da loja, com o preço e a quantidade de cada prateleira. */
export class FindLocationShopUseCase extends LocationShopUseCase {
  async execute(input: { locationId: string }): Promise<LocationShop> {
    return this.resolveShop(input.locationId)
  }
}

/**
 * ENTRADA DE ITEM: um item do catálogo passa a morar na prateleira da loja.
 * O item continua no catálogo — a loja só passa a oferecer aquela peça.
 */
export class StockLocationShopItemUseCase extends LocationShopUseCase {
  async execute(input: LocationShopInput): Promise<LocationShop> {
    const shop = await this.resolveShop(input.locationId)
    const item = await this.resolveItem(shop, input.itemId ?? '')
    const shelf = await this.shelfInput(shop, item.id, input)

    await this.shops.bindItemToLocation(item.id, shop.location_id)
    await this.shops.upsertEntry(shelf)

    return this.resolveShop(shop.location_id)
  }
}

/**
 * CÓPIA DE ITEM EXISTENTE: duplica a peça do catálogo para dentro da loja.
 * O original continua no catálogo (e, se estava em outra prateleira, lá
 * permanece); a cópia é a peça que o mercador vende.
 */
export class CopyItemIntoLocationShopUseCase extends LocationShopUseCase {
  async execute(input: LocationShopInput): Promise<LocationShop> {
    const shop = await this.resolveShop(input.locationId)
    const item = await this.resolveItem(shop, input.itemId ?? '')
    const shelf = await this.shelfInput(shop, item.id, input)

    const copy = await this.rules.duplicateGameItems(item.id, shop.table_id ?? '', shop.location_id)
    const copyId = copy?.id
    if (!copyId) throw badRequest('Não foi possível copiar o item para a loja.', 500)

    await this.shops.upsertEntry({ ...shelf, item_id: copyId })

    return this.resolveShop(shop.location_id)
  }
}

/** Ajusta preço, estoque e observações de uma prateleira. */
export class EditLocationShopItemUseCase extends LocationShopUseCase {
  async execute(input: LocationShopInput): Promise<LocationShop> {
    const shop = await this.resolveShop(input.locationId)
    const item = await this.resolveItem(shop, input.itemId ?? '')
    if (item.location_id !== shop.location_id) {
      throw badRequest('O item não está no estoque desta loja.')
    }
    const shelf = await this.shelfInput(shop, item.id, input)

    await this.shops.upsertEntry(shelf)

    return this.resolveShop(shop.location_id)
  }
}

/** Tira a peça da prateleira: some da loja e volta para o catálogo solto. */
export class RemoveLocationShopItemUseCase extends LocationShopUseCase {
  async execute(input: LocationShopInput): Promise<LocationShop> {
    const shop = await this.resolveShop(input.locationId)
    const item = await this.resolveItem(shop, input.itemId ?? '')

    await this.shops.removeEntry(shop.location_id, item.id)
    if (item.location_id === shop.location_id) {
      await this.shops.unbindItem(item.id)
    }

    return this.resolveShop(shop.location_id)
  }
}
