// src/infra/database/seed.ts
// Seed bilingue de DUAS MESAS independentes: cada variante (en/pt) é dona dos
// SEUS ids (bundles MainUUIDIds e mainGameTableId próprios). Conteúdo por
// variante (catálogo, characters, npcs, narration_*, dependecies/preDetermined,
// modifiers, visibility) é inserido dentro do loop, pois os ids diferem.
// Tabelas globais (users, narrators, categorias, dano) ficam uma vez.
//
// O catálogo (content_modules + content_*) é semeado POR IDIOMA a partir das
// variáveis — ele é a fonte dos kits, não um espelho das mesas. Cada mesa de
// exemplo nasce com os kits da sua língua já instalados (game_tables.modules)
// e as linhas recebem os mesmos ids do catálogo, preservando as relações
// autorais (skills/itens/armas) da seed.
//
// Seleção de idioma por argumento (cada execução limpa o banco e semeia só o alvo):
//   npm run seed        -> EN + PT
//   npm run seed:en     -> apenas EN
//   npm run seed:pt     -> apenas PT
import { db } from './database'
import './migrate'
import crypto from 'crypto'
import { portraitAsset, bodyAsset, itemAsset, backdropAsset, resetSeedAssets } from '../seed-assets'
import { resolveWeaponSkills } from './resolveWeaponSkills'

const allTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[]

// Rebuild the whole file inside ONE transaction. Foreign keys stay off while we
// wipe and re-insert (avoids ordering constraints). If ANY step throws — a bad
// row, a locked asset file, an interrupted run — the ROLLBACK keeps the previous
// database intact instead of leaving it half-seeded (which silently broke the
// story/journey and weapon-damage data).
db.exec('PRAGMA foreign_keys = OFF')
db.exec('BEGIN')
for (const { name } of allTables) {
  db.exec(`DELETE FROM "${name}"`)
}

// Drop the previous placeholder art so stale files never linger.
resetSeedAssets()

import * as VVariablesEn from '../variables'
import * as VVariablesPt from '../variables-pt-br'

const allVariants: { lang: 'en' | 'pt'; V: typeof VVariablesEn | typeof VVariablesPt }[] = [
  { lang: 'en', V: VVariablesEn },
  { lang: 'pt', V: VVariablesPt }
]

// O idioma pode ser escolhido por argumento:
//   npm run seed        -> EN + PT
//   npm run seed:en     -> apenas EN
//   npm run seed:pt     -> apenas PT
const requested = process.argv
  .slice(2)
  .map((arg) => arg.toLowerCase())
  .filter((arg): arg is 'en' | 'pt' => arg === 'en' || arg === 'pt')

const variants = requested.length
  ? allVariants.filter((variant) => requested.includes(variant.lang))
  : allVariants

const VEn = VVariablesEn

const {
  users,
  narrators,
  gurpsDamageTable,
  contentCategories
} = VEn

// ------------------------------------------------------------
// TABELAS GLOBAIS (inseridas uma única vez)
// ------------------------------------------------------------

const userStmt = db.prepare(`
  INSERT INTO users (id, type, username, password, phone, email)
  VALUES (?, ?, ?, ?, ?, ?)
`)

for (const user of users) {
  userStmt.run(
    user.id,
    user.type,
    user.username,
    user.password,
    user.phone,
    user.email
  )
}

// insert narrators (id compartilhado entre as variantes)
const narratorStmt = db.prepare(`
  INSERT INTO narrators (id, user_id, name)
  VALUES (?, ?, ?)
`)

for (const narrator of narrators) {
  narratorStmt.run(narrator.id, narrator.userId, narrator.name)
}

// insert content categories (árvore GURPS — taxonomia global, compartilhada)
const contentCategoryStmt = db.prepare(`
  INSERT INTO content_categories (id, domain, parent_id, name, display_name, sort)
  VALUES (?, ?, ?, ?, ?, ?)
`)

for (const category of contentCategories) {
  contentCategoryStmt.run(
    category.id,
    category.domain,
    category.parentId,
    category.name,
    category.displayName,
    category.sort
  )
}

// insert gurps damage table (ST -> THR/SW)
const gurpsDamageStmt = db.prepare(`
  INSERT INTO gurps_damage_table (id, st, thrust, swing)
  VALUES (?, ?, ?, ?)
`)

for (const row of gurpsDamageTable) {
  gurpsDamageStmt.run(row.id, row.st, row.thrust, row.swing)
}

// ------------------------------------------------------------
// LOOP POR VARIANTE (CONTEÚDO COMPLETO DE CADA MESA)
// ------------------------------------------------------------
for (const { lang, V } of variants) {
  const {
    gameTables,
    gameTablePlayers,
    characters,
    characterSheets,
    characterSkills,
    characterAdvantages,
    characterDisadvantages,
    characterEquipment,
    newNpcs,
    skills,
    items,
    weapons,
    weaponAttacks,
    armors,
    advantages,
    disadvantages,
    peculiarities,
    scenes,
    narrations,
    modifierNarrationsActions,
    modifierNarrationsLocations,
    modifierNarrationsCharacters,
modifierNarrationsNPCs,
    modifierSeedEntries,
    modifierTableLocations,
    modifierTableLocationConnections,
    modifierGameTableSkillsPreDetermined,
    modifierGameTableSkillsDependecies,
    visibilityRules,
    skillTag,
    advantageTagBy,
    disadvantageTagBy,
    itemTagBy,
    npcTagBy
  } = V

  // ----------------------------------------------------------
  // CATÁLOGO GLOBAL (content_*) — por idioma
  // ----------------------------------------------------------
  // Os kits e as linhas de referência nascem AQUI, das variáveis do idioma,
  // com os MESMOS ids das linhas da mesa de exemplo. A mesa então instala
  // os kits (game_tables.modules) e recebe conteúdo equivalente — o
  // catálogo deixa de ser derivado das mesas semeadas.
  const contentModuleStmt = db.prepare(`
    INSERT INTO content_modules (id, lang, slug, name, tech_level, description, accent, sort)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const module of V.contentModules) {
    contentModuleStmt.run(
      module.id,
      lang,
      module.slug,
      module.name,
      module.techLevel,
      module.description,
      module.accent,
      module.sort
    )
  }

  const catalogSkillStmt = db.prepare(`
    INSERT INTO content_skills
      (id, lang, name, category, subcategory, type, predefinition_type, predefinition_difficulty, description, module_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const skill of skills) {
    const tag = skillTag[skill.name] ?? { moduleId: 'fantasy', category: 'survival', subcategory: 'wilderness' }
    catalogSkillStmt.run(
      skill.id,
      lang,
      skill.name,
      tag.category,
      tag.subcategory ?? null,
      null,
      skill.predefinition_type,
      skill.predefinition_difficulty,
      skill.description,
      tag.moduleId
    )
  }

  const catalogAdvantageStmt = db.prepare(`
    INSERT INTO content_advantages
      (id, lang, name, category, subcategory, cost_points, description, module_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const advantage of advantages) {
    const tag = advantageTagBy(advantage.name)
    catalogAdvantageStmt.run(
      advantage.id,
      lang,
      advantage.name,
      tag.category,
      tag.subcategory ?? null,
      advantage.costPoints,
      advantage.description,
      tag.moduleId
    )
  }

  const catalogDisadvantageStmt = db.prepare(`
    INSERT INTO content_disadvantages
      (id, lang, name, category, subcategory, cost_points, effect, description, module_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const disadvantage of disadvantages) {
    const tag = disadvantageTagBy(disadvantage.name)
    catalogDisadvantageStmt.run(
      disadvantage.id,
      lang,
      disadvantage.name,
      tag.category,
      tag.subcategory ?? null,
      disadvantage.costPoints,
      null,
      disadvantage.description,
      tag.moduleId
    )
  }

  const catalogItemStmt = db.prepare(`
    INSERT INTO content_items
      (id, lang, name, kind, category, weight_lb, cost, dimensions, description, quality, condition, module_id, subcategory, tech_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const item of items) {
    const tag = itemTagBy(item)
    catalogItemStmt.run(
      item.id,
      lang,
      item.name,
      item.kind,
      item.category,
      item.weight_lb,
      item.cost,
      item.dimensions,
      item.description,
      item.quality,
      item.condition,
      tag.moduleId,
      tag.subcategory ?? null,
      item.tech_level ?? null
    )
  }

  const itemIds = new Set(items.map((item) => item.id))

  const catalogWeaponStmt = db.prepare(`
    INSERT INTO content_weapons
      (id, lang, item_id, skill, min_st, rated_st, handedness, reach, parry, block, fit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const catalogWeaponIds = new Set<string>()
  for (const weapon of weapons) {
    if (!itemIds.has(weapon.item_id)) continue
    catalogWeaponIds.add(weapon.id)
    catalogWeaponStmt.run(
      weapon.id,
      lang,
      weapon.item_id,
      weapon.skill,
      weapon.min_st,
      weapon.rated_st,
      weapon.handedness,
      weapon.reach,
      weapon.parry,
      weapon.block,
      weapon.fit
    )
  }

  const catalogAttackStmt = db.prepare(`
    INSERT INTO content_weapon_attacks
      (id, lang, weapon_id, name, usage, damage_source, damage_modifier, damage_dice, damage_type, armor_penetration, accuracy, range, recoil, shots)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const attack of weaponAttacks) {
    if (!catalogWeaponIds.has(attack.weapon_id)) continue
    catalogAttackStmt.run(
      attack.id,
      lang,
      attack.weapon_id,
      attack.name,
      attack.usage,
      attack.damage_source,
      attack.damage_modifier,
      attack.damage_dice,
      attack.damage_type,
      attack.armor_penetration,
      attack.accuracy,
      attack.range,
      attack.recoil,
      attack.shots
    )
  }

  const catalogArmorStmt = db.prepare(`
    INSERT INTO content_armors (id, lang, item_id, dr, flex, locations, fit)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  for (const armor of armors) {
    if (!itemIds.has(armor.item_id)) continue
    catalogArmorStmt.run(
      armor.id,
      lang,
      armor.item_id,
      armor.dr,
      armor.flex,
      armor.locations,
      armor.fit
    )
  }

  const sheetByCharacterId = new Map(characterSheets.map((sheet) => [sheet.characterId, sheet]))
  const catalogNpcStmt = db.prepare(`
    INSERT INTO content_npcs
      (id, lang, name, bio, backstory, points, hp, st, dx, iq, ht, fatigue, encumbrance, status, module_id, category, subcategory)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const npcSheet of newNpcs) {
    const sheet = sheetByCharacterId.get(npcSheet.character_id)
    const tag = npcTagBy(sheet?.name ?? '', npcSheet.status)
    catalogNpcStmt.run(
      npcSheet.id,
      lang,
      sheet?.name ?? null,
      sheet?.bio ?? null,
      sheet?.backstory ?? null,
      sheet?.points ?? null,
      sheet?.hp ?? null,
      sheet?.st ?? null,
      sheet?.dx ?? null,
      sheet?.iq ?? null,
      sheet?.ht ?? null,
      sheet?.fatigue ?? null,
      sheet?.encumbrance ?? null,
      npcSheet.status,
      tag.moduleId ?? null,
      tag.category ?? null,
      tag.subcategory ?? null
    )
  }

  // locations: catálogo e mesa compartilham nível/caminho calculados a
  // partir da própria árvore de variáveis (pai antes do filho não é
  // garantido, então resolvemos recursivamente).
  const locationById = new Map(modifierTableLocations.map((loc) => [loc.id, loc]))
  const locationLevelPath = new Map<string, { level: number; path: string }>()
  const resolveLocation = (loc: (typeof modifierTableLocations)[number]): { level: number; path: string } => {
    const cached = locationLevelPath.get(loc.id)
    if (cached) return cached
    const parent = loc.parent_id ? locationById.get(loc.parent_id) : undefined
    const resolved = parent
      ? (() => {
          const p = resolveLocation(parent)
          return { level: p.level + 1, path: `${p.path}${loc.id}/`.replace(/\/{2,}/g, '/') }
        })()
      : { level: 0, path: `/${loc.id}/` }
    locationLevelPath.set(loc.id, resolved)
    return resolved
  }

  const catalogLocationStmt = db.prepare(`
    INSERT INTO content_locations
      (id, lang, parent_id, kind, level, path, name, region, address, sub_region, is_indoor, other, country, area, dimensions, description,
       hex_size_m, width_hexes, height_hexes, center_q, center_r, orientation, rotation_deg, is_battlemap, shop_name, tiles, drawing)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const loc of modifierTableLocations) {
    const { level, path } = resolveLocation(loc)
    const hexSizeM = loc.hex_size_m ?? null
    const isBattlemap = loc.is_battlemap ?? (hexSizeM != null && hexSizeM <= 2 ? 1 : 0)
    catalogLocationStmt.run(
      loc.id,
      lang,
      loc.parent_id ?? null,
      loc.kind ?? 'site',
      level,
      path,
      loc.name,
      loc.region ?? null,
      loc.address ?? null,
      loc.sub_region ?? null,
      loc.is_indoor ?? 0,
      loc.other ?? null,
      loc.country ?? null,
      loc.area ?? null,
      loc.dimensions ?? null,
      loc.description ?? null,
      hexSizeM,
      loc.width_hexes ?? null,
      loc.height_hexes ?? null,
      loc.center_q ?? 0,
      loc.center_r ?? 0,
      loc.orientation ?? 'flat',
      loc.rotation_deg ?? 0,
      isBattlemap,
      loc.shop_name ?? null,
      JSON.stringify(loc.tiles ?? []),
      JSON.stringify(loc.drawing ?? [])
    )
  }

  // insert game tables (com os kits da língua já instalados)
  const gameTableStmt = db.prepare(`
    INSERT INTO game_tables (id, lang, narrator_id, intro , title, system, modules)
    VALUES (?, ?, ?, ? , ?, ?, ?)
  `)

  const installedModules = JSON.stringify(V.contentModules.map((module) => module.id))

  for (const table of gameTables) {
    gameTableStmt.run(table.id, lang, table.narratorId, table.intro , table.title, table.system, installedModules)
  }

  // insert table settings (configurações padrão de cada mesa, por língua)
  const tableSettingsStmt = db.prepare(`
    INSERT INTO game_table_settings (table_id, lang, turn_end_mode, item_mode, reaction_mode, gm_adds_item, money_item_id, starting_shop, starting_points)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const table of gameTables) {
    tableSettingsStmt.run(table.id, lang, 'after_test', 'gm', 'gm', 1, null, 0, 150)
  }

  // insert characters (is_active=0 significa preso na mesa mas desativado/fora de jogo)
  const characterStmt = db.prepare(`
    INSERT INTO game_table_characters (id, user_id, table_id, is_active)
    VALUES (?, ?, ?, ?)
  `)

  const characterIds = new Set<string>()
  for (const character of characters) {
    characterStmt.run(character.id, character.userId, character.tableId, character.isActive === false ? 0 : 1)
    characterIds.add(character.id)
  }

  // insert character equipment (estado do personagem)
  const equipmentStmt = db.prepare(`
    INSERT INTO character_equipment (id, character_id, item_id, quantity, status, location, rendered_st)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  for (const eq of characterEquipment) {
    equipmentStmt.run(
      eq.id,
      eq.character_id,
      eq.item_id,
      eq.quantity,
      eq.status,
      eq.location,
      eq.rendered_st
    )
  }

  // insert game table players (ligação mesa<->usuário; ids por variante)
  const gameTablePlayerStmt = db.prepare(`
    INSERT INTO game_table_players (id, table_id, user_id)
    VALUES (?, ?, ?)
  `)

  for (const entry of gameTablePlayers) {
    gameTablePlayerStmt.run(entry.id, entry.tableId, entry.userId)
  }

  // insert npcs (status/categoria; ficha vive em game_table_character_sheets)
  const npcSheetStmt = db.prepare(`
    INSERT INTO game_table_npcs (id, character_id , status, module_id, category, subcategory)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const npcSheetNameByCharacter = new Map(
    characterSheets.map((s) => [s.characterId, s.name])
  )

  for (const npcSheet of newNpcs) {
    const tag = npcTagBy(npcSheetNameByCharacter.get(npcSheet.character_id) ?? '', npcSheet.status)
    npcSheetStmt.run(
      npcSheet.id,
      npcSheet.character_id,
      npcSheet.status,
      tag.moduleId ?? null,
      tag.category ?? null,
      tag.subcategory ?? null
    )
  }

  // insert advantages (etiquetadas com módulo + categoria GURPS)
  const advantageStmt = db.prepare(`
    INSERT INTO game_table_advantages (id, lang, table_id , name , cost_points, description, module_id, category, subcategory)
    VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?)
  `)

  for (const advantage of advantages) {
    const tag = advantageTagBy(advantage.name)
    advantageStmt.run(
      advantage.id,
      lang,
      advantage.table_id,
      advantage.name,
      advantage.costPoints,
      advantage.description,
      tag.moduleId,
      tag.category,
      tag.subcategory ?? null
    )
  }

  const disadvantageStmt = db.prepare(`
    INSERT INTO game_table_disadvantages (id, lang, table_id , name, cost_points, description, module_id, category, subcategory)
    VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?)
  `)

  for (const disadvantage of disadvantages) {
    const tag = disadvantageTagBy(disadvantage.name)
    disadvantageStmt.run(
      disadvantage.id,
      lang,
      disadvantage.table_id,
      disadvantage.name,
      disadvantage.costPoints,
      disadvantage.description,
      tag.moduleId,
      tag.category,
      tag.subcategory ?? null
    )
  }

  // insert skills (etiquetadas com módulo + categoria GURPS)
  const skillStmt = db.prepare(`
    INSERT INTO game_table_skills (id, lang, table_id , name, predefinition_type , predefinition_difficulty , description, module_id, category, subcategory)
    VALUES (?, ?, ? , ?, ?, ? , ?, ?, ?, ?)
  `)

  const skillIds = new Set<string>()
  for (const skill of skills) {
    const tag = skillTag[skill.name] ?? { moduleId: 'fantasy', category: 'survival', subcategory: 'wilderness' }
    skillStmt.run(skill.id , lang, skill.table_id , skill.name, skill.predefinition_type , skill.predefinition_difficulty, skill.description, tag.moduleId, tag.category, tag.subcategory ?? null)
    skillIds.add(skill.id)
  }

  // insert character sheets
  const characterSheetStmt = db.prepare(`
    INSERT INTO game_table_character_sheets (id, lang, character_id, name, bio, backstory, points, hp, st, dx, iq, ht, fatigue, encumbrance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const sheet of characterSheets) {
    characterSheetStmt.run(
      sheet.id,
      lang,
      sheet.characterId,
      sheet.name,
      sheet.bio,
      sheet.backstory,
      sheet.points,
      sheet.hp,
      sheet.st,
      sheet.dx,
      sheet.iq,
      sheet.ht,
      sheet.fatigue,
      sheet.encumbrance
    )
  }

  // character images (retrato + corpo inteiro, arte placeholder gerada)
  const characterImageStmt = db.prepare(`
    INSERT INTO game_table_character_images (id, character_id, url, role, sort)
    VALUES (?, ?, ?, ?, ?)
  `)
  for (const sheet of characterSheets) {
    if (!sheet.characterId) continue
    const displayName = sheet.name || 'Personagem'
    characterImageStmt.run(crypto.randomUUID(), sheet.characterId, portraitAsset(displayName, lang), 'portrait', 0)
    characterImageStmt.run(crypto.randomUUID(), sheet.characterId, bodyAsset(displayName, lang), 'body', 0)
  }

  // insert items (etiquetadas com módulo + subcategoria)
  const itemStmt = db.prepare(`
    INSERT INTO game_table_items (id, lang, table_id , name, kind, category, weight_lb, cost, dimensions, description, quality, condition, module_id, subcategory, tech_level)
    VALUES (?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const item of items) {
    const tag = itemTagBy(item)
    itemStmt.run(
      item.id,
      lang,
      item.table_id,
      item.name,
      item.kind,
      item.category,
      item.weight_lb,
      item.cost,
      item.dimensions,
      item.description,
      item.quality,
      item.condition,
      tag.moduleId,
      tag.subcategory,
      item.tech_level ?? null
    )
  }

  // item images (ícone placeholder por item)
  const itemImageStmt = db.prepare(`
    INSERT INTO item_images (id, item_id, url, role, sort)
    VALUES (?, ?, ?, ?, ?)
  `)
  for (const item of items) {
    itemImageStmt.run(crypto.randomUUID(), item.id, itemAsset(item.name || 'Item', lang), 'icon', 0)
  }

  // insert weapons (específico de arma)
  const weaponStmt = db.prepare(`
    INSERT INTO game_table_weapons (id, lang, item_id, skill, min_st, rated_st, handedness, reach, parry, block, fit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const weapon of weapons) {
    weaponStmt.run(
      weapon.id,
      lang,
      weapon.item_id,
      weapon.skill,
      weapon.min_st,
      weapon.rated_st,
      weapon.handedness,
      weapon.reach,
      weapon.parry,
      weapon.block,
      weapon.fit
    )
  }

  // insert weapon attacks (formas de ataque por arma)
  const weaponAttackStmt = db.prepare(`
    INSERT INTO weapon_attacks (id, lang, weapon_id, name, usage, damage_source, damage_modifier, damage_dice, damage_type, armor_penetration, accuracy, range, recoil, shots)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const attack of weaponAttacks) {
    weaponAttackStmt.run(
      attack.id,
      lang,
      attack.weapon_id,
      attack.name,
      attack.usage,
      attack.damage_source,
      attack.damage_modifier,
      attack.damage_dice,
      attack.damage_type,
      attack.armor_penetration,
      attack.accuracy,
      attack.range,
      attack.recoil,
      attack.shots
    )
  }

  // insert armors (específico de armadura, agora ancorado no item)
  const armorStmt = db.prepare(`
    INSERT INTO game_table_armors (id, lang, item_id, dr, flex, locations, fit)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  for (const armor of armors) {
    armorStmt.run(
      armor.id,
      lang,
      armor.item_id,
      armor.dr,
      armor.flex,
      armor.locations,
      armor.fit
    )
  }

  // insert character skills
  const characterSkillStmt = db.prepare(`
    INSERT INTO game_table_character_skills (id, lang, character_id, skill_id, cost_points, effect)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  for (const characterSkill of characterSkills) {
    characterSkillStmt.run(
      characterSkill.id,
      lang,
      characterSkill.characterId,
      characterSkill.skillId,
      characterSkill.costPoints,
      characterSkill.effect
    )
  }

  // insert peculiarities
  const peculiarityStmt = db.prepare(`
    INSERT INTO game_table_characters_quirks (id, lang, character_id, name, cost_points, effect)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  for (const peculiarity of peculiarities) {
    peculiarityStmt.run(
      peculiarity.id,
      lang,
      peculiarity.character_id,
      peculiarity.name,
      peculiarity.costPoints,
      peculiarity.effect
    )
  }

  // insert scenes (títulos por variante; ids inline por língua)
  const modifierSceneStmt = db.prepare(`
    INSERT INTO scenes(id, lang, table_id , title , chapter , moment)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  for (const modifierScene of scenes ) {
    modifierSceneStmt.run(modifierScene.id, lang, modifierScene.table_id , modifierScene.title, modifierScene.chapter, modifierScene.moment)
  }

  // insert narrations (referenciam scenes da MESMA variante)
  const modifierNarrationstmt = db.prepare(`
    INSERT INTO narrations(id, lang, table_id, title , scene_id , narration, moment)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  for (const modifierNarration of narrations) {
    modifierNarrationstmt.run(modifierNarration.id, lang, modifierNarration.table_id, modifierNarration.title , modifierNarration.scene_id, modifierNarration.narration, modifierNarration.moment)
  }

  // insert locations (árvore de território + grade hexagonal)
  const modifierTableLocationstmt = db.prepare(`
    INSERT INTO table_locations(id, lang, table_id, parent_id, kind, level, path,
      name, region, address, sub_region, is_indoor, other, country, area, dimensions, description,
        hex_size_m, width_hexes, height_hexes, center_q, center_r, orientation, rotation_deg, is_battlemap,
      shop_name, tiles, drawing, bg_image_url, floor, floor_name )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const locationIds = new Set<string>()
  for (const modifierTableLocation of modifierTableLocations) {
    locationIds.add(modifierTableLocation.id)
    const { level, path } = resolveLocation(modifierTableLocation)
    const hexSizeM = modifierTableLocation.hex_size_m ?? null
    const isBattlemap = modifierTableLocation.is_battlemap ?? (hexSizeM != null && hexSizeM <= 2 ? 1 : 0)
    const bgImage = isBattlemap
      ? backdropAsset(modifierTableLocation.name || 'Mapa', `${lang}-${modifierTableLocation.id}`)
      : null
    modifierTableLocationstmt.run(
      modifierTableLocation.id,
      lang,
      modifierTableLocation.table_id,
      modifierTableLocation.parent_id ?? null,
      modifierTableLocation.kind ?? 'site',
      level,
      path,
      modifierTableLocation.name,
      modifierTableLocation.region ?? null,
      modifierTableLocation.address ?? null,
      modifierTableLocation.sub_region ?? null,
      modifierTableLocation.is_indoor ?? 0,
      modifierTableLocation.other ?? null,
      modifierTableLocation.country ?? null,
      modifierTableLocation.area ?? null,
      modifierTableLocation.dimensions ?? null,
      modifierTableLocation.description ?? null,
      hexSizeM,
      modifierTableLocation.width_hexes ?? null,
      modifierTableLocation.height_hexes ?? null,
      modifierTableLocation.center_q ?? 0,
      modifierTableLocation.center_r ?? 0,
      modifierTableLocation.orientation ?? 'flat',
      modifierTableLocation.rotation_deg ?? 0,
      isBattlemap,
      modifierTableLocation.shop_name ?? null,
      JSON.stringify(modifierTableLocation.tiles ?? []),
      JSON.stringify(modifierTableLocation.drawing ?? []),
      bgImage,
      modifierTableLocation.floor ?? null,
      modifierTableLocation.floor_name ?? null
    )
  }

  // insert location connections (portas/escadas/alçapões entre plantas)
  const modifierLocationConnectionStmt = db.prepare(`
    INSERT INTO location_connections (
      id, lang, table_id, from_location_id, to_location_id,
      kind, label, from_q, from_r, to_q, to_r,
      floor_from, floor_to, bidirectional, sort, direction, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const connectionIds = new Set<string>()
  for (const connection of modifierTableLocationConnections) {
    const fromOk = locationIds.has(connection.from_location_id)
    const toOk = locationIds.has(connection.to_location_id)
    if (!fromOk || !toOk) {
      console.warn(
        `[seed:location_connections][${lang}] conexão ${connection.id} ignorada: ` +
          `from=${connection.from_location_id} (${fromOk}) to=${connection.to_location_id} (${toOk})`
      )
      continue
    }
    connectionIds.add(connection.id)
    modifierLocationConnectionStmt.run(
      connection.id,
      lang,
      connection.table_id,
      connection.from_location_id,
      connection.to_location_id,
      connection.kind ?? 'door',
      connection.label ?? null,
      connection.from_q ?? 0,
      connection.from_r ?? 0,
      connection.to_q ?? 0,
      connection.to_r ?? 0,
      connection.floor_from ?? null,
      connection.floor_to ?? null,
      connection.bidirectional ?? 1,
      connection.sort ?? 0,
      connection.direction ?? null,
      connection.description ?? null
    )
  }

  // showcase do organograma: liga cada battlemap ao seu local-pai como porta,
  // quando ainda não houver conexão entre os dois.
  const existingConnectionKeys = new Set(
    modifierTableLocationConnections.map((c) => `${c.from_location_id}|${c.to_location_id}`)
  )
  for (const loc of modifierTableLocations) {
    const isBattle = loc.is_battlemap ?? ((loc.hex_size_m ?? null) != null && (loc.hex_size_m ?? 0) <= 2)
    if (!loc.parent_id || !isBattle) continue
    const key = `${loc.id}|${loc.parent_id}`
    const reverse = `${loc.parent_id}|${loc.id}`
    if (existingConnectionKeys.has(key) || existingConnectionKeys.has(reverse)) continue
    modifierLocationConnectionStmt.run(
      crypto.randomUUID(), lang, loc.table_id, loc.id, loc.parent_id,
      'door', null, 0, 0, 0, 0, null, null, 1, 0, null, null
    )
    existingConnectionKeys.add(key)
  }

  // ---- LOJAS POR LOCAL ----
  // Uma loja é o local com `shop_name` preenchido; a prateleira é o item do
  // catálogo ligado ao local (`location_id`). O seed abre a loja do mercado
  // com estoque para o narrador encontrar a aba já funcionando.
  const shopLocations = db
    .prepare(
      `SELECT id, lang, table_id FROM table_locations
       WHERE shop_name IS NOT NULL AND shop_name != '' AND lang = ?`
    )
    .all(lang) as Array<{ id: string; lang: string; table_id: string }>

  const shopStockStmt = db.prepare(`
    INSERT INTO location_shop_items
      (id, lang, table_id, location_id, item_id, price, stock, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `)

  for (const shop of shopLocations) {
    // As peças com preço, das mais caras para as mais baratas: a prateleira
    // abre com o que a loja realmente vende.
    const wares = db
      .prepare(
        `SELECT id, cost FROM game_table_items
         WHERE table_id = ? AND lang = ? AND location_id IS NULL AND cost IS NOT NULL AND cost > 0
         ORDER BY cost DESC, name COLLATE NOCASE ASC
         LIMIT 6`
      )
      .all(shop.table_id, shop.lang) as Array<{ id: string; cost: number }>

    wares.forEach((ware, index) => {
      db.prepare(`UPDATE game_table_items SET location_id = ? WHERE id = ? AND lang = ?`).run(
        shop.id,
        ware.id,
        shop.lang
      )
      // As três primeiras peças são estoque contado; o resto é ilimitado
      // (-1), como uma loja que repõe do dia seguinte.
      shopStockStmt.run(
        crypto.randomUUID(),
        shop.lang,
        shop.table_id,
        shop.id,
        ware.id,
        ware.cost,
        index < 3 ? 3 : -1,
        null
      )
    })
  }

  // character advantages (nome/efeito por variante)
  const advantageNameById = new Map(advantages.map((advantage) => [advantage.id, advantage.name]))

  const modifierGameTableCharacterAdvantagestmt = db.prepare(`
    INSERT INTO game_table_character_advantages(
    id,
    lang,
    advantage_id,
    name,
    character_id,
    cost_points,
    effect
    )
    VALUES ( ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const modifierGameTableCharacterAdvantage of characterAdvantages) {
    modifierGameTableCharacterAdvantagestmt.run(
      modifierGameTableCharacterAdvantage.id,
      lang,
      modifierGameTableCharacterAdvantage.advantage_id,
      advantageNameById.get(modifierGameTableCharacterAdvantage.advantage_id) ?? modifierGameTableCharacterAdvantage.name,
      modifierGameTableCharacterAdvantage.character_id,
      modifierGameTableCharacterAdvantage.cost_points,
      modifierGameTableCharacterAdvantage.effect
    )
  }

  const disadvantageNameById = new Map(
    disadvantages.map((disadvantage) => [disadvantage.id, disadvantage.name])
  )

  const modifierGameTableCharacterDisadvantagestmt = db.prepare(`
    INSERT INTO game_table_character_disadvantages(
    id,
    lang,
    disadvantage_id,
    name,
    character_id,
    cost_points,
    effect
    )
    VALUES ( ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const modifierGameTableCharacterDisadvantage of characterDisadvantages) {
    modifierGameTableCharacterDisadvantagestmt.run(
      modifierGameTableCharacterDisadvantage.id,
      lang,
      modifierGameTableCharacterDisadvantage.disadvantage_id,
      disadvantageNameById.get(modifierGameTableCharacterDisadvantage.disadvantage_id ?? '') ?? modifierGameTableCharacterDisadvantage.name,
      modifierGameTableCharacterDisadvantage.character_id,
      modifierGameTableCharacterDisadvantage.cost_points,
      modifierGameTableCharacterDisadvantage.effect
    )
  }

  // narration_actions (associam actions às narrations da MESMA variante)
  const modifierNarrationsActionstmt = db.prepare(`
    INSERT INTO narration_actions(id, narrations_id, queue, result, dice_roll, description, character_id, modificator, target, multitarget, location_id, q, r, facing)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const modifierNarrationAction of modifierNarrationsActions) {
    modifierNarrationsActionstmt.run(modifierNarrationAction.id, modifierNarrationAction.narrations_id, modifierNarrationAction.queue , modifierNarrationAction.result, modifierNarrationAction.dice_roll, modifierNarrationAction.description, modifierNarrationAction.character_id, modifierNarrationAction.modificator, modifierNarrationAction.target, Number(modifierNarrationAction.multitarget), modifierNarrationAction.location_id ?? null, modifierNarrationAction.q ?? null, modifierNarrationAction.r ?? null, modifierNarrationAction.facing ?? null)
  }

  /* cada action segue a etapa de tempo (moment) da sua narration */
  db.prepare(`
    UPDATE narration_actions
    SET moment = COALESCE(
      (SELECT n.moment FROM narrations n WHERE n.id = narration_actions.narrations_id),
      moment
    )
    WHERE moment IS NULL
  `).run()

  // narration_characters (token de personagem nas narrations)
  const modifierNarrationsCharacterstmt = db.prepare(`
    INSERT INTO narration_characters(id, character_id, narrations_id, conscious, q, r, facing)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  for (const modifierNarrationCharacter of modifierNarrationsCharacters) {
    modifierNarrationsCharacterstmt.run(modifierNarrationCharacter.id, modifierNarrationCharacter.character_id, modifierNarrationCharacter.narrations_id, modifierNarrationCharacter.conscious !== false ? 1 : 0, modifierNarrationCharacter.q ?? null, modifierNarrationCharacter.r ?? null, modifierNarrationCharacter.facing ?? null)
  }

  // narration_locations (associa locations às narrations)
  const modifierNarrationsLocationstmt = db.prepare(`
    INSERT INTO narration_locations(id, location_id, narrations_id)
    VALUES (?, ?, ?)
  `)

  for (const modifierNarrationsLocation of modifierNarrationsLocations) {
    modifierNarrationsLocationstmt.run(modifierNarrationsLocation.id, modifierNarrationsLocation.location_id, modifierNarrationsLocation.narrations_id)
  }

  // narration_npcs (token de npc nas narrations; ids por variante)
  const modifierNarrationsNpcStmt = db.prepare(`
    INSERT INTO narration_npcs(id, narration_id, npc_id, q, r, facing)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  for (const modifierNarrationsNPC of modifierNarrationsNPCs) {
    modifierNarrationsNpcStmt.run(modifierNarrationsNPC.id, modifierNarrationsNPC.narration_id, modifierNarrationsNPC.npc_id, modifierNarrationsNPC.q ?? null, modifierNarrationsNPC.r ?? null, modifierNarrationsNPC.facing ?? null)
  }

  // skill dependecies (grafia original do domínio)
  const modifierGameTableSkillDependencystmt = db.prepare(`
    INSERT INTO game_table_skill_dependencies(
    id,
    origin_skill_id,
    depends_on_skill_id,
    depends_on_skill_value,
    depends_type
    )
    VALUES (?, ?, ?, ?, ?)
  `)

  for (const modifierGameTableSkillDependency of modifierGameTableSkillsDependecies) {
      modifierGameTableSkillDependencystmt.run(
        modifierGameTableSkillDependency.id,
        modifierGameTableSkillDependency.origin_skill_id,
        modifierGameTableSkillDependency.depends_on_skill_id,
        modifierGameTableSkillDependency.depends_on_skill_value,
        modifierGameTableSkillDependency.depends_type
      )
  }

  // skill predefinitions
  const modifierGameTableSkillPreDeterminedstmt = db.prepare(`
    INSERT INTO game_table_skill_predefinede(
    id,
    origin_skill_id,
    depends_on_skill_id,
    depends_on_skill_value,
    depends_on_skill_for_others_attributes
    )
    VALUES (?, ?, ?, ? , ? )
  `)

  for (const modifierGameTableSkillDependency of modifierGameTableSkillsPreDetermined) {
    modifierGameTableSkillPreDeterminedstmt.run(
      modifierGameTableSkillDependency.id,
      modifierGameTableSkillDependency.origin_skill_id,
      modifierGameTableSkillDependency.depends_on_skill_id,
      modifierGameTableSkillDependency.depends_on_skill_value,
      modifierGameTableSkillDependency.depends_on_skill_for_others_attributes
    )
  }

  // modifiers (efeitos pré-aplicados de skills/itens das narrations)
  const modifierStmt = db.prepare(`
    INSERT INTO modifiers(
    id, character_id, action_id, narration_id,
    name, description,
    mod_hp, mod_st, mod_dx, mod_iq, mod_ht, mod_fatigue,
    damage_value, skill_value, item_quantity, item_weight
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const modifier of modifierSeedEntries) {
    modifierStmt.run(
      modifier.id,
      modifier.character_id,
      modifier.action_id,
      modifier.narration_id,
      modifier.name,
      modifier.description,
      modifier.mod_hp ?? null,
      modifier.mod_st ?? null,
      modifier.mod_dx ?? null,
      modifier.mod_iq ?? null,
      modifier.mod_ht ?? null,
      modifier.mod_fatigue ?? null,
      modifier.damage_value ?? null,
      modifier.skill_value ?? null,
      modifier.item_quantity ?? null,
      modifier.item_weight ?? null
    )
  }

  // insert visibility (conhecimento inicial de cada jogador do mundo)
  const visibilityStmt = db.prepare(`
    INSERT INTO visibility (id, character_id, other_character_id, skill_id, advantage_id, disadvantage_id, attribute, additionals_attributes, item_id, location_id, connection_id, value, status, scene_id, narration_id, moment, previous_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const visibility of visibilityRules) {
    const visibilityRuleId = visibility.id
    const visibilityCharacterId = visibility.character_id
    const visibilityOtherCharacterId = visibility.other_character_id
    const visibilitySkillId = visibility.skill_id ?? null
    const visibilityAdvantageId = visibility.advantage_id ?? null
    const visibilityDisadvantageId = visibility.disadvantage_id ?? null
    const visibilityItemId = visibility.item_id ?? null
    const visibilityLocationId = visibility.location_id ?? null
    const visibilityConnectionId = visibility.connection_id ?? null
    const hasVisibilityParents =
      (visibilityCharacterId == null || characterIds.has(visibilityCharacterId)) &&
      (visibilityOtherCharacterId == null || characterIds.has(visibilityOtherCharacterId)) &&
      (visibilitySkillId == null || skillIds.has(visibilitySkillId)) &&
      (visibilityLocationId == null || locationIds.has(visibilityLocationId)) &&
      (visibilityConnectionId == null || connectionIds.has(visibilityConnectionId))
    if (!hasVisibilityParents) {
      console.warn(
        `[seed:visibility][${lang}] regra ${visibilityRuleId} ignorada: pai nao existe ` +
          `(character_id=${visibilityCharacterId ?? '-'} other_character_id=${visibilityOtherCharacterId ?? '-'} ` +
          `skill_id=${visibilitySkillId ?? '-'} location_id=${visibilityLocationId ?? '-'} connection_id=${visibilityConnectionId ?? '-'})`
      )
      continue
    }
    visibilityStmt.run(
      visibility.id,
      visibility.character_id,
      visibility.other_character_id ?? null,
      null,
      null,
      null,
      visibility.attribute ?? null,
      visibility.additionals_attributes ?? null,
      visibility.item_id ?? null,
      visibility.location_id ?? null,
      visibility.connection_id ?? null,
      visibility.value,
      visibility.status,
      null,
      null,
      null,
      null
    )
  }
}

// Os kits e o catálogo já foram semeados por idioma dentro do loop das
// variantes. As mesas de exemplo apenas instalam esses kits (modules) e
// recebem linhas com os mesmos ids — nada é derivado das mesas aqui.

// weapon -> skill: as armas e itens acabaram de ser reinseridos sem skill_id.
// Resolve aqui, ainda dentro da transação, para a ficha já nascer com o
// vínculo arma->perícia (a migration roda antes do wipe e não adianta).
const weaponSkills = resolveWeaponSkills()
if (weaponSkills.resolved || weaponSkills.unresolved) {
  console.log(
    `🔗 weapon->skill (seed): ${weaponSkills.resolved} resolvida(s), ${weaponSkills.unresolved} sem match`
  )
}

db.exec('COMMIT')
db.exec('PRAGMA foreign_keys = ON')

console.log(`🌱 Seed executed successfully! (${variants.map((v) => v.lang.toUpperCase()).join(' + ')})`)