// src/domain/repositories/ContentCatalogRepository.ts
import { db } from '../../infra/database/database'
import crypto from 'crypto'

export type ContentModuleRow = {
  id: string
  slug: string
  name: string
  tech_level: string | null
  description: string | null
  accent: string | null
  sort: number
}

export type ContentCategoryRow = {
  id: string
  domain: string
  parent_id: string | null
  name: string
  display_name: string
  sort: number
}

export type ContentCatalogCount = {
  moduleId: string
  domain: string
  category: string
  subcategory: string | null
  count: number
}

export type ContentReference = {
  id: string
  moduleId: string
  domain: string
  category: string
  subcategory: string | null
  name: string
  description: string | null
  kind: string | null
}

export type ContentCatalog = {
  modules: ContentModuleRow[]
  categories: ContentCategoryRow[]
  counts: ContentCatalogCount[]
  references: ContentReference[]
}

export type ContentCategorySelection = {
  domain: string
  category: string
  subcategories?: string[]
}

export type ContentReferenceSelection = {
  domain: string
  ids: string[]
}

export type ContentSelection = {
  modules?: string[]
  categories?: ContentCategorySelection[]
  references?: ContentReferenceSelection[]
}

export type ContentInstallSummary = {
  skills: number
  items: number
  advantages: number
  disadvantages: number
  npcs: number
  characters: number
  locations: number
}

// Tabelas GLOBAIS do catálogo (povoadas exclusivamente pelo seed).
// findCatalog e installContent NÃO dependem de mesas de jogo.

// O catálogo global guarda o mesmo conceito em PT e EN (coluna lang).
// O wizard de criação de mesa e a instalação nas mesas novas usam
// SOMENTE o acervo em português — os kits não misturam idiomas.
const CATALOG_LANG = 'pt'

const DOMAIN_TABLES: Record<string, string> = {
  skill: 'content_skills',
  item: 'content_items',
  advantage: 'content_advantages',
  disadvantage: 'content_disadvantages',
  npc: 'content_npcs'
}

export class ContentCatalogRepository {
  async findCatalog(): Promise<ContentCatalog> {
    const modules = db.prepare('SELECT * FROM content_modules ORDER BY sort, name').all() as ContentModuleRow[]
    const categories = db
      .prepare('SELECT * FROM content_categories ORDER BY domain, sort, name')
      .all() as ContentCategoryRow[]

    const counts: ContentCatalogCount[] = []
    for (const [domain, table] of Object.entries(DOMAIN_TABLES)) {
      const rows = db
        .prepare(
          `SELECT module_id, category, subcategory, COUNT(*) AS count
           FROM ${table}
           WHERE module_id IS NOT NULL AND lang = '${CATALOG_LANG}'
           GROUP BY module_id, category, subcategory
           ORDER BY category, subcategory`
        )
        .all() as any[]
      for (const row of rows) {
        counts.push({
          moduleId: row.module_id,
          domain,
          category: row.category,
          subcategory: row.subcategory ?? null,
          count: row.count
        })
      }
    }

    const references: ContentReference[] = []
    const refTables = [
      { domain: 'skill', table: 'content_skills' },
      { domain: 'item', table: 'content_items' },
      { domain: 'advantage', table: 'content_advantages' },
      { domain: 'disadvantage', table: 'content_disadvantages' }
    ]
    const npcRows = db
      .prepare(
        `SELECT id, module_id, category, subcategory, name, bio AS description
         FROM content_npcs WHERE module_id IS NOT NULL AND lang = '${CATALOG_LANG}'`
      )
      .all() as any[]
    for (const row of npcRows) {
      references.push({
        id: row.id,
        moduleId: row.module_id,
        domain: 'npc',
        category: row.category,
        subcategory: row.subcategory ?? null,
        name: row.name,
        description: row.description,
        kind: null
      })
    }
    for (const ref of refTables) {
      const rows = db
        .prepare(`SELECT id, module_id, category, subcategory, name, description FROM ${ref.table} WHERE module_id IS NOT NULL AND lang = '${CATALOG_LANG}'`)
        .all() as any[]
      for (const row of rows) {
        references.push({
          id: row.id,
          moduleId: row.module_id,
          domain: ref.domain,
          category: row.category,
          subcategory: row.subcategory ?? null,
          name: row.name,
          description: row.description,
          kind: null
        })
      }
    }

    // ---- LOCATIONS (árvore do mundo do kit, global) ----
    const locationRows = db
      .prepare(
        `SELECT id, kind, name, description FROM content_locations WHERE lang = '${CATALOG_LANG}' ORDER BY level, name`
      )
      .all() as any[]
    for (const row of locationRows) {
      references.push({
        id: row.id,
        moduleId: '',
        domain: 'location',
        category: row.kind ?? 'site',
        subcategory: null,
        name: row.name,
        description: row.description,
        kind: null
      })
    }

    return { modules, categories, counts, references }
  }

  /**
   * Instala conteúdo do CATÁLOGO GLOBAL numa mesa.
   * A seleção é a UNIÃO entre:
   *   (a) linhas cujo module_id está em selection.modules,
   *   (b) linhas cujas categorias/subcategorias foram marcadas, e
   *   (c) linhas expressas por id em selection.references (por domínio).
   */
  async installContent(targetTableId: string, selection: ContentSelection): Promise<ContentInstallSummary> {
    const modules: string[] = Array.isArray(selection.modules) ? selection.modules.filter(Boolean) : []
    const categories: ContentCategorySelection[] = Array.isArray(selection.categories)
      ? selection.categories.filter((c) => c && c.domain && c.category)
      : []
    const refSelections: ContentReferenceSelection[] = Array.isArray(selection.references)
      ? selection.references.filter((r) => r && r.domain && Array.isArray(r.ids))
      : []
    const refIdsByDomain = new Map<string, string[]>()
    for (const refSel of refSelections) {
      const ids = refSel.ids.filter(Boolean)
      if (ids.length) refIdsByDomain.set(refSel.domain, ids)
    }

    const moduleFilter = modules.length ? `module_id IN (${modules.map(() => '?').join(',')})` : null

    const wholeCats: string[] = []
    const subPairs: { category: string; subcategory: string }[] = []
    for (const entry of categories) {
      const subs = Array.isArray(entry.subcategories) ? entry.subcategories.filter(Boolean) : []
      if (subs.length) {
        for (const sub of subs) subPairs.push({ category: entry.category, subcategory: sub })
      } else {
        wholeCats.push(entry.category)
      }
    }

    const wholeFilter = wholeCats.length ? `category IN (${wholeCats.map(() => '?').join(',')})` : null
    const subFilter = subPairs.length
      ? `(${subPairs.map(() => '(category = ? AND subcategory = ?)').join(' OR ')})`
      : null

    const whereParts = [moduleFilter, wholeFilter, subFilter].filter(Boolean) as string[]

    const pickParams = (): any[] => {
      const params: any[] = [...modules, ...wholeCats]
      for (const p of subPairs) params.push(p.category, p.subcategory)
      return params
    }

    const condFor = (domain: string): { clause: string; params: any[] } | null => {
      const ids = refIdsByDomain.get(domain) ?? []
      const parts = whereParts.map((p) => p).slice()
      if (ids.length) parts.push(`id IN (${ids.map(() => '?').join(',')})`)
      if (!parts.length) return null
      return { clause: `module_id IS NOT NULL AND lang = '${CATALOG_LANG}' AND (${parts.join(' OR ')})`, params: [...pickParams(), ...ids] }
    }

    const summary: ContentInstallSummary = { skills: 0, items: 0, advantages: 0, disadvantages: 0, npcs: 0, characters: 0, locations: 0 }

    // Nome -> id da skill recem-criada na mesa de destino. As skills do
    // catalogo ganham UUID novo a cada instalacao, entao weapons.skill_id
    // da origem nao pode ser reaproveitado: so o nome sobrevive.
    const installedSkillIds = new Map<string, string>()

    // Resolve o nome solto de weapons.skill contra as skills da mesa de
    // destino: primeiro o mapa do que acabou de ser inserido, depois a skill
    // que ja existia na mesa (quando so o modulo de itens foi instalado).
    const resolveInstalledSkill = (skillName?: string | null): string | null => {
      if (!skillName) return null
      const fromMap = installedSkillIds.get(skillName)
      if (fromMap) return fromMap
      const row = db
        .prepare(
          `SELECT id FROM game_table_skills
           WHERE table_id = ? AND lang = ? AND name = ? LIMIT 1`
        )
        .get(targetTableId, CATALOG_LANG, skillName) as any
      return row?.id ?? null
    }

    db.transaction(() => {
      // ---- SKILLS ----
      const skillCond = condFor('skill')
      if (skillCond) {
        const skillRows = db
          .prepare(
            `SELECT id, name, category, subcategory, type, predefinition_type, predefinition_difficulty, description, module_id
             FROM content_skills WHERE ${skillCond.clause}`
          )
          .all(...skillCond.params) as any[]
        const skillStmt = db.prepare(
          `INSERT INTO game_table_skills (id, table_id, name, category, subcategory, type, predefinition_type, predefinition_difficulty, description, module_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        for (const row of skillRows) {
          const newSkillId = crypto.randomUUID()
          skillStmt.run(newSkillId, targetTableId, row.name, row.category, row.subcategory, row.type, row.predefinition_type, row.predefinition_difficulty, row.description, row.module_id)
          // Nome -> id recem-criado. Todo INSERT deste metodo deixa `lang` no
          // default 'pt', entao a resolucao abaixo usa o mesmo idioma.
          installedSkillIds.set(row.name, newSkillId)
          summary.skills++
        }
      }

      // ---- ADVANTAGES ----
      const advantageCond = condFor('advantage')
      if (advantageCond) {
        const advantageRows = db
          .prepare(
            `SELECT name, category, subcategory, cost_points, description, module_id FROM content_advantages
             WHERE ${advantageCond.clause}`
          )
          .all(...advantageCond.params) as any[]
        const advantageStmt = db.prepare(
          `INSERT INTO game_table_advantages (id, table_id, name, category, subcategory, cost_points, description, module_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        for (const row of advantageRows) {
          advantageStmt.run(crypto.randomUUID(), targetTableId, row.name, row.category, row.subcategory, row.cost_points, row.description, row.module_id)
          summary.advantages++
        }
      }

      // ---- DISADVANTAGES ----
      const disadvantageCond = condFor('disadvantage')
      if (disadvantageCond) {
        const disadvantageRows = db
          .prepare(
            `SELECT name, category, subcategory, cost_points, effect, description, module_id FROM content_disadvantages
             WHERE ${disadvantageCond.clause}`
          )
          .all(...disadvantageCond.params) as any[]
        const disadvantageStmt = db.prepare(
          `INSERT INTO game_table_disadvantages (id, table_id, name, category, subcategory, cost_points, effect, description, module_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        for (const row of disadvantageRows) {
          disadvantageStmt.run(crypto.randomUUID(), targetTableId, row.name, row.category, row.subcategory, row.cost_points, row.effect, row.description, row.module_id)
          summary.disadvantages++
        }
      }

      // ---- ITEMS (com weapons/attacks/armors aninhados) ----
      const itemCond = condFor('item')
      if (itemCond) {
        const itemRows = db
          .prepare(`SELECT * FROM content_items WHERE ${itemCond.clause}`)
          .all(...itemCond.params) as any[]
        const itemStmt = db.prepare(
          `INSERT INTO game_table_items (id, table_id, location_id, name, kind, category, weight_lb, cost, dimensions, description, quality, condition, tech_level, module_id, subcategory, skill_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        for (const item of itemRows) {
          const newItemId = crypto.randomUUID()
          const catalogWeapons = db.prepare('SELECT * FROM content_weapons WHERE item_id = ?').all(item.id) as any[]
          // O item espelha a skill da arma para ser legivel sem join.
          const itemSkillId = resolveInstalledSkill(catalogWeapons[0]?.skill)
          itemStmt.run(newItemId, targetTableId, null, item.name, item.kind, item.category, item.weight_lb, item.cost, item.dimensions, item.description, item.quality, item.condition, item.tech_level ?? null, item.module_id, item.subcategory, itemSkillId)
          summary.items++

          const weapons = catalogWeapons
          for (const weapon of weapons) {
            const newWeaponId = crypto.randomUUID()
            // Preferimos o mapa populado acima; se o modulo de skills nao foi
            // instalado nesta chamada, cai para a skill ja existente na mesa
            // com o mesmo nome. Se nao houver nenhuma, fica null.
            const installedSkillId = resolveInstalledSkill(weapon.skill)
            db.prepare(
              `INSERT INTO game_table_weapons (id, item_id, skill, skill_id, min_st, rated_st, handedness, reach, parry, block, fit)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).run(newWeaponId, newItemId, weapon.skill, installedSkillId, weapon.min_st, weapon.rated_st, weapon.handedness, weapon.reach, weapon.parry, weapon.block, weapon.fit)
            const attacks = db.prepare('SELECT * FROM content_weapon_attacks WHERE weapon_id = ?').all(weapon.id) as any[]
            for (const attack of attacks) {
              db.prepare(
                `INSERT INTO weapon_attacks (id, weapon_id, name, usage, damage_source, damage_modifier, damage_dice, damage_type, armor_penetration, accuracy, range, recoil, shots)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
              ).run(
                crypto.randomUUID(), newWeaponId, attack.name, attack.usage,
                attack.damage_source, attack.damage_modifier, attack.damage_dice, attack.damage_type,
                attack.armor_penetration, attack.accuracy, attack.range, attack.recoil, attack.shots
              )
            }
          }

          const armors = db.prepare('SELECT * FROM content_armors WHERE item_id = ?').all(item.id) as any[]
          for (const armor of armors) {
            db.prepare(
              `INSERT INTO game_table_armors (id, item_id, dr, flex, locations, fit)
               VALUES (?, ?, ?, ?, ?, ?)`
            ).run(crypto.randomUUID(), newItemId, armor.dr, armor.flex, armor.locations, armor.fit)
          }
        }
      }

      // ---- NPCS (bundle: character + sheet + npc) ----
      const npcCond = condFor('npc')
      if (npcCond) {
        const npcRows = db
          .prepare(
            `SELECT id, name, bio, backstory, points, hp, st, dx, iq, ht, fatigue, encumbrance, status, module_id, category, subcategory
             FROM content_npcs WHERE ${npcCond.clause}`
          )
          .all(...npcCond.params) as any[]
        const npcStmt = db.prepare(
          `INSERT INTO game_table_npcs (id, character_id, status, location_id, module_id, category, subcategory)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        for (const npc of npcRows) {
          const newCharacterId = crypto.randomUUID()
          db.prepare(
            `INSERT INTO game_table_characters (id, user_id, table_id)
             VALUES (?, ?, ?)`
          ).run(newCharacterId, null, targetTableId)
          summary.characters++

          db.prepare(
            `INSERT INTO game_table_character_sheets (id, character_id, name, bio, backstory, points, hp, st, dx, iq, ht, fatigue, encumbrance)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).run(
            crypto.randomUUID(), newCharacterId, npc.name, npc.bio, npc.backstory,
            npc.points, npc.hp, npc.st, npc.dx, npc.iq, npc.ht, npc.fatigue, npc.encumbrance
          )

          npcStmt.run(crypto.randomUUID(), newCharacterId, npc.status, null, npc.module_id, npc.category, npc.subcategory)
          summary.npcs++
        }
      }

      // ---- LOCATIONS (árvore do mundo: copiada inteira, com parent_id remapeado) ----
      const locationIds = refIdsByDomain.get('location') ?? []
      if (locationIds.length) {
        const rows = db.prepare(`SELECT * FROM content_locations WHERE lang = '${CATALOG_LANG}'`).all() as any[]
        const idMap = new Map<string, string>()
        const insert = db.prepare(
          `INSERT INTO table_locations (id, table_id, parent_id, kind, level, path, name, region, address, sub_region, is_indoor, other, country, area, dimensions, description, hex_size_m, width_hexes, height_hexes, center_q, center_r, orientation, rotation_deg, is_battlemap, shop_name, tiles, drawing)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        for (const loc of rows as any[]) {
          const newId = crypto.randomUUID()
          idMap.set(loc.id, newId)
          insert.run(
            newId, targetTableId, null,
            loc.kind ?? 'site', loc.level ?? 0, '',
            loc.name, loc.region ?? null, loc.address ?? null, loc.sub_region ?? null,
            loc.is_indoor ?? 0, loc.other ?? null, loc.country ?? null, loc.area ?? null, loc.dimensions ?? null,
            loc.description ?? null, loc.hex_size_m ?? null, loc.width_hexes ?? null, loc.height_hexes ?? null,
            loc.center_q ?? 0, loc.center_r ?? 0, loc.orientation ?? 'flat', loc.rotation_deg ?? 0,
            loc.is_battlemap ?? 0, loc.shop_name ?? null, loc.tiles ?? '[]', loc.drawing ?? '[]'
          )
          summary.locations++
        }
        for (const loc of rows as any[]) {
          if (!loc.parent_id) continue
          const newParent = idMap.get(loc.parent_id)
          const newId = idMap.get(loc.id)
          if (!newParent || !newId) continue
          const parentPath = db.prepare('SELECT path FROM table_locations WHERE id = ?').get(newParent) as { path: string } | undefined
          const path = parentPath ? `${parentPath.path}${newId}/`.replace(/\/{2,}/g, '/') : `/${newId}/`
          db.prepare('UPDATE table_locations SET parent_id = ?, path = ? WHERE id = ?').run(newParent, path, newId)
        }
      }

      // registra os módulos escolhidos na mesa
      if (modules.length) {
        db.prepare('UPDATE game_tables SET modules = ? WHERE id = ?').run(JSON.stringify(modules), targetTableId)
      }
    })()

    return summary
  }
}

export default ContentCatalogRepository
