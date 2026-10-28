// src/infra/variables/varContentModules.ts
// ---------------------------------------------------------------------
// CAMADA DE CONTEÚDO (módulos/pacotes GURPS)
// ---------------------------------------------------------------------
// Módulos são PACOTES de campanha. Cada linha de catálogo (skill, item,
// advantage, disadvantage, npc) carrega:
//   module_id      -> pacote "dono" da linha (para quick-select no wizard)
//   category       -> categoria raiz (taxonomia GURPS)
//   subcategory    -> subdivisão da categoria (pode ser null)
// A seleção final instalada numa mesa é a UNIÃO entre:
//   (a) linhas cujo module_id está nos módulos escolhidos, e
//   (b) linhas cujas categorias/subcategorias foram marcadas manualmente.
// ---------------------------------------------------------------------

export type ContentModuleSeed = {
  id: string
  slug: string
  name: string
  techLevel: string
  description: string
  accent: string
  sort: number
}

export type ContentCategorySeed = {
  id: string
  domain: string
  parentId: string | null
  name: string
  displayName: string
  sort: number
}

export type ContentTag = {
  moduleId: string
  category: string
  subcategory: string | undefined
}

// =========================
// MÓDULOS
// =========================
export const contentModules: ContentModuleSeed[] = [
  {
    id: 'fantasy',
    slug: 'fantasy',
    name: 'Módulo Básico',
    techLevel: 'TL0–3',
    description: 'O kit básico do GURPS: reinos, heróis, magia e aventura. Combate, magia e o essencial para qualquer mesa clássica — pronto para jogar.',
    accent: '#a78bfa',
    sort: 1
  },
  {
    id: 'low-tech',
    slug: 'low-tech',
    name: 'Aventuras Antigas',
    techLevel: 'TL0–4',
    description: 'O kitbr histórico e realista antes da pólvora: ofícios rústicos, animais, vela e primitivismo.',
    accent: '#fbbf24',
    sort: 2
  },
  {
    id: 'mid-tech',
    slug: 'mid-tech',
    name: 'Pólvora & Vapor',
    techLevel: 'TL5–7',
    description: 'Rifles, telégrafos, automóveis, mecânica e os primeiros computadores.',
    accent: '#f97316',
    sort: 3
  },
  {
    id: 'cyberpunk',
    slug: 'cyberpunk',
    name: 'Cyberpunk & Espaço',
    techLevel: 'TL8–9',
    description: 'Armeiros de feixe, trajes de combate, genética, espionagem e navegação estelar.',
    accent: '#22d3ee',
    sort: 4
  }
]

// =========================
// ÁRVORE DE CATEGORIAS
// =========================
export const contentCategories: ContentCategorySeed[] = [
  // ---- SKILLS ----
  { id: 'cat-skill-combat', domain: 'skill', parentId: null, name: 'combat', displayName: 'Combate', sort: 1 },
  { id: 'cat-skill-combat-melee', domain: 'skill', parentId: 'cat-skill-combat', name: 'melee', displayName: 'Armas Brancas', sort: 1 },
  { id: 'cat-skill-combat-ranged', domain: 'skill', parentId: 'cat-skill-combat', name: 'ranged', displayName: 'Armas de Projétil', sort: 2 },
  { id: 'cat-skill-combat-unarmed', domain: 'skill', parentId: 'cat-skill-combat', name: 'unarmed', displayName: 'Desarmado', sort: 3 },
  { id: 'cat-skill-combat-defense', domain: 'skill', parentId: 'cat-skill-combat', name: 'defense', displayName: 'Defesa', sort: 4 },

  { id: 'cat-skill-military', domain: 'skill', parentId: null, name: 'military', displayName: 'Militar', sort: 2 },
  { id: 'cat-skill-military-command', domain: 'skill', parentId: 'cat-skill-military', name: 'command', displayName: 'Comando', sort: 1 },
  { id: 'cat-skill-military-intelligence', domain: 'skill', parentId: 'cat-skill-military', name: 'intelligence', displayName: 'Inteligência', sort: 2 },

  { id: 'cat-skill-survival', domain: 'skill', parentId: null, name: 'survival', displayName: 'Sobrevivência', sort: 3 },
  { id: 'cat-skill-survival-wilderness', domain: 'skill', parentId: 'cat-skill-survival', name: 'wilderness', displayName: 'Natureza', sort: 1 },
  { id: 'cat-skill-survival-animals', domain: 'skill', parentId: 'cat-skill-survival', name: 'animals', displayName: 'Animais', sort: 2 },
  { id: 'cat-skill-survival-athletics', domain: 'skill', parentId: 'cat-skill-survival', name: 'athletics', displayName: 'Atletismo', sort: 3 },

  { id: 'cat-skill-medical', domain: 'skill', parentId: null, name: 'medical', displayName: 'Medicina', sort: 4 },

  { id: 'cat-skill-social', domain: 'skill', parentId: null, name: 'social', displayName: 'Social', sort: 5 },
  { id: 'cat-skill-social-communication', domain: 'skill', parentId: 'cat-skill-social', name: 'communication', displayName: 'Comunicação', sort: 1 },
  { id: 'cat-skill-social-languages', domain: 'skill', parentId: 'cat-skill-social', name: 'languages', displayName: 'Idiomas', sort: 2 },

  { id: 'cat-skill-craft', domain: 'skill', parentId: null, name: 'craft', displayName: 'Ofícios', sort: 6 },

  { id: 'cat-skill-technical', domain: 'skill', parentId: null, name: 'technical', displayName: 'Técnica', sort: 7 },

  { id: 'cat-skill-vehicle', domain: 'skill', parentId: null, name: 'vehicle', displayName: 'Veículos', sort: 8 },

  { id: 'cat-skill-science', domain: 'skill', parentId: null, name: 'science', displayName: 'Ciências', sort: 9 },

  { id: 'cat-skill-business', domain: 'skill', parentId: null, name: 'business', displayName: 'Negócios & Profissões', sort: 10 },

  { id: 'cat-skill-crime', domain: 'skill', parentId: null, name: 'crime', displayName: 'Crime & Submundo', sort: 11 },
  { id: 'cat-skill-crime-burglary', domain: 'skill', parentId: 'cat-skill-crime', name: 'burglary', displayName: 'Arrombamento', sort: 1 },
  { id: 'cat-skill-crime-deception', domain: 'skill', parentId: 'cat-skill-crime', name: 'deception', displayName: 'Enganação', sort: 2 },
  { id: 'cat-skill-crime-shadow', domain: 'skill', parentId: 'cat-skill-crime', name: 'shadow', displayName: 'Sombra', sort: 3 },
  { id: 'cat-skill-crime-poison', domain: 'skill', parentId: 'cat-skill-crime', name: 'poison', displayName: 'Veneno', sort: 4 },

  { id: 'cat-skill-arts', domain: 'skill', parentId: null, name: 'arts', displayName: 'Artes', sort: 12 },

  { id: 'cat-skill-magic', domain: 'skill', parentId: null, name: 'magic', displayName: 'Magia & Misticismo', sort: 13 },

  // ---- ADVANTAGES ----
  { id: 'cat-advantage-physical', domain: 'advantage', parentId: null, name: 'physical', displayName: 'Físico', sort: 1 },
  { id: 'cat-advantage-physical-combat', domain: 'advantage', parentId: 'cat-advantage-physical', name: 'combat', displayName: 'Combate', sort: 1 },
  { id: 'cat-advantage-physical-fitness', domain: 'advantage', parentId: 'cat-advantage-physical', name: 'fitness', displayName: 'Condicionamento', sort: 2 },
  { id: 'cat-advantage-physical-senses', domain: 'advantage', parentId: 'cat-advantage-physical', name: 'senses', displayName: 'Sentidos', sort: 3 },
  { id: 'cat-advantage-physical-resistance', domain: 'advantage', parentId: 'cat-advantage-physical', name: 'resistance', displayName: 'Resistência', sort: 4 },
  { id: 'cat-advantage-physical-recuperation', domain: 'advantage', parentId: 'cat-advantage-physical', name: 'recuperation', displayName: 'Recuperação', sort: 5 },
  { id: 'cat-advantage-physical-toughness', domain: 'advantage', parentId: 'cat-advantage-physical', name: 'toughness', displayName: 'Tenacidade', sort: 6 },

  { id: 'cat-advantage-mental', domain: 'advantage', parentId: null, name: 'mental', displayName: 'Mental', sort: 2 },
  { id: 'cat-advantage-mental-perception', domain: 'advantage', parentId: 'cat-advantage-mental', name: 'perception', displayName: 'Percepção', sort: 1 },
  { id: 'cat-advantage-mental-talent', domain: 'advantage', parentId: 'cat-advantage-mental', name: 'talent', displayName: 'Talento', sort: 2 },
  { id: 'cat-advantage-mental-willpower', domain: 'advantage', parentId: 'cat-advantage-mental', name: 'willpower', displayName: 'Força de Vontade', sort: 3 },
  { id: 'cat-advantage-mental-social', domain: 'advantage', parentId: 'cat-advantage-mental', name: 'social', displayName: 'Social', sort: 4 },

  { id: 'cat-advantage-social', domain: 'advantage', parentId: null, name: 'social', displayName: 'Social', sort: 3 },
  { id: 'cat-advantage-social-status', domain: 'advantage', parentId: 'cat-advantage-social', name: 'status', displayName: 'Status', sort: 1 },
  { id: 'cat-advantage-social-appearance', domain: 'advantage', parentId: 'cat-advantage-social', name: 'appearance', displayName: 'Aparência', sort: 2 },

  { id: 'cat-advantage-magical', domain: 'advantage', parentId: null, name: 'magical', displayName: 'Mágico', sort: 4 },

  { id: 'cat-advantage-exotic', domain: 'advantage', parentId: null, name: 'exotic', displayName: 'Exótico', sort: 5 },

  // ---- DISADVANTAGES ----
  { id: 'cat-disadvantage-physical', domain: 'disadvantage', parentId: null, name: 'physical', displayName: 'Físico', sort: 1 },
  { id: 'cat-disadvantage-physical-senses', domain: 'disadvantage', parentId: 'cat-disadvantage-physical', name: 'senses', displayName: 'Sentidos', sort: 1 },
  { id: 'cat-disadvantage-physical-appearance', domain: 'disadvantage', parentId: 'cat-disadvantage-physical', name: 'appearance', displayName: 'Aparência', sort: 2 },
  { id: 'cat-disadvantage-physical-health', domain: 'disadvantage', parentId: 'cat-disadvantage-physical', name: 'health', displayName: 'Saúde', sort: 3 },
  { id: 'cat-disadvantage-physical-addiction', domain: 'disadvantage', parentId: 'cat-disadvantage-physical', name: 'addiction', displayName: 'Vícios', sort: 4 },
  { id: 'cat-disadvantage-physical-speech', domain: 'disadvantage', parentId: 'cat-disadvantage-physical', name: 'speech', displayName: 'Fala', sort: 5 },

  { id: 'cat-disadvantage-mental', domain: 'disadvantage', parentId: null, name: 'mental', displayName: 'Mental', sort: 2 },
  { id: 'cat-disadvantage-mental-compulsive', domain: 'disadvantage', parentId: 'cat-disadvantage-mental', name: 'compulsive', displayName: 'Compulsões', sort: 1 },
  { id: 'cat-disadvantage-mental-emotional', domain: 'disadvantage', parentId: 'cat-disadvantage-mental', name: 'emotional', displayName: 'Emocional', sort: 2 },
  { id: 'cat-disadvantage-mental-cognitive', domain: 'disadvantage', parentId: 'cat-disadvantage-mental', name: 'cognitive', displayName: 'Cognitivo', sort: 3 },

  { id: 'cat-disadvantage-social', domain: 'disadvantage', parentId: null, name: 'social', displayName: 'Social', sort: 3 },
  { id: 'cat-disadvantage-social-status', domain: 'disadvantage', parentId: 'cat-disadvantage-social', name: 'status', displayName: 'Status', sort: 1 },
  { id: 'cat-disadvantage-social-behavior', domain: 'disadvantage', parentId: 'cat-disadvantage-social', name: 'behavior', displayName: 'Comportamento', sort: 2 },

  // ---- ITEMS (categoria usa os valores existentes em game_table_items.category) ----
  { id: 'cat-item-Melee', domain: 'item', parentId: null, name: 'Melee', displayName: 'Armas Brancas', sort: 1 },
  { id: 'cat-item-Ranged', domain: 'item', parentId: null, name: 'Ranged', displayName: 'Armas de Projétil', sort: 2 },
  { id: 'cat-item-Shield', domain: 'item', parentId: null, name: 'Shield', displayName: 'Escudos', sort: 3 },
  { id: 'cat-item-Armor', domain: 'item', parentId: null, name: 'Armor', displayName: 'Armaduras', sort: 4 },
  { id: 'cat-item-Clothing', domain: 'item', parentId: null, name: 'Clothing', displayName: 'Vestuário', sort: 5 },
  { id: 'cat-item-Equipment', domain: 'item', parentId: null, name: 'Equipment', displayName: 'Equipamento', sort: 6 },
  { id: 'cat-item-Consumable', domain: 'item', parentId: null, name: 'Consumable', displayName: 'Consumíveis', sort: 7 },

  // ---- NPCS (categoria = papel; subcategoria = aliança/status) ----
  { id: 'cat-npc-combatante', domain: 'npc', parentId: null, name: 'combatante', displayName: 'Combatentes', sort: 1 },
  { id: 'cat-npc-atirador', domain: 'npc', parentId: null, name: 'atirador', displayName: 'Atiradores', sort: 2 },
  { id: 'cat-npc-arcano', domain: 'npc', parentId: null, name: 'arcano', displayName: 'Arcanos', sort: 3 },
  { id: 'cat-npc-assassino', domain: 'npc', parentId: null, name: 'assassino', displayName: 'Assassinos', sort: 4 }
]

// Módulo default da maioria do conteúdo atual = fantasy.
const M = {
  fantasy: 'fantasy',
  lowTech: 'low-tech',
  midTech: 'mid-tech',
  cyberpunk: 'cyberpunk'
}

type SkillTag = { category: string; subcategory: string | undefined; moduleId: string }

// =========================
// TAGS DE SKILLS (rule map por nome)
// =========================
const skillCat = (category: string, subcategory?: string, moduleId = M.fantasy): SkillTag => ({
  category,
  subcategory,
  moduleId
})

export const skillTag: Record<string, SkillTag> = Object.fromEntries([
  // Combate corpo a corpo
  ['Swordsmanship', skillCat('combat', 'melee')],
  ['Axe or Mace', skillCat('combat', 'melee')],
  ['Blackjack', skillCat('combat', 'melee')],
  ['Broadsword', skillCat('combat', 'melee')],
  ['Fencing', skillCat('combat', 'melee')],
  ['Flail', skillCat('combat', 'melee')],
  ['Knife', skillCat('combat', 'melee')],
  ['Lance', skillCat('combat', 'melee')],
  ['Polearm', skillCat('combat', 'melee')],
  ['Shortsword', skillCat('combat', 'melee')],
  ['Spear', skillCat('combat', 'melee')],
  ['Staff', skillCat('combat', 'melee')],
  ['Two-Handed Axe/Mace', skillCat('combat', 'melee')],
  ['Two-Handed Sword', skillCat('combat', 'melee')],
  ['Whip', skillCat('combat', 'melee')],
  // Combate à distância
  ['Bows', skillCat('combat', 'ranged')],
  ['Axe Throwing', skillCat('combat', 'ranged')],
  ['Beam Weapons', skillCat('combat', 'ranged', M.cyberpunk)],
  ['Blowpipe', skillCat('combat', 'ranged', M.lowTech)],
  ['Bolas', skillCat('combat', 'ranged', M.lowTech)],
  ['Bow', skillCat('combat', 'ranged')],
  ['Crossbow', skillCat('combat', 'ranged')],
  ['Fast Reload', skillCat('combat', 'ranged', M.midTech)],
  ['Guns', skillCat('combat', 'ranged', M.midTech)],
  ['Guns (Musket)', skillCat('combat', 'ranged', M.midTech)],
  ['Knife Throwing', skillCat('combat', 'ranged')],
  ['Net', skillCat('combat', 'ranged', M.lowTech)],
  ['Sling', skillCat('combat', 'ranged', M.lowTech)],
  ['Spear Thrower', skillCat('combat', 'ranged', M.lowTech)],
  ['Spear Throwing', skillCat('combat', 'ranged')],
  // Combate desarmado
  ['Brawling', skillCat('combat', 'unarmed')],
  ['Judo', skillCat('combat', 'unarmed')],
  ['Karate', skillCat('combat', 'unarmed')],
  // Defesa
  ['Buckler', skillCat('combat', 'defense')],
  ['Shield', skillCat('combat', 'defense')],
  ['Fast-Draw', skillCat('combat', 'defense')],
  // Militar
  ['Tactics', skillCat('military', 'command')],
  ['Strategy', skillCat('military', 'command')],
  ['Leadership', skillCat('military', 'command')],
  ['Camouflage', skillCat('military', 'command')],
  ['Intelligence Analysis', skillCat('military', 'intelligence', M.midTech)],
  ['Interrogation', skillCat('military', 'intelligence')],
  ['Lip Reading', skillCat('military', 'intelligence')],
  // Sobrevivência — natureza
  ['Survival', skillCat('survival', 'wilderness')],
  ['Tracking', skillCat('survival', 'wilderness')],
  ['Fishing', skillCat('survival', 'wilderness', M.lowTech)],
  ['Navigation', skillCat('survival', 'wilderness', M.lowTech)],
  ['Area Knowledge', skillCat('survival', 'wilderness')],
  // Sobrevivência — animais
  ['Animal Training', skillCat('survival', 'animals')],
  ['Riding', skillCat('survival', 'animals')],
  ['Falconry', skillCat('survival', 'animals', M.lowTech)],
  ['Animal Packing', skillCat('survival', 'animals', M.lowTech)],
  ['Lasso', skillCat('survival', 'animals', M.lowTech)],
  // Sobrevivência — atletismo
  ['Acrobatics', skillCat('survival', 'athletics')],
  ['Breath Control', skillCat('survival', 'athletics')],
  ['Climbing', skillCat('survival', 'athletics')],
  ['Diving', skillCat('survival', 'athletics', M.lowTech)],
  ['Escape', skillCat('survival', 'athletics')],
  ['Jumping', skillCat('survival', 'athletics')],
  ['Running', skillCat('survival', 'athletics')],
  ['Skiing', skillCat('survival', 'athletics')],
  ['Swimming', skillCat('survival', 'athletics')],
  ['Zero-G', skillCat('survival', 'athletics', M.cyberpunk)],
  // Medicina
  ['Medicine', skillCat('medical')],
  ['Surgery', skillCat('medical')],
  ['Veterinary', skillCat('medical')],
  ['Physiology', skillCat('medical')],
  // Social — comunicação
  ['Acting', skillCat('social', 'communication')],
  ['Bard', skillCat('social', 'communication')],
  ['Carousing', skillCat('social', 'communication')],
  ['Detect Lies', skillCat('social', 'communication')],
  ['Diplomacy', skillCat('social', 'communication')],
  ['Fast-Talk', skillCat('social', 'communication')],
  ['Gambling', skillCat('social', 'communication')],
  ['Performance', skillCat('social', 'communication')],
  ['Sex Appeal', skillCat('social', 'communication')],
  ['Teaching', skillCat('social', 'communication')],
  ['Ventriloquism', skillCat('social', 'communication')],
  // Social — idiomas
  ['Language', skillCat('social', 'languages')],
  ['Sign Language', skillCat('social', 'languages')],
  ['Mime/Pantomime', skillCat('social', 'languages')],
  // Ofícios
  ['Armoury', skillCat('craft')],
  ['Agronomy', skillCat('craft', undefined, M.lowTech)],
  ['Carpentry', skillCat('craft', undefined, M.lowTech)],
  ['Cooking', skillCat('craft', undefined, M.lowTech)],
  ['Jeweler', skillCat('craft', undefined, M.lowTech)],
  ['Leatherworking', skillCat('craft', undefined, M.lowTech)],
  ['Metallurgy', skillCat('craft', undefined, M.lowTech)],
  ['Pottery', skillCat('craft', undefined, M.lowTech)],
  ['Prospecting', skillCat('craft', undefined, M.lowTech)],
  ['Smith', skillCat('craft', undefined, M.lowTech)],
  ['Woodworking', skillCat('craft', undefined, M.lowTech)],
  // Técnica
  ['Combat Suit', skillCat('technical', undefined, M.cyberpunk)],
  ['Pressure Suit', skillCat('technical', undefined, M.cyberpunk)],
  ['Demolition', skillCat('technical', undefined, M.midTech)],
  ['Underwater Demolition', skillCat('technical', undefined, M.midTech)],
  ['Mechanic', skillCat('technical', undefined, M.midTech)],
  ['Electronics', skillCat('technical', undefined, M.midTech)],
  ['Electronics Operation', skillCat('technical', undefined, M.midTech)],
  ['Computer Operation', skillCat('technical', undefined, M.midTech)],
  ['Computer Programming', skillCat('technical', undefined, M.midTech)],
  ['Engineering (Mechanical)', skillCat('technical', undefined, M.midTech)],
  ['Telegraphy', skillCat('technical', undefined, M.midTech)],
  // Veículos
  ['Teamster', skillCat('vehicle', undefined, M.lowTech)],
  ['Seamanship', skillCat('vehicle', undefined, M.lowTech)],
  ['Boating', skillCat('vehicle', undefined, M.lowTech)],
  ['Cycling', skillCat('vehicle', undefined, M.midTech)],
  ['Driving', skillCat('vehicle', undefined, M.midTech)],
  ['Motorcycle', skillCat('vehicle', undefined, M.midTech)],
  ['Piloting', skillCat('vehicle', undefined, M.cyberpunk)],
  ['Powerboat', skillCat('vehicle', undefined, M.midTech)],
  // Ciências
  ['Naturalist', skillCat('science')],
  ['Anthropology', skillCat('science')],
  ['Archaeology', skillCat('science')],
  ['Astronavigation', skillCat('science', undefined, M.cyberpunk)],
  ['Astronomy', skillCat('science')],
  ['Biochemistry', skillCat('science')],
  ['Botany', skillCat('science')],
  ['Chemistry', skillCat('science')],
  ['Criminology', skillCat('science')],
  ['Ecology', skillCat('science')],
  ['Forensics', skillCat('science', undefined, M.midTech)],
  ['Genetics', skillCat('science', undefined, M.cyberpunk)],
  ['Geology', skillCat('science')],
  ['History', skillCat('science')],
  ['Linguistics', skillCat('science')],
  ['Mathematics', skillCat('science')],
  ['Meteorology', skillCat('science')],
  ['Nuclear Physics', skillCat('science', undefined, M.cyberpunk)],
  ['Physics', skillCat('science')],
  ['Psychology', skillCat('science', undefined, M.midTech)],
  ['Theology', skillCat('science')],
  ['Zoology', skillCat('science')],
  // Negócios & Profissões
  ['Accounting', skillCat('business')],
  ['Administration', skillCat('business')],
  ['Architecture', skillCat('business')],
  ['Economics', skillCat('business')],
  ['Heraldry', skillCat('business')],
  ['Law', skillCat('business')],
  ['Merchant', skillCat('business')],
  ['Research', skillCat('business')],
  // Crime & Submundo
  ['Stealth', skillCat('crime', 'shadow')],
  ['Shadowing', skillCat('crime', 'shadow')],
  ['Streetwise', skillCat('crime', 'shadow')],
  ['Scrounging', skillCat('crime', 'shadow')],
  ['Lockpicking', skillCat('crime', 'burglary')],
  ['Pickpocket', skillCat('crime', 'burglary')],
  ['Holdout', skillCat('crime', 'burglary')],
  ['Sleight of Hand', skillCat('crime', 'burglary')],
  ['Traps', skillCat('crime', 'burglary')],
  ['Forgery', skillCat('crime', 'deception')],
  ['Disguise', skillCat('crime', 'deception')],
  ['Poison', skillCat('crime', 'poison')],
  // Artes
  ['Artist', skillCat('arts')],
  ['Dancing', skillCat('arts')],
  ['Poetry', skillCat('arts')],
  ['Sculpting', skillCat('arts')],
  ['Sing', skillCat('arts')],
  ['Writing', skillCat('arts')],
  ['Literature', skillCat('arts')],
  // Magia
  ['Magery', skillCat('magic')],
  ['Thaumatology', skillCat('magic')],
  ['Alchemy', skillCat('magic')],
  ['Occultism', skillCat('magic')],
  ['Meditation', skillCat('magic')]
])

// =========================
// TAGS DE ADVANTAGES
// =========================
const advantageTag: Record<string, { category: string; subcategory?: string }> = {
  'Combat Reflexes': { category: 'physical', subcategory: 'combat' },
  'Very Fit': { category: 'physical', subcategory: 'fitness' },
  'Magery 1': { category: 'magical' },
  'Absolute Direction': { category: 'physical', subcategory: 'senses' },
  'Flexibility': { category: 'physical', subcategory: 'fitness' },
  'Double-Jointed': { category: 'physical', subcategory: 'fitness' },
  'Eidetic Memory': { category: 'mental', subcategory: 'perception' },
  'Empathy': { category: 'mental', subcategory: 'social' },
  'High Pain Threshold': { category: 'physical', subcategory: 'resistance' },
  'Immunity': { category: 'physical', subcategory: 'resistance' },
  'Intuition': { category: 'mental', subcategory: 'perception' },
  'Language Talent': { category: 'mental', subcategory: 'talent' },
  'Legal Enforcement Powers': { category: 'social', subcategory: 'status' },
  'Lightning Calculator': { category: 'mental', subcategory: 'talent' },
  'Literacy': { category: 'social', subcategory: 'status' },
  'Longevity': { category: 'physical', subcategory: 'resistance' },
  'Luck': { category: 'exotic' },
  'Magical Aptitude': { category: 'magical' },
  'Magic Resistance': { category: 'magical' },
  'Mathematical Talent': { category: 'mental', subcategory: 'talent' },
  'Military Rank': { category: 'social', subcategory: 'status' },
  'Musical Talent': { category: 'mental', subcategory: 'talent' },
  'Night Vision': { category: 'physical', subcategory: 'senses' },
  'Peripheral Vision': { category: 'physical', subcategory: 'senses' },
  'Psychic Resistance': { category: 'exotic' },
  'Rapid Healing': { category: 'physical', subcategory: 'recuperation' },
  'Strong Will': { category: 'mental', subcategory: 'willpower' },
  'Toughness': { category: 'physical', subcategory: 'toughness' },
  'Unusual Background': { category: 'exotic' },
  'Voice': { category: 'social', subcategory: 'appearance' },
  'Wealth': { category: 'social', subcategory: 'status' }
}

export const advantageTagBy = (name: string): ContentTag => {
  const tag = advantageTag[name] ?? { category: 'mental', subcategory: 'perception' }
  return { moduleId: M.fantasy, category: tag.category, subcategory: tag.subcategory }
}

// =========================
// TAGS DE DISADVANTAGES
// =========================
const disadvantageTagMap: Record<string, { category: string; subcategory: string }> = {
  'Disgusting Habits': { category: 'social', subcategory: 'behavior' },
  'Poverty': { category: 'social', subcategory: 'status' },
  'Primitive': { category: 'social', subcategory: 'status' },
  'Social Stigma': { category: 'social', subcategory: 'status' },
  'Age': { category: 'physical', subcategory: 'health' },
  'Bad Sight': { category: 'physical', subcategory: 'senses' },
  'Albinism': { category: 'physical', subcategory: 'appearance' },
  'Blindness': { category: 'physical', subcategory: 'senses' },
  'Color Blindness': { category: 'physical', subcategory: 'senses' },
  'Deafness': { category: 'physical', subcategory: 'senses' },
  'Dwarfism': { category: 'physical', subcategory: 'appearance' },
  'Epilepsy': { category: 'physical', subcategory: 'health' },
  'Eunuch': { category: 'physical', subcategory: 'health' },
  'Obesity': { category: 'physical', subcategory: 'appearance' },
  'Gigantism': { category: 'physical', subcategory: 'appearance' },
  'Hard of Hearing': { category: 'physical', subcategory: 'senses' },
  'Hemophilia': { category: 'physical', subcategory: 'health' },
  'Physical Disability': { category: 'physical', subcategory: 'health' },
  'Low Pain Threshold': { category: 'physical', subcategory: 'health' },
  'Mutism': { category: 'physical', subcategory: 'speech' },
  'No Sense of Smell/Taste': { category: 'physical', subcategory: 'senses' },
  'One Arm': { category: 'physical', subcategory: 'health' },
  'One Eye': { category: 'physical', subcategory: 'senses' },
  'One Hand': { category: 'physical', subcategory: 'health' },
  'Overweight': { category: 'physical', subcategory: 'appearance' },
  'Skinny': { category: 'physical', subcategory: 'appearance' },
  'Stuttering': { category: 'physical', subcategory: 'speech' },
  'Youth': { category: 'social', subcategory: 'status' },
  'Distractible': { category: 'mental', subcategory: 'cognitive' },
  'Addiction': { category: 'physical', subcategory: 'addiction' },
  'Alcoholism': { category: 'physical', subcategory: 'addiction' },
  'Bad Temper': { category: 'mental', subcategory: 'emotional' },
  'Berserk': { category: 'mental', subcategory: 'emotional' },
  'Bloodlust': { category: 'mental', subcategory: 'emotional' },
  'Boastfulness': { category: 'mental', subcategory: 'emotional' },
  'Code of Honor': { category: 'social', subcategory: 'behavior' },
  'Combat Paralysis': { category: 'mental', subcategory: 'emotional' },
  'Compulsion': { category: 'mental', subcategory: 'compulsive' },
  'Compulsive Lying': { category: 'mental', subcategory: 'compulsive' },
  'Cowardice': { category: 'mental', subcategory: 'emotional' },
  'Delusions': { category: 'mental', subcategory: 'cognitive' },
  'Dyslexia': { category: 'mental', subcategory: 'cognitive' },
  'Fanaticism': { category: 'mental', subcategory: 'cognitive' },
  'Gluttony': { category: 'physical', subcategory: 'addiction' },
  'Greed': { category: 'mental', subcategory: 'emotional' },
  'Credulity': { category: 'mental', subcategory: 'cognitive' },
  'Honesty': { category: 'mental', subcategory: 'cognitive' },
  'Illiteracy': { category: 'social', subcategory: 'status' },
  'Impulsiveness': { category: 'mental', subcategory: 'emotional' },
  'Intolerance': { category: 'mental', subcategory: 'emotional' },
  'Jealousy': { category: 'mental', subcategory: 'emotional' },
  'Kleptomania': { category: 'mental', subcategory: 'compulsive' },
  'Laziness': { category: 'mental', subcategory: 'cognitive' },
  'Lechery': { category: 'mental', subcategory: 'emotional' },
  'Megalomania': { category: 'mental', subcategory: 'emotional' },
  'Miserliness': { category: 'mental', subcategory: 'compulsive' },
  'Overconfidence': { category: 'mental', subcategory: 'emotional' }
}

export const disadvantageTagBy = (name: string): ContentTag => {
  const tag = disadvantageTagMap[name] ?? { category: 'mental', subcategory: 'cognitive' }
  return { moduleId: M.fantasy, category: tag.category, subcategory: tag.subcategory }
}

// =========================
// TAGS DE ITEMS
// =========================
export const itemTagBy = (item: { name: string; kind: string; category: string }): ContentTag => {
  let subcategory = 'gear'
  if (item.category === 'Clothing') {
    subcategory = 'clothing'
  } else if (item.category === 'Consumable') {
    subcategory = 'consumable'
  } else if (item.kind === 'weapon') {
    subcategory = item.category === 'Ranged' ? 'ranged' : 'melee'
  } else if (item.kind === 'shield') {
    subcategory = 'shield'
  } else if (item.kind === 'armor') {
    subcategory = 'body'
  }
  const moduleId = item.name.includes('Pistol') ? M.midTech : M.fantasy
  return { moduleId, category: item.category, subcategory }
}

// =========================
// TAGS DE NPCS (papel derivado do nome; aliança = status)
// =========================
export const npcTagBy = (characterName: string, status: string): ContentTag => {
  const name = characterName.toLowerCase()
  let category = 'combatante'
  if (name.includes('vera')) category = 'atirador'
  else if (name.includes('selene') || name.includes('lyra') || name.includes('eldric') || name.includes('dante')) category = 'arcano'
  else if (name.includes('thorne') || name.includes('nyx')) category = 'assassino'
  return { moduleId: M.fantasy, category, subcategory: status }
}