import type {
  LocationShop,
  LocationShopEntry,
  LocationShopEntryInput,
  LocationShopItem,
  LocationShopLine,
} from '../types/LocationShop'

/**
 * Persistência das lojas.
 *
 * O estoque é lido a partir do vínculo do ITEM com o local (`location_id`):
 * um item com `location_id` = a loja está na prateleira dela. A tabela
 * `location_shop_items` só guarda o que a loja define por cima (preço,
 * estoque, observações).
 */
export interface ILocationShopRepository {
  /** A loja de um local (null quando o local não existe). */
  findShop(locationId: string): Promise<LocationShop | null>
  /** As prateleiras da loja. */
  findLines(locationId: string): Promise<LocationShopLine[]>
  /** Cria ou atualiza a entrada de um item na prateleira. */
  upsertEntry(input: LocationShopEntryInput & { table_id?: string | null; lang?: string }): Promise<LocationShopEntry>
  /** Apaga a entrada da prateleira (o item continua no catálogo). */
  removeEntry(locationId: string, itemId: string): Promise<void>
  /** Um item do catálogo. */
  findItem(itemId: string): Promise<LocationShopItem | null>
  /** Liga o item à prateleira da loja (`location_id`). */
  bindItemToLocation(itemId: string, locationId: string): Promise<void>
  /** Solta o item da prateleira (`location_id` = null). */
  unbindItem(itemId: string): Promise<void>
}
