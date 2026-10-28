// src/infra/variables-pt-br/varContentModules.ts
// Variante pt-BR da camada de conteúdo. Como cada variante é dona dos SEUS
// ids (bundles MainUUIDIds independentes), o "zip" entre variantes é feito
// por POSIÇÃO no array para skills/advantages/disadvantages (os arquivos
// pt-BR espelham a mesma ordem dos EN). Os ITEMS, porém, são autossuficientes:
// a pt-BR tem itens que não existem no EN, então a tag de item é derivada do
// próprio tech_level da peça (sem paridade posicional).

import {
  contentModules,
  contentCategories,
  skillTag as enSkillTag,
  advantageTagBy as enAdvantageTagBy,
  disadvantageTagBy as enDisadvantageTagBy,
  npcTagBy
} from '../variables/varContentModules'
import type { ContentTag } from '../variables/varContentModules'

import { skills as enSkills } from '../variables/varSkills'
import { advantages as enAdvantages } from '../variables/varAdvantages'
import { disadvantages as enDisadvantages } from '../variables/varDisadvantage'

import { skills } from './varSkills'
import { advantages } from './varAdvantages'
import { disadvantages } from './varDisadvantage'
import { items } from './varItems'

export { contentModules, contentCategories, npcTagBy }

type SkillTag = { category: string; subcategory: string | undefined; moduleId: string }

// =========================
// TAGS DE SKILLS (regra por nome; paridade via POSIÇÃO EN -> PT)
// =========================
export const skillTag: Record<string, SkillTag> = Object.fromEntries(
  skills
    .map((skill, index) => {
      const enName = enSkills[index]?.name
      const tag = enName ? enSkillTag[enName] : undefined
      return tag ? [skill.name, tag] : null
    })
    .filter((entry): entry is [string, SkillTag] => entry !== null)
)

// =========================
// TAGS DE ADVANTAGES (nome pt-BR -> tag EN pela posição no array)
// =========================
const ptAdvantageByName = new Map(advantages.map((advantage) => [advantage.name, advantage]))

const enAdvantageNameAt = (index: number): string | undefined => {
  const en = enAdvantages[index]
  return en ? en.name : undefined
}

export const advantageTagBy = (name: string): ContentTag => {
  const pt = ptAdvantageByName.get(name)
  if (pt) {
    const enName = enAdvantageNameAt(advantages.indexOf(pt))
    if (enName) return enAdvantageTagBy(enName)
  }
  return enAdvantageTagBy(name)
}

// =========================
// TAGS DE DISADVANTAGES (nome pt-BR -> tag EN pela posição no array)
// =========================
const ptDisadvantageByName = new Map(
  disadvantages.map((disadvantage) => [disadvantage.name, disadvantage])
)

const enDisadvantageNameAt = (index: number): string | undefined => {
  const en = enDisadvantages[index]
  return en ? en.name : undefined
}

export const disadvantageTagBy = (name: string): ContentTag => {
  const pt = ptDisadvantageByName.get(name)
  if (pt) {
    const enName = enDisadvantageNameAt(disadvantages.indexOf(pt))
    if (enName) return enDisadvantageTagBy(enName)
  }
  return enDisadvantageTagBy(name)
}

// =========================
// TAGS DE ITEMS (regra autossuficiente; módulo derivado do Nível Tecnológico)
// =========================
// A variante pt-BR é dona de itens que NÃO existem no EN, então não há mais
// paridade por posição. O módulo de cada linha passa a ser derivado do
// tech_level da própria peça (mesmas faixas dos contentModules):
//   TL0–3 -> fantasy | TL4 -> low-tech | TL5–7 -> mid-tech | TL8+ -> cyberpunk
const M = {
  fantasy: 'fantasy',
  lowTech: 'low-tech',
  midTech: 'mid-tech',
  cyberpunk: 'cyberpunk'
}

const techLevelByItemName = new Map(items.map((item) => [item.name, item.tech_level]))

const moduleIdForTechLevel = (techLevel: string | undefined): string => {
  const level = Number((techLevel ?? '').replace(/[^0-9]/g, ''))
  if (!techLevel || Number.isNaN(level)) return M.fantasy
  if (level >= 8) return M.cyberpunk
  if (level >= 5) return M.midTech
  if (level >= 4) return M.lowTech
  return M.fantasy
}

const itemSubcategory = (kind: string, category: string): string => {
  if (category === 'Clothing') return 'clothing'
  if (category === 'Consumable') return 'consumable'
  if (kind === 'weapon') return category === 'Ranged' ? 'ranged' : 'melee'
  if (kind === 'shield') return 'shield'
  if (kind === 'armor') return 'body'
  return 'gear'
}

export const itemTagBy = (item: { id: string; name: string; kind: string; category: string; tech_level?: string }): ContentTag => {
  const techLevel = techLevelByItemName.get(item.name) ?? item.tech_level
  return {
    moduleId: moduleIdForTechLevel(techLevel),
    category: item.category,
    subcategory: itemSubcategory(item.kind, item.category)
  }
}