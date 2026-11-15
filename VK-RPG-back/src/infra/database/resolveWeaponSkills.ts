// src/infra/database/resolveWeaponSkills.ts
// Resolve weapons.skill (texto solto, ex: 'Shortsword', 'Machado de Mão') para
// o id da skill da MESMA mesa/idioma e espelha em game_table_items.
//
// Precisa rodar DEPOIS das inserções: a migration também chama, mas o seed
// apaga e reinsere game_table_weapons/game_table_items no fim, então o seed
// chama de novo antes do COMMIT. Sem isso toda arma semeada fica com
// skill_id NULL (e a ficha não acha a perícia da arma).
import { db } from './database'

// Nomes usados nas armas que não batem 1:1 com o nome da perícia no catálogo.
// O seed EN e o PT têm grafias/variações diferentes; o alias mantém o vínculo
// funcionando sem renomear conteúdo autoral.
const skillAliases: Record<string, string> = {
  // EN
  Axe: 'Axe or Mace',
  'Guns (Pistol)': 'Guns',
  // PT
  Machado: 'Machado ou Maça',
  'Machado de Duas Mãos': 'Machado de Duas Mãos ou Maça',
  'Espada Longa': 'Espada Larga',
  Sabre: 'Esgrima',
  'Armas de Haste': 'Arma de Haste',
  'Armas de Fogo (Pistola)': 'Armas de Fogo',
  'Armas de Fogo (Revólver)': 'Armas de Fogo',
  'Armas de Fogo (Espingarda)': 'Armas de Fogo',
  'Armas de Fogo (Submetralhadora)': 'Armas de Fogo',
  'Armas de Fogo (Fuzil)': 'Armas de Fogo',
  'Armas de Fogo (Metralhadora)': 'Armas de Fogo'
}

export function resolveWeaponSkills(): { resolved: number; unresolved: number } {
  const skillCols = (db.prepare('PRAGMA table_info(game_table_skills)').all() as any[]).map(
    (c) => c.name
  )
  if (!skillCols.length) return { resolved: 0, unresolved: 0 }

  const findSkillByName = db.prepare(`
    SELECT id FROM game_table_skills
    WHERE table_id IS ? AND lang = ? AND name = ?
    LIMIT 1
  `)
  const pendingWeapons = db.prepare(`
    SELECT w.id, w.item_id, w.lang, w.skill, i.table_id
    FROM game_table_weapons w
    LEFT JOIN game_table_items i ON i.id = w.item_id AND i.lang = w.lang
    WHERE w.skill_id IS NULL AND w.skill IS NOT NULL AND w.skill != ''
  `).all() as any[]
  const setWeaponSkill = db.prepare(`UPDATE game_table_weapons SET skill_id = ? WHERE id = ? AND lang = ?`)
  const setItemSkill = db.prepare(`UPDATE game_table_items SET skill_id = ? WHERE id = ? AND lang = ?`)

  // Só preenche vazio: escolha manual feita no form não é sobrescrita, e o
  // script pode rodar quantas vezes quiser.
  const run = db.transaction(() => {
    let resolved = 0
    let unresolved = 0
    for (const w of pendingWeapons) {
      let skillId: string | undefined
      for (const candidate of [w.skill, skillAliases[w.skill]]) {
        if (!candidate) continue
        const row = findSkillByName.get(w.table_id, w.lang, candidate) as any
        if (row) {
          skillId = row.id
          break
        }
      }
      if (!skillId) {
        unresolved++
        continue
      }
      setWeaponSkill.run(skillId, w.id, w.lang)
      if (w.item_id) setItemSkill.run(skillId, w.item_id, w.lang)
      resolved++
    }
    return { resolved, unresolved }
  })

  return run()
}
