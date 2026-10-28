export const GameTableDBStrings:any = {
    /* ============================================================
       Scenes: antes era UMA query com 15 LEFT JOINs (scenes ×
       narrations × actions × modifiers × characters × npcs ×
       locations), o que produzia um produto cartesiano gigante.
       Agora cada dimensão é lida em sua própria query (bounded) e o
       repositório remonta a mesma estrutura aninhada em memória.
       ============================================================ */
    GameScenesAndNarrations: `
      SELECT
        s.id AS scene_id,
        s.chapter AS scene_chapter,
        s.moment AS scene_moment,
        s.title AS scene_title,
        s.image_url AS scene_image_url,
        n.id AS narration_id,
        n.scene_id AS narration_scene_id,
        n.title AS narration_title,
        n.narration AS narration_text,
        n.moment AS narration_moment
      FROM scenes s
      LEFT JOIN narrations n ON n.scene_id = s.id
      WHERE s.table_id = ?
      ORDER BY s.chapter ASC, s.moment ASC, n.moment ASC, n.rowid ASC
    `,
    GameNarrationActions: `
      SELECT
        na.narrations_id AS narration_id,
        na.id AS action_id,
        na.queue AS action_queue,
        na.moment AS action_moment,
        na.character_id AS action_character_id,
        na.description AS action_description,
        na.dice_roll AS action_dice_roll,
        na.result AS action_result,
        na.location_id AS action_location_id,
        na.q AS action_q,
        na.r AS action_r,
        na.facing AS action_facing,
        cas.name AS action_character_name,
        au.id AS action_character_user_id,
        au.username AS action_character_username,
        m.id AS modifier_id,
        m.name AS modifier_name,
        m.description AS modifier_description,
        m.effect AS modifier_effect,
        m.hp AS modifier_hp,
        m.st AS modifier_st,
        m.dx AS modifier_dx,
        m.iq AS modifier_iq,
        m.ht AS modifier_ht,
        m.fatigue AS modifier_fatigue,
        m.mod_hp AS modifier_mod_hp,
        m.mod_st AS modifier_mod_st,
        m.mod_dx AS modifier_mod_dx,
        m.mod_iq AS modifier_mod_iq,
        m.mod_ht AS modifier_mod_ht,
        m.mod_fatigue AS modifier_mod_fatigue,
        m.damage_value AS modifier_damage_value,
        m.skill_value AS modifier_skill_value,
        m.item_quantity AS modifier_item_quantity,
        m.item_weight AS modifier_item_weight
      FROM narration_actions na
      JOIN narrations n ON n.id = na.narrations_id
      JOIN scenes s ON s.id = n.scene_id
      LEFT JOIN game_table_characters ca ON ca.id = na.character_id
      LEFT JOIN game_table_character_sheets cas ON cas.character_id = ca.id
      LEFT JOIN users au ON au.id = ca.user_id
      LEFT JOIN modifiers m ON m.action_id = na.id
      WHERE s.table_id = ?
      ORDER BY na.queue ASC, na.id ASC, m.rowid ASC
    `,
    GameNarrationCharacters: `
      SELECT
        nc.narrations_id AS narration_id,
        nc.id AS narration_character_link_id,
        nc.character_id AS narration_character_id,
        cn.id AS narration_character_ref_id,
        cns.name AS narration_character_name,
        cnu.id AS narration_character_user_id,
        cnu.username AS narration_character_username,
        nc.conscious AS narration_character_conscious,
        nc.q AS narration_character_q,
        nc.r AS narration_character_r,
        nc.facing AS narration_character_facing
      FROM narration_characters nc
      JOIN narrations n ON n.id = nc.narrations_id
      JOIN scenes s ON s.id = n.scene_id
      LEFT JOIN game_table_characters cn ON cn.id = nc.character_id
      LEFT JOIN game_table_character_sheets cns ON cns.character_id = cn.id
      LEFT JOIN users cnu ON cnu.id = cn.user_id
      WHERE s.table_id = ?
      ORDER BY nc.id ASC
    `,
    GameNarrationNpcs: `
      SELECT
        nn.narration_id AS narration_id,
        nn.id AS narration_npc_link_id,
        npc.id AS narration_npc_id,
        npc.character_id AS narration_npc_character_id,
        npc.status AS narration_npc_status,
        nn.q AS narration_npc_q,
        nn.r AS narration_npc_r,
        nn.facing AS narration_npc_facing,
        c_npc.id AS narration_npc_ref_id,
        npc_cs.name AS narration_npc_name
      FROM narration_npcs nn
      JOIN narrations n ON n.id = nn.narration_id
      JOIN scenes s ON s.id = n.scene_id
      LEFT JOIN game_table_npcs npc ON npc.id = nn.npc_id
      LEFT JOIN game_table_characters c_npc ON c_npc.id = npc.character_id
      LEFT JOIN game_table_character_sheets npc_cs ON npc_cs.character_id = c_npc.id
      WHERE s.table_id = ?
      ORDER BY nn.id ASC
    `,
    GameNarrationLocations: `
      SELECT
        nl.narrations_id AS narration_id,
        nl.id AS narration_location_link_id,
        tl.id AS location_id,
        tl.name AS location_name,
        tl.parent_id AS location_parent_id,
        tl.kind AS location_kind,
        tl.level AS location_level,
        tl.path AS location_path,
        tl.region AS location_region,
        tl.sub_region AS location_sub_region,
        tl.address AS location_address,
        tl.is_indoor AS location_is_indoor,
        tl.country AS location_country,
        tl.area AS location_area,
        tl.dimensions AS location_dimensions,
        tl.description AS location_description,
        tl.other AS location_other,
        tl.hex_size_m AS location_hex_size_m,
        tl.width_hexes AS location_width_hexes,
        tl.height_hexes AS location_height_hexes,
        tl.center_q AS location_center_q,
        tl.center_r AS location_center_r,
        tl.orientation AS location_orientation,
        tl.rotation_deg AS location_rotation_deg,
        tl.is_battlemap AS location_is_battlemap,
        tl.tiles AS location_tiles,
        tl.drawing AS location_drawing
      FROM narration_locations nl
      JOIN narrations n ON n.id = nl.narrations_id
      JOIN scenes s ON s.id = n.scene_id
      LEFT JOIN table_locations tl ON tl.id = nl.location_id
      WHERE s.table_id = ?
      ORDER BY nl.id ASC
    `,
    GameTableCreateNew:`
      INSERT INTO game_tables (id, narrator_id, title, system , intro)
      VALUES (?, ?, ?, ?, ?)
    `,
    GameTableFindAll:`
      SELECT
        g.id AS table_id,
        g.narrator_id AS table_narrator_id,
        g.intro AS table_intro,
        g.title AS table_title,
        g.system AS table_system,
        g.modules AS table_modules,
        n.id AS narrator_id,
        n.user_id AS narrator_user_id,
        n.name AS narrator_name,
        u.username AS user_username,
        u.email AS user_email,
        u.phone AS user_phone,
        u.type AS user_type,
        p.id AS player_id,
        p.user_id AS player_user_id,
        pu.username AS player_username,
        c.id AS character_id,
        c.user_id AS character_user_id,
        cs.id AS sheet_id,
        cs.name AS sheet_name,
        cs.points AS sheet_points,
        cs.hp AS sheet_hp,
        m.id AS modifier_id,
        m.name AS modifier_name,
        m.description AS modifier_description,
        m.mod_hp AS modifier_mod_hp,
        m.mod_st AS modifier_mod_st,
        m.mod_dx AS modifier_mod_dx,
        m.mod_iq AS modifier_mod_iq,
        m.mod_ht AS modifier_mod_ht,
        m.mod_fatigue AS modifier_mod_fatigue
      FROM game_tables g
      JOIN narrators n ON g.narrator_id = n.id
      JOIN users u ON n.user_id = u.id
      LEFT JOIN game_table_players p ON p.table_id = g.id
      LEFT JOIN users pu ON pu.id = p.user_id
      LEFT JOIN game_table_characters c ON c.table_id = g.id AND c.user_id = p.user_id
      LEFT JOIN game_table_character_sheets cs ON cs.character_id = c.id
      LEFT JOIN modifiers m ON m.character_id = c.id
    `,
    GameTableFindById:`
      SELECT
        g.id AS table_id,
        g.narrator_id AS table_narrator_id,
        g.intro AS table_intro,
        g.title AS table_title,
        g.system AS table_system,
        g.modules AS table_modules,
        n.id AS narrator_id,
        n.user_id AS narrator_user_id,
        n.name AS narrator_name,
        u.username AS user_username,
        u.email AS user_email,
        u.phone AS user_phone,
        u.type AS user_type,
        p.id AS player_id,
        p.user_id AS player_user_id,
        pu.username AS player_username,
        c.id AS character_id,
        c.user_id AS character_user_id,
        cs.name AS character_name,
        cs.id AS sheet_id,
        cs.name AS sheet_name,
        cs.bio AS sheet_bio,
        cs.backstory AS sheet_backstory,
        cs.points AS sheet_points,
        cs.hp AS sheet_hp,
        cs.st AS sheet_st,
        cs.dx AS sheet_dx,
        cs.iq AS sheet_iq,
        cs.ht AS sheet_ht,
        cs.fatigue AS sheet_fatigue,
        cs.encumbrance AS sheet_encumbrance,
        ce.id AS item_equipment_id,
        ce.quantity AS item_equipment_quantity,
        ce.status AS item_equipment_status,
        ce.location AS item_equipment_location,
        ce.rendered_st AS item_equipment_rendered_st,
        i.id AS item_id,
        i.name AS item_name,
        i.kind AS item_kind,
        i.category AS item_category,
        i.weight_lb AS item_weight,
        i.cost AS item_cost,
        i.description AS item_description,
        i.quality AS item_quality,
        i.condition AS item_condition,
        i.tech_level AS item_tech_level,
        w.id AS weapon_id,
        ar.id AS armor_id,
        a.id AS advantage_id,
        a.name AS advantage_name,
        a.cost_points AS advantage_cost_points,
        a.effect AS advantage_effect,
        csk.id AS character_skill_id,
        csk.skill_id AS character_skill_skill_id,
        csk.cost_points AS character_skill_cost_points,
        csk.effect AS character_skill_effect,
        pec.id AS peculiarity_id,
        pec.name AS peculiarity_name,
        pec.cost_points AS peculiarity_cost_points,
        pec.effect AS peculiarity_effect
      FROM game_tables g
      JOIN narrators n ON g.narrator_id = n.id
      JOIN users u ON n.user_id = u.id
      LEFT JOIN game_table_players p ON p.table_id = g.id
      LEFT JOIN users pu ON pu.id = p.user_id
      LEFT JOIN game_table_characters c ON c.table_id = g.id AND c.user_id = p.user_id
      LEFT JOIN game_table_character_sheets cs ON cs.character_id = c.id
      LEFT JOIN character_equipment ce ON ce.character_id = c.id
      LEFT JOIN game_table_items i ON i.id = ce.item_id
      LEFT JOIN game_table_weapons w ON w.item_id = i.id
      LEFT JOIN game_table_armors ar ON ar.item_id = i.id
      LEFT JOIN game_table_character_advantages a ON a.character_id = c.id
      LEFT JOIN game_table_character_skills csk ON csk.character_id = c.id
      LEFT JOIN game_table_characters_quirks pec ON pec.character_id = c.id
      WHERE g.id = ?
    `,
    GameTableFindBySceneId:`
      SELECT
        s.id AS scene_id,
        s.table_id AS scene_table_id,
        n.id AS narration_id,
        n.scene_id AS narration_scene_id,
        n.table_id AS narration_table_id,
        n.narration AS narration_text,
        n.moment AS narration_moment,
        a.id AS action_id,
        a.queue AS action_queue,
        a.result AS action_result,
        a.description AS action_description,
        a.dice_roll AS action_dice_roll,
        a.character_id AS action_character_id,
        cs.id AS action_character_sheet_id,
        cs.name AS action_character_name,
        u.id AS action_character_user_id,
        u.username AS action_character_username
      FROM scenes s
      LEFT JOIN narrations n ON n.scene_id = s.id
      LEFT JOIN narration_actions a ON a.narrations_id = n.id
      LEFT JOIN game_table_characters c ON c.id = a.character_id
      LEFT JOIN game_table_character_sheets cs ON cs.character_id = c.id
      LEFT JOIN users u ON u.id = c.user_id
      WHERE s.id = ?
      ORDER BY n.moment ASC, n.rowid ASC, a.queue ASC
    `,
    GameTableFindTableById:`
      SELECT
        id,
        narrator_id,
        intro,
        title,
        system,
        modules
      FROM game_tables
      WHERE id = ?
    `,
    GameTableEdit:`
      UPDATE game_tables
      SET title = ?, intro = ?, system = ?
      WHERE id = ?
    `,
    SceneCreate:`
      INSERT INTO scenes (id, table_id, title, chapter, moment, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    NarrationCreate:`
      INSERT INTO narrations (id, table_id, scene_id, title, narration, moment)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    NarrationActionCreate:`
      INSERT INTO narration_actions (id, narrations_id, queue, moment, result, dice_roll, modificator, target, multitarget, description, character_id, location_id, q, r, facing)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    SceneSetImage:`
      UPDATE scenes SET image_url = ? WHERE id = ?
    `,
    SceneTableId:`
      SELECT table_id FROM scenes WHERE id = ? LIMIT 1
    `,
    SceneUpdate:`
      UPDATE scenes SET title = ?, chapter = ?, moment = ?, image_url = ? WHERE id = ?
    `,
}