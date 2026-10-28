import { db } from '../../infra/database/database'
import crypto from 'crypto'

import { assertCharacterNotMuted } from './playerMuteGuard'

import type {
  GameTableWithNarrator,
  GameTablePlayerWithCharacter,
  GameTableScenes,
  GameTableWithScenes
} from '../types/GameTableTypes'

import type { IGameTableRepository } from '../irepositories/IGameTableRepository'

import { GameTable } from '../entities/GameTable'
import { GameTableDBStrings } from './queryStrings/GameTableDBStrings'

type GameTableWithPlayers = GameTableWithNarrator & {
  players: GameTablePlayerWithCharacter[]
}

export class GameTableRepository implements IGameTableRepository {
  async create(gameTable: GameTable): Promise<void> {
    db.prepare(GameTableDBStrings.GameTableCreateNew as string).run(
      gameTable.id,
      gameTable.narratorId,
      gameTable.title,
      gameTable.system,
      gameTable.intro
    )
  }

  async findAll(): Promise<GameTableWithNarrator[]> {
    const rows = db.prepare(GameTableDBStrings.GameTableFindAll as string).all() as any[]

    if (!rows?.length) {
      return []
    }

    const tables = new Map<string, GameTableWithPlayers>()

    for (const row of rows) {
      let table = tables.get(row.table_id)

      if (!table) {
        table = {
          id: row.table_id,
          narratorId: row.table_narrator_id,
          intro: row.table_intro,
          title: row.table_title,
          system: row.table_system || undefined,
          modules: this.parseModules(row.table_modules),
          narrator: {
            id: row.narrator_id,
            userId: row.narrator_user_id,
            name: row.narrator_name,
            username: row.user_username,
            email: row.user_email,
            phone: row.user_phone,
            type: row.user_type
          },
          players: []
        }

        tables.set(row.table_id, table)
      }

      if (!row.player_user_id) {
        continue
      }

      let player = table.players.find((entry) => entry.userId === row.player_user_id)

      if (!player) {
        player = {
          userId: row.player_user_id,
          username: row.player_username ?? null,
          character: null
        }

        table.players.push(player)
      }

      if (row.character_id && !player.character) {
        player.character = {
          id: row.character_id,
          userId: row.character_user_id,
          name: row.sheet_name ?? '',
          sheet: row.sheet_id
            ? {
                id: row.sheet_id,
                name: row.sheet_name ?? undefined,
                points: row.sheet_points ?? undefined,
                hp: row.sheet_hp ?? undefined,
                current_hp: row.sheet_hp ?? undefined,
                modifiers: []
              }
            : null,
          armors: [],
          equipment: [],
          items: [],
          advantages: [],
          disadvantages: [],
          skills: [],
          peculiarities: []
        }
      }

      const sheet = player.character?.sheet

      if (sheet && row.modifier_id && !sheet.modifiers!.some((mod) => mod.id === row.modifier_id)) {
        sheet.modifiers!.push({
          id: row.modifier_id,
          name: row.modifier_name ?? undefined,
          description: row.modifier_description ?? undefined,
          mod_hp: row.modifier_mod_hp ?? undefined,
          mod_st: row.modifier_mod_st ?? undefined,
          mod_dx: row.modifier_mod_dx ?? undefined,
          mod_iq: row.modifier_mod_iq ?? undefined,
          mod_ht: row.modifier_mod_ht ?? undefined,
          mod_fatigue: row.modifier_mod_fatigue ?? undefined
        })
      }
    }

    const result = Array.from(tables.values())

    for (const table of result) {
      for (const player of table.players) {
        const sheet = player.character?.sheet
        if (!sheet) continue
        const totalMod = (sheet.modifiers ?? []).reduce((acc, mod) => acc + (mod.mod_hp ?? 0), 0)
        sheet.current_hp = (sheet.hp ?? 0) + totalMod
      }
    }

    return result
  }

  async findById(id: string): Promise<GameTableWithNarrator | null> {
    const rows = db.prepare(GameTableDBStrings.GameTableFindById).all(id) as any[]

    if (!rows?.length) return null

    const first = rows[0]

    const result: GameTableWithPlayers = {
      id: first.table_id,
      narratorId: first.table_narrator_id,
      intro: first.table_intro,
      title: first.table_title,
      system: first.table_system || undefined,
      modules: this.parseModules(first.table_modules),
      narrator: {
        id: first.narrator_id,
        userId: first.narrator_user_id,
        name: first.narrator_name,
        username: first.user_username,
        email: first.user_email,
        phone: first.user_phone,
        type: first.user_type
      },
      players: []
    }

    for (const row of rows) {
      if (!row.player_user_id) {
        continue
      }

      let player = result.players.find((entry) => entry.userId === row.player_user_id)

      if (!player) {
        player = {
          userId: row.player_user_id,
          username: row.player_username ?? null,
          character: null
        }

        result.players.push(player)
      }

      if (!row.character_id || player.character) {
        continue
      }

      player.character = {
        id: row.character_id,
        userId: row.character_user_id,
        name: row.character_name ?? '',
        sheet: row.sheet_id
          ? {
            id: row.sheet_id,
            name: row.sheet_name,
            bio: row.sheet_bio,
            backstory: row.sheet_backstory,
            points: row.sheet_points,
            hp: row.sheet_hp,
            st: row.sheet_st,
            dx: row.sheet_dx,
            iq: row.sheet_iq,
            ht: row.sheet_ht,
            fatigue: row.sheet_fatigue,
            encumbrance: row.sheet_encumbrance
          }
          : null,
        armors: [],
        equipment: [],
        items: [],
        advantages: [],
        disadvantages: [],
        skills: [],
        peculiarities: []
      }

      const character = player.character

      if (row.item_id && !character.items.some((item) => item.id === row.item_id)) {
        character.items.push({
          id: row.item_id,
          name: row.item_name,
          kind: row.item_kind,
          category: row.item_category,
          weight: row.item_weight,
          cost: row.item_cost,
          description: row.item_description,
          quality: row.item_quality,
          condition: row.item_condition,
          techLevel: row.item_tech_level,
          weaponId: row.weapon_id,
          armorId: row.armor_id,
          equipment: {
            id: row.item_equipment_id,
            quantity: row.item_equipment_quantity,
            status: row.item_equipment_status,
            location: row.item_equipment_location,
            renderedSt: row.item_equipment_rendered_st
          }
        })
      }

      if (row.advantage_id && !character.advantages.some((adv) => adv.id === row.advantage_id)) {
        character.advantages.push({
          id: row.advantage_id,
          name: row.advantage_name,
          costPoints: row.advantage_cost_points,
          effect: row.advantage_effect
        })
      }

      if (row.character_skill_id && !character.skills.some((skill) => skill.id === row.character_skill_id)) {
        character.skills.push({
          id: row.character_skill_id,
          skillId: row.character_skill_skill_id,
          costPoints: row.character_skill_cost_points,
          effect: row.character_skill_effect
        })
      }

      if (row.peculiarity_id && !character.peculiarities.some((item) => item.id === row.peculiarity_id)) {
        character.peculiarities.push({
          id: row.peculiarity_id,
          name: row.peculiarity_name,
          costPoints: row.peculiarity_cost_points,
          effect: row.peculiarity_effect
        })
      }
    }

    return result
  }

  async findBySceneId(sceneId: string): Promise<GameTableScenes> {
    const rows = db.prepare(GameTableDBStrings.GameTableFindBySceneId as string).all(sceneId) as any[]

    if (!rows.length) {
      return {
        id: sceneId,
        title: '',
        narrations: []
      }
    }

    return this.mapSceneRows(rows)[0]!
  }

  async findByAllScenes(tableId: string): Promise<GameTableWithScenes> {
    /* Consultas independentes por dimensão — evita o produto cartesiano
       que a antiga query única com 15 LEFT JOINs produzia. */
    const sceneRows = db.prepare(GameTableDBStrings.GameScenesAndNarrations as string).all(tableId) as any[]

    const table = await this.findTableById(tableId)

    if (!sceneRows.length) {
      return {
        table,
        scenes: []
      }
    }

    const actionRows = db.prepare(GameTableDBStrings.GameNarrationActions as string).all(tableId) as any[]
    const characterRows = db.prepare(GameTableDBStrings.GameNarrationCharacters as string).all(tableId) as any[]
    const npcRows = db.prepare(GameTableDBStrings.GameNarrationNpcs as string).all(tableId) as any[]
    const locationRows = db.prepare(GameTableDBStrings.GameNarrationLocations as string).all(tableId) as any[]

    return {
      table,
      scenes: this.buildScenes(sceneRows, actionRows, characterRows, npcRows, locationRows)
    }
  }

  private buildScenes(
    sceneRows: any[],
    actionRows: any[],
    characterRows: any[],
    npcRows: any[],
    locationRows: any[]
  ): GameTableScenes[] {
    const scenesMap = new Map<string, any>()
    const narrationIndex = new Map<string, any>()

    /* SCENES + NARRATIONS */
    for (const row of sceneRows) {
      let scene = scenesMap.get(row.scene_id)
      if (!scene) {
        scene = {
          id: row.scene_id,
          chapter: row.scene_chapter,
          moment: row.scene_moment,
          title: row.scene_title,
          imageUrl: row.scene_image_url ?? null,
          narrations: new Map<string, any>()
        }
        scenesMap.set(row.scene_id, scene)
      }

      if (!row.narration_id || scene.narrations.has(row.narration_id)) continue

      const narration = {
        id: row.narration_id,
        sceneId: row.narration_scene_id,
        title: row.narration_title,
        narration: row.narration_text,
        moment: row.narration_moment,
        actions: [] as any[],
        characters: new Map<string, any>(),
        npcs: new Map<string, any>(),
        location: null as any
      }
      scene.narrations.set(row.narration_id, narration)
      narrationIndex.set(row.narration_id, narration)
    }

    /* ACTIONS (+ character + modifier) */
    for (const row of actionRows) {
      const narration = narrationIndex.get(row.narration_id)
      if (!narration || !row.action_id) continue
      if (narration.actions.some((action: any) => action.id === row.action_id)) continue

      const modifier = row.modifier_id
        ? {
            id: row.modifier_id,
            name: row.modifier_name,
            description: row.modifier_description,
            effect: row.modifier_effect,
            hp: row.modifier_hp,
            st: row.modifier_st,
            dx: row.modifier_dx,
            iq: row.modifier_iq,
            ht: row.modifier_ht,
            fatigue: row.modifier_fatigue,
            mod_hp: row.modifier_mod_hp,
            mod_st: row.modifier_mod_st,
            mod_dx: row.modifier_mod_dx,
            mod_iq: row.modifier_mod_iq,
            mod_ht: row.modifier_mod_ht,
            mod_fatigue: row.modifier_mod_fatigue,
            damage_value: row.modifier_damage_value,
            skill_value: row.modifier_skill_value,
            item_quantity: row.modifier_item_quantity,
            item_weight: row.modifier_item_weight
          }
        : null

      narration.actions.push({
        id: row.action_id,
        queue: row.action_queue,
        moment: row.action_moment != null ? Number(row.action_moment) : null,
        result: row.action_result,
        description: row.action_description,
        dice_roll: row.action_dice_roll,
        locationId: row.action_location_id ?? null,
        q: row.action_q != null ? Number(row.action_q) : null,
        r: row.action_r != null ? Number(row.action_r) : null,
        facing: row.action_facing != null ? Number(row.action_facing) : null,
        character: row.action_character_id
          ? {
              id: row.action_character_id,
              name: row.action_character_name,
              userId: row.action_character_user_id,
              username: row.action_character_username
            }
          : null,
        modifier
      })
    }

    /* NARRATION CHARACTERS */
    for (const row of characterRows) {
      const narration = narrationIndex.get(row.narration_id)
      if (!narration || !row.narration_character_id) continue
      if (narration.characters.has(row.narration_character_id)) continue
      narration.characters.set(row.narration_character_id, {
        id: row.narration_character_ref_id,
        name: row.narration_character_name,
        userId: row.narration_character_user_id,
        username: row.narration_character_username,
        conscious: row.narration_character_conscious != null ? !!row.narration_character_conscious : true,
        q: row.narration_character_q != null ? Number(row.narration_character_q) : null,
        r: row.narration_character_r != null ? Number(row.narration_character_r) : null,
        facing: row.narration_character_facing != null ? Number(row.narration_character_facing) : null
      })
    }

    /* NARRATION NPCS */
    for (const row of npcRows) {
      const narration = narrationIndex.get(row.narration_id)
      if (!narration || !row.narration_npc_link_id) continue
      if (narration.npcs.has(row.narration_npc_link_id)) continue
      narration.npcs.set(row.narration_npc_link_id, {
        id: row.narration_npc_id,
        characterId: row.narration_npc_character_id,
        name: row.narration_npc_name,
        status: row.narration_npc_status,
        q: row.narration_npc_q != null ? Number(row.narration_npc_q) : null,
        r: row.narration_npc_r != null ? Number(row.narration_npc_r) : null,
        facing: row.narration_npc_facing != null ? Number(row.narration_npc_facing) : null
      })
    }

    /* NARRATION LOCATION */
    for (const row of locationRows) {
      const narration = narrationIndex.get(row.narration_id)
      if (!narration || narration.location || !row.location_id) continue
      narration.location = {
        id: row.location_id,
        name: row.location_name,
        parentId: row.location_parent_id ?? null,
        kind: row.location_kind ?? null,
        level: row.location_level != null ? Number(row.location_level) : null,
        path: row.location_path ?? null,
        region: row.location_region,
        subRegion: row.location_sub_region,
        address: row.location_address,
        isIndoor: !!row.location_is_indoor,
        country: row.location_country,
        area: row.location_area,
        dimensions: row.location_dimensions,
        description: row.location_description,
        other: row.location_other,
        hex: row.location_width_hexes != null || row.location_height_hexes != null
          ? {
              sizeM: row.location_hex_size_m != null ? Number(row.location_hex_size_m) : null,
              width: row.location_width_hexes != null ? Number(row.location_width_hexes) : null,
              height: row.location_height_hexes != null ? Number(row.location_height_hexes) : null,
              centerQ: row.location_center_q != null ? Number(row.location_center_q) : null,
              centerR: row.location_center_r != null ? Number(row.location_center_r) : null,
              orientation: row.location_orientation ?? 'flat',
              rotationDeg: row.location_rotation_deg != null ? Number(row.location_rotation_deg) : 0
            }
          : null,
        isBattlemap: !!row.location_is_battlemap,
        shopName: null,
        tiles: this.parseJsonArray(row.location_tiles),
        drawing: this.parseJsonArray(row.location_drawing)
      }
    }

    return Array.from(scenesMap.values()).map((scene) => ({
      id: scene.id,
      chapter: scene.chapter,
      moment: scene.moment,
      title: scene.title,
      imageUrl: scene.imageUrl ?? null,
      narrations: Array.from(scene.narrations.values())
        .sort((a: any, b: any) => (a.moment ?? 0) - (b.moment ?? 0))
        .map((narration: any) => ({
          id: narration.id,
          sceneId: narration.sceneId,
          title: narration.title,
          narration: narration.narration,
          moment: narration.moment,
          actions: narration.actions,
          characters: Array.from(narration.characters.values()),
          npcs: Array.from(narration.npcs.values()),
          location: narration.location
        }))
    })) as unknown as GameTableScenes[]
  }

  private mapSceneRows(rows: any[]): GameTableScenes[] {
    const scenesMap = new Map<
      string,
      {
        id: string
        chapter: number
        moment: number
        title: string
        narrations: Map<
          string,
          {
            id: string
            sceneId: string
            title: string
            narration: string
            moment: number
            actions: Array<{
              id: string
              queue: number
              moment: number | null
              result: string
              description: string
              dice_roll: string
              locationId: string | null
              q: number | null
              r: number | null
              facing: number | null
              character: { id: string; name: string; userId: string; username: string } | null
              modifier: any
            }>
            characters: Map<
              string,
              {
                id: string
                name: string
                userId: string
                username: string
                conscious: boolean
                q: number | null
                r: number | null
                facing: number | null
              }
            >
            npcs: Map<
              string,
              {
                id: string
                characterId: string
                name: string
                status: string
                q: number | null
                r: number | null
                facing: number | null
              }
            >,
            location: {
              id: string
              name: string
              parentId: string | null
              kind: string | null
              level: number | null
              path: string | null
              region: string
              subRegion: string
              address: string
              isIndoor: boolean
              country: string
              area: string
              dimensions: string
              description: string
              other: string
              hex: {
                sizeM: number | null
                width: number | null
                height: number | null
                centerQ: number | null
                centerR: number | null
                orientation: string | null
                rotationDeg: number | null
              } | null
              isBattlemap: boolean
              shopName: string | null
              tiles: any[]
              drawing: any[]
            } | null
          }
        >
      }
    >()

    for (const row of rows) {
      // SCENE
      if (!scenesMap.has(row.scene_id)) {
        scenesMap.set(row.scene_id, {
          id: row.scene_id,
          title: row.scene_title,
          chapter: row.scene_chapter,
          moment: row.scene_moment,
          narrations: new Map()
        })
      }

      const scene = scenesMap.get(row.scene_id)!

      // sem narration, ignora
      if (!row.narration_id) continue

      // NARRATION
      if (!scene.narrations.has(row.narration_id)) {
        scene.narrations.set(row.narration_id, {
          id: row.narration_id,
          sceneId: row.narration_scene_id,
          title: row.narration_title,
          narration: row.narration_text,
          moment: row.narration_moment,
            actions: [],
            characters: new Map(),
          npcs: new Map(),
          location:  null
        })
      }

      const narration = scene.narrations.get(row.narration_id)!

      // ACTIONS (sem duplicar)
      if (
        row.action_id &&
        !narration.actions.some((action) => action.id === row.action_id)
      ) {
        const modifier = row.modifier_id
          ? {
              id: row.modifier_id,
              name: row.modifier_name,
              description: row.modifier_description,
              effect: row.modifier_effect,
              hp: row.modifier_hp,
              st: row.modifier_st,
              dx: row.modifier_dx,
              iq: row.modifier_iq,
              ht: row.modifier_ht,
              fatigue: row.modifier_fatigue,
              mod_hp: row.modifier_mod_hp,
              mod_st: row.modifier_mod_st,
              mod_dx: row.modifier_mod_dx,
              mod_iq: row.modifier_mod_iq,
              mod_ht: row.modifier_mod_ht,
              mod_fatigue: row.modifier_mod_fatigue,
              damage_value: row.modifier_damage_value,
              skill_value: row.modifier_skill_value,
              item_quantity: row.modifier_item_quantity,
              item_weight: row.modifier_item_weight
            }
          : null

        narration.actions.push({
          id: row.action_id,
          queue: row.action_queue,
          moment: row.action_moment != null ? Number(row.action_moment) : null,
          result: row.action_result,
          description: row.action_description,
          dice_roll: row.action_dice_roll,
          locationId: row.action_location_id ?? null,
          q: row.action_q != null ? Number(row.action_q) : null,
          r: row.action_r != null ? Number(row.action_r) : null,
          facing: row.action_facing != null ? Number(row.action_facing) : null,
          character: row.action_character_id
            ? {
              id: row.action_character_id,
              name: row.action_character_name,
              userId: row.action_character_user_id,
              username: row.action_character_username
            }
            : null,
          modifier
        })
      }

      // CHARACTERS (narration_characters) sem duplicar
      if (
        row.narration_character_id &&
        !narration.characters.has(row.narration_character_id)
      ) {
        narration.characters.set(row.narration_character_id, {
          id: row.narration_character_ref_id,
          name: row.narration_character_name,
          userId: row.narration_character_user_id,
          username: row.narration_character_username,
          conscious: row.narration_character_conscious != null ? !!row.narration_character_conscious : true,
          q: row.narration_character_q != null ? Number(row.narration_character_q) : null,
          r: row.narration_character_r != null ? Number(row.narration_character_r) : null,
          facing: row.narration_character_facing != null ? Number(row.narration_character_facing) : null
        })
      }

      if (
        row.narration_npc_link_id &&
        !narration.npcs.has(row.narration_npc_link_id)
      ) {
        narration.npcs.set(row.narration_npc_link_id, {
          id: row.narration_npc_id,
          characterId: row.narration_npc_character_id,
          name: row.narration_npc_name,
          status: row.narration_npc_status,
          q: row.narration_npc_q != null ? Number(row.narration_npc_q) : null,
          r: row.narration_npc_r != null ? Number(row.narration_npc_r) : null,
          facing: row.narration_npc_facing != null ? Number(row.narration_npc_facing) : null
        })
      }

      if (
        row.location_id &&
        !narration.location
      ) {
        narration.location = {
          id: row.location_id,
          name: row.location_name,
          parentId: row.location_parent_id ?? null,
          kind: row.location_kind ?? null,
          level: row.location_level != null ? Number(row.location_level) : null,
          path: row.location_path ?? null,
          region: row.location_region,
          subRegion: row.location_sub_region,
          address: row.location_address,
          isIndoor: !!row.location_is_indoor,
          country: row.location_country,
          area: row.location_area,
          dimensions: row.location_dimensions,
          description: row.location_description,
          other: row.location_other,
          hex: row.location_width_hexes != null || row.location_height_hexes != null
            ? {
                sizeM: row.location_hex_size_m != null ? Number(row.location_hex_size_m) : null,
                width: row.location_width_hexes != null ? Number(row.location_width_hexes) : null,
                height: row.location_height_hexes != null ? Number(row.location_height_hexes) : null,
                centerQ: row.location_center_q != null ? Number(row.location_center_q) : null,
                centerR: row.location_center_r != null ? Number(row.location_center_r) : null,
                orientation: row.location_orientation ?? 'flat',
                rotationDeg: row.location_rotation_deg != null ? Number(row.location_rotation_deg) : 0
              }
            : null,
          isBattlemap: !!row.location_is_battlemap,
          shopName: null,
          tiles: this.parseJsonArray(row.location_tiles),
          drawing: this.parseJsonArray(row.location_drawing)
        }
      }
    }

    return Array.from(scenesMap.values()).map((scene) => ({
      id: scene.id,
      chapter: scene.chapter,
      moment: scene.moment,
      title: scene.title,
      narrations: Array.from(scene.narrations.values())
        .sort((a, b) => (a.moment ?? 0) - (b.moment ?? 0)) // ✅ ordenação aqui
        .map((narration) => ({
          id: narration.id,
          sceneId: narration.sceneId,
          title: narration.title,
          narration: narration.narration,
          moment: narration.moment,
          actions: narration.actions,
          characters: Array.from(narration.characters.values()) as any,
          npcs: Array.from(narration.npcs.values()) as any,
          location: narration.location
        }))
    }))
  }

  async findTableById(tableId: string): Promise<GameTable | null> {
    const row = db.prepare(GameTableDBStrings.GameTableFindTableById as string).get(tableId) as any

    if (!row) return null

    return {
      id: row.id,
      narratorId: row.narrator_id,
      title: row.title,
      system: row.table_system, 
      intro: row.intro,
      modules: this.parseModules(row.modules)
    }
  }

  private parseModules(raw: string | null): string[] {
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  private parseJsonArray(raw: string | null): any[] {
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  async edit(gameTable: GameTable): Promise<void> {
    db.prepare(GameTableDBStrings.GameTableEdit as string).run(
      gameTable.title,
      gameTable.intro,
      gameTable.system,
      gameTable.id
    ) 
  }

  async createScene(data: any): Promise<void> {
    db.prepare(GameTableDBStrings.SceneCreate as string).run(
      data.id,
      data.table_id,
      data.title,
      data.chapter,
      data.moment,
      data.image_url ?? null
    )
  }

  async setSceneImage(id: string, imageUrl: string | null): Promise<void> {
    db.prepare(GameTableDBStrings.SceneSetImage as string).run(imageUrl ?? null, id)
  }

  async getSceneTableId(id: string): Promise<string | null> {
    const row = db.prepare(GameTableDBStrings.SceneTableId as string).get(id) as any
    return row?.table_id ?? null
  }

  async updateScene(data: any): Promise<void> {
    db.prepare(GameTableDBStrings.SceneUpdate as string).run(
      data.title ?? null,
      data.chapter ?? null,
      data.moment ?? null,
      data.image_url ?? null,
      data.id
    )
  }

  async editNarrationAction(id: string, data: any): Promise<any> {
    const exists: any = db.prepare('SELECT id FROM narration_actions WHERE id = ?').get(id)
    if (!exists) throw new Error('Action not found')
    db.prepare(`
      UPDATE narration_actions SET
        queue = ?, result = ?, description = ?, target = ?, multitarget = ?,
        dice_roll = ?, modificator = ?, q = ?, r = ?, facing = ?
      WHERE id = ?
    `).run(
      data.queue ?? 0,
      data.result ?? null,
      data.description ?? null,
      data.target ?? null,
      data.multitarget ? 1 : 0,
      data.dice_roll ?? null,
      data.modificator ?? null,
      data.q != null ? Math.round(data.q) : null,
      data.r != null ? Math.round(data.r) : null,
      data.facing ?? 0,
      id
    )
    return { success: true, id }
  }

  async deleteNarrationAction(id: string): Promise<any> {
    const exists: any = db.prepare('SELECT id FROM narration_actions WHERE id = ?').get(id)
    if (!exists) throw new Error('Action not found')
    db.prepare('DELETE FROM narration_actions WHERE id = ?').run(id)
    return { success: true, id }
  }

  async duplicateNarrationAction(id: string): Promise<any> {
    const action: any = db.prepare('SELECT * FROM narration_actions WHERE id = ?').get(id)
    if (!action) throw new Error('Action not found')
    const copyId = crypto.randomUUID()
    db.prepare(GameTableDBStrings.NarrationActionCreate as string).run(
      copyId,
      action.narrations_id,
      action.queue ?? 0,
      action.moment ?? 0,
      action.result ?? null,
      action.dice_roll ?? null,
      action.modificator ?? null,
      action.target ?? null,
      action.multitarget ? 1 : 0,
      `${action.description ?? 'Action'} (cópia)`,
      action.character_id ?? null,
      action.location_id ?? null,
      action.q != null ? Math.round(action.q) : null,
      action.r != null ? Math.round(action.r) : null,
      action.facing ?? 0
    )
    return { success: true, id: copyId }
  }

  async createNarration(data: any): Promise<void> {
    const insertTransaction = db.transaction((): void => {
      db.prepare(GameTableDBStrings.NarrationCreate as string).run(
        data.id,
        data.table_id,
        data.scene_id,
        data.title,
        data.narration,
        data.moment ?? 0
      )

      if (data.location_id) {
        db.prepare(`
          INSERT INTO narration_locations (id, location_id, narrations_id)
          VALUES (?, ?, ?)
        `).run(crypto.randomUUID(), data.location_id, data.id)
      }

      const present = Array.isArray(data.present) ? data.present : []
      for (const p of present) {
        const characterId = p?.character_id
        if (!characterId) continue
        const npc = db.prepare(`
          SELECT id FROM game_table_npcs WHERE character_id = ?
        `).get(characterId) as any
        if (npc) {
          db.prepare(`
            INSERT INTO narration_npcs (id, narration_id, npc_id, q, r, facing)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            crypto.randomUUID(),
            data.id,
            npc.id,
            p.q != null ? Math.round(p.q) : null,
            p.r != null ? Math.round(p.r) : null,
            p.facing ?? 0
          )
        } else {
          db.prepare(`
            INSERT INTO narration_characters (id, character_id, narrations_id, conscious, q, r, facing)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(
            crypto.randomUUID(),
            characterId,
            data.id,
            p.conscious === false ? 0 : 1,
            p.q != null ? Math.round(p.q) : null,
            p.r != null ? Math.round(p.r) : null,
            p.facing ?? 0
          )
        }
      }

      const presentNpcs = Array.isArray(data.present_npcs) ? data.present_npcs : []
      for (const entry of presentNpcs) {
        const npcId = typeof entry === 'string' ? entry : entry?.id
        if (!npcId) continue
        db.prepare(`
          INSERT INTO narration_npcs (id, narration_id, npc_id, q, r, facing)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          crypto.randomUUID(),
          data.id,
          npcId,
          typeof entry !== 'string' && entry?.q != null ? Math.round(entry.q) : null,
          typeof entry !== 'string' && entry?.r != null ? Math.round(entry.r) : null,
          typeof entry !== 'string' && entry?.facing != null ? entry.facing : 0
        )
      }
    })
    insertTransaction()
  }

  async createNarrationAction(data: any): Promise<void> {
    assertCharacterNotMuted(data.character_id)
    let locationId = data.location_id ?? null
    if (!locationId && data.narrations_id) {
      const bound = db.prepare(`
        SELECT location_id FROM narration_locations WHERE narrations_id = ? LIMIT 1
      `).get(data.narrations_id) as any
      if (bound?.location_id) locationId = bound.location_id
    }
    if (!locationId && data.character_id) {
      const owner = db.prepare(`
        SELECT table_id FROM game_table_characters WHERE id = ?
      `).get(data.character_id) as any
      if (owner?.table_id) {
        const table = db.prepare(`
          SELECT default_location_id FROM game_tables WHERE id = ?
        `).get(owner.table_id) as any
        if (table?.default_location_id) locationId = table.default_location_id
      }
    }
    /* cada action segue a etapa de tempo (moment) da sua narration */
    let moment = data.moment ?? null
    if (moment == null && data.narrations_id) {
      const bound = db.prepare(`
        SELECT moment FROM narrations WHERE id = ?
      `).get(data.narrations_id) as any
      if (bound?.moment != null) moment = bound.moment
    }
    db.prepare(GameTableDBStrings.NarrationActionCreate as string).run(
      data.id,
      data.narrations_id,
      data.queue ?? 0,
      moment ?? 0,
      data.result ?? null,
      data.dice_roll ?? null,
      data.modificator ?? null,
      data.target ?? null,
      data.multitarget ? 1 : 0,
      data.description ?? null,
      data.character_id ?? null,
      locationId,
      data.q != null ? Math.round(data.q) : null,
      data.r != null ? Math.round(data.r) : null,
      data.facing ?? 0
    )
  }

  async getNarrationTableId(narrationsId: string): Promise<string | null> {
    const row: any = db.prepare('SELECT table_id FROM narrations WHERE id = ?').get(narrationsId)
    return row?.table_id ?? null
  }

  async readNarrationAction(id: string): Promise<any> {
    return db.prepare('SELECT * FROM narration_actions WHERE id = ?').get(id) ?? null
  }
}
