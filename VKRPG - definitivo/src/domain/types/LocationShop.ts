/**
 * Loja de um local.
 *
 * Uma LOJA é um local (table_locations) com `shop_name` preenchido. O
 * estoque da loja são os itens do catálogo (game_table_items) ligados ao
 * local pelo `location_id` do próprio item — a prateleira É o vínculo do
 * item com o local.
 *
 * `location_shop_items` guarda o que a loja tem de DIFERENTE do item: o
 * preço praticado nela (NULL = vale o `cost` do item) e a quantidade em
 * estoque (-1 = ilimitado, 0 = esgotado).
 */

/** Erro de regra de negócio de loja, com o status HTTP pronto para o controller. */
export class LocationShopError extends Error {
  readonly status: number
  constructor(message: string, status = 400) {
    super(message)
    this.name = 'LocationShopError'
    this.status = status
  }
}

/** Item do catálogo como a loja enxerga. */
export interface LocationShopItem {
  id: string
  lang?: string | null
  table_id?: string | null
  location_id?: string | null
  name: string
  kind?: string | null
  category?: string | null
  weight_lb?: number | null
  cost?: number | null
  currency_item_id?: string | null
  description?: string | null
  quality?: string | null
  condition?: string | null
}

/** Entrada persistida em location_shop_items. */
export interface LocationShopEntry {
  id: string
  lang: string
  table_id: string | null
  location_id: string
  item_id: string
  price: number | null
  stock: number
  notes: string | null
  created_at: string | null
  updated_at: string | null
}

/** Uma prateleira: o item do catálogo + o que a loja define sobre ele. */
export interface LocationShopLine {
  /** O item do catálogo. */
  item: LocationShopItem
  /** Id da entrada em location_shop_items (null = item ligado à loja sem dados de preço/estoque). */
  entry_id: string | null
  /** Preço praticado na loja (null = vale o `cost` do item). */
  price: number | null
  /** Quantidade em estoque (-1 = ilimitado, 0 = esgotado). */
  stock: number
  notes: string | null
}

/** A loja de um local, com o estoque inteiro. */
export interface LocationShop {
  location_id: string
  table_id: string | null
  /** Nome da loja (`shop_name` do local). */
  name: string | null
  /** Descrição do local. */
  description: string | null
  /** Idioma da loja (o do local). */
  lang: string
  lines: LocationShopLine[]
}

/** O que o narrador pode mandar entrar no estoque. */
export interface LocationShopEntryInput {
  location_id: string
  item_id: string
  price?: number | null
  stock?: number | null
  notes?: string | null
}
