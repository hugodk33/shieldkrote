import { mainGameTableId } from "./MainUUIDIds/uuidGeral"
import { users } from "./varUsers"
import { characterGalarhornId, characterGarrickId, characterLyraId, characterKaelId, characterNPCsIds } from "./MainUUIDIds/uuidCharacters"
import * as skillsIds from './MainUUIDIds/uuidSkills'
import * as advantagesIds from "./MainUUIDIds/uuidAdvantages"
import * as itemsIds from "./MainUUIDIds/uuidItems"
import * as disadvantagesIds from "./MainUUIDIds/uuidDisadvantages"
import * as UserCharacterIds from "./MainUUIDIds/uuidGeral"

type SeedCharacter = {
    id: string
    userId: string
    tableId: string
    /** false = personagem permanece na mesa, mas desativado (fora de jogo). */
    isActive?: boolean
}

export const characters: SeedCharacter[] = [
    {
        id: characterGalarhornId,
        userId: UserCharacterIds.playerOneId,
        tableId: mainGameTableId
    },
    {
        id: characterLyraId,
        userId: users[4].id,
        tableId: mainGameTableId
    },
    {
        id: characterKaelId,
        userId: users[5].id,
        tableId: mainGameTableId
    },
  {
    id: characterGarrickId,
    userId: users[2].id,
    tableId: mainGameTableId,
    isActive: false
  },
  { id: characterNPCsIds[0] as string, userId: users[0]?.id, tableId: mainGameTableId },
    { id: characterNPCsIds[1] as string, userId: users[0]?.id, tableId: mainGameTableId },
    { id: characterNPCsIds[2] as string, userId: users[0]?.id, tableId: mainGameTableId },
    { id: characterNPCsIds[3] as string, userId: users[0]?.id, tableId: mainGameTableId },
    { id: characterNPCsIds[4] as string, userId: users[0]?.id, tableId: mainGameTableId },
    { id: characterNPCsIds[5] as string, userId: users[0]?.id, tableId: mainGameTableId },
    { id: characterNPCsIds[6] as string, userId: users[0]?.id, tableId: mainGameTableId},
    { id: characterNPCsIds[7] as string, userId: users[0]?.id, tableId: mainGameTableId},
    { id: characterNPCsIds[8] as string, userId: users[0]?.id, tableId: mainGameTableId},
    { id: characterNPCsIds[9] as string, userId: users[0]?.id, tableId: mainGameTableId}

]

type SeedCharacterSheet = {
    id: string
    characterId: string
    name: string
    bio: string
    backstory: string
    points: number
    hp: number
    st: number
    dx: number
    iq: number
    ht: number
    fatigue: number
    encumbrance: string
}

export const characterSheets: SeedCharacterSheet[] = [
    {
        id: crypto.randomUUID(),
        characterId: characterGalarhornId,
        name: 'Elric Guerreiro',
        bio: 'Um duelista de rua com reflexos rápidos.',
        backstory: 'Ex-integrante da guarda da cidade que virou mercenária da lâmina, ela luta pela liberdade e pela sobrevivência.',
        points: 150,
        hp: 11,
        st: 11,
        dx: 12,
        iq: 13,
        ht: 10,
        fatigue: 0,
        encumbrance: 'Light'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterLyraId,
        name: 'Maga Lyra',
        bio: 'Uma maga talentosa obcecada pelo conhecimento antigo.',
        backstory: 'Criada em uma academia arcana isolada, Lyra partiu para desvendar segredos mágicos esquecidos.',
        points: 150,
        hp: 9,
        st: 9,
        dx: 10,
        iq: 15,
        ht: 10,
        fatigue: 0,
        encumbrance: 'None'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterKaelId,
        name: 'Kael Ladino',
        bio: 'Um ágil ladrão especializado em infiltração e mortes silenciosas.',
        backstory: 'Criado entre ladrões e contrabandistas, Kael aprendeu que informação frequentemente vale mais que ouro.',
        points: 150,
        hp: 10,
        st: 10,
        dx: 14,
        iq: 12,
        ht: 11,
        fatigue: 0,
        encumbrance: 'None'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterGarrickId,
        name: 'Garrick Sargento',
        bio: 'Um sargento veterano cujo escudo já desviou mais lâminas do que ele consegue contar.',
        backstory: 'Depois de anos guardando as caravanas do reino, Garrick agora está na linha de frente do grupo.',
        points: 150,
        hp: 13,
        st: 13,
        dx: 11,
        iq: 10,
        ht: 12,
        fatigue: 0,
        encumbrance: 'Medium'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterNPCsIds[0] as string,
        name: 'Riven Espadachim',
        bio: 'Um lutador rápido de lâminas duplas.',
        backstory: 'Sobreviveu pela velocidade e pelo instinto.',
        points: 150, hp: 11, st: 11, dx: 14, iq: 11, ht: 10, fatigue: 0, encumbrance: 'Light'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterNPCsIds[1] as string,
        name: 'Thorne Bruto',
        bio: 'Um caçador de recompensas sombrio.',
        backstory: 'Rastreia alvos por todos os reinos.',
        points: 155, hp: 12, st: 12, dx: 12, iq: 11, ht: 11, fatigue: 0, encumbrance: 'Medium'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterNPCsIds[2] as string,
        name: 'Selene Maga Sombria',
        bio: 'Uma maga das sombras.',
        backstory: 'Manipula a própria escuridão.',
        points: 160, hp: 10, st: 9, dx: 12, iq: 15, ht: 10, fatigue: 0, encumbrance: 'Light'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterNPCsIds[3] as string,
        name: 'Kael Duelista',
        bio: 'Um duelista impiedoso.',
        backstory: 'Busca a perfeição no combate.',
        points: 150, hp: 11, st: 11, dx: 13, iq: 11, ht: 11, fatigue: 0, encumbrance: 'Light'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterNPCsIds[4] as string,
        name: 'Lyra Feiticeira',
        bio: 'Uma feiticeira celestial.',
        backstory: 'Abençoada pelas estrelas antigas.',
        points: 165, hp: 10, st: 9, dx: 11, iq: 15, ht: 11, fatigue: 0, encumbrance: 'Light'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterNPCsIds[5] as string,
        name: 'Borin Tanque',
        bio: 'Um tanque anão.',
        backstory: 'Inquebrável em batalha.',
        points: 160, hp: 14, st: 14, dx: 10, iq: 10, ht: 13, fatigue: 1, encumbrance: 'Heavy'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterNPCsIds[6] as string,
        name: 'Nyx Assassina',
        bio: 'Uma assassina de elite.',
        backstory: 'Nunca vista, sempre letal.',
        points: 155, hp: 10, st: 10, dx: 15, iq: 12, ht: 10, fatigue: 0, encumbrance: 'Light'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterNPCsIds[7] as string,
        name: 'Eldric Mago',
        bio: 'Um mago sábio.',
        backstory: 'Guardião de sabedoria proibida.',
        points: 170, hp: 10, st: 9, dx: 10, iq: 16, ht: 11, fatigue: 0, encumbrance: 'Light'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterNPCsIds[8] as string,
        name: 'Vera Arqueira',
        bio: 'Uma arqueira amaldiçoada.',
        backstory: 'Atormentada pelas batalhas passadas.',
        points: 150, hp: 11, st: 11, dx: 13, iq: 11, ht: 11, fatigue: 0, encumbrance: 'Light'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterNPCsIds[9] as string,
        name: 'Dante Bruxo',
        bio: 'Um bruxo carismático.',
        backstory: 'Poder a um custo terrível.',
        points: 165, hp: 10, st: 10, dx: 11, iq: 15, ht: 11, fatigue: 0, encumbrance: 'Light'
    }
]

type SeedArmor = {
    id: string
    name: string
    description: string
    type: string
    value: string
    fit: string
    character_id: string
    item_id?: string
    skill_id?: string
    advantage_id?: string
}

export const armors: SeedArmor[] = [
    {
        id: crypto.randomUUID(),
        name: 'Leather Armor',
        description: 'Sturdy leather armor offering moderate protection.',
        type: 'Armor',
        value: 'DR 2',
        fit: 'Torso',
        character_id: characterGalarhornId,
        item_id: itemsIds.galhornLeatherArmorId
    },
    {
        id: crypto.randomUUID(),
        name: 'Leather Bracers',
        description: 'Leather forearm guards for added protection.',
        type: 'Armor',
        value: 'DR 1',
        fit: 'Arms',
        character_id: characterGalarhornId,
        item_id: itemsIds.leatherBracersId
    },
    {
        id: crypto.randomUUID(),
        name: 'Leather Boots',
        description: 'Sturdy leather boots that protect the feet and lower legs.',
        type: 'Armor',
        value: 'DR 1',
        fit: 'Legs',
        character_id: characterGalarhornId,
        item_id: itemsIds.leatherBootsId
    },
    {
        id: crypto.randomUUID(),
        name: 'Medium Shield',
        description: 'A wooden shield reinforced with metal bands.',
        type: 'Shield',
        value: 'DB 2',
        fit: 'One Arm',
        character_id: characterGalarhornId,
        item_id: itemsIds.mediumShieldId
    },
    {
        id: crypto.randomUUID(),
        name: 'Travel Cloak',
        description: 'A simple travel cloak for weather protection.',
        type: 'Clothing',
        value: '-',
        fit: 'Shoulders',
        character_id: characterGalarhornId,
        item_id: itemsIds.travelCloakId
    },
    {
        id: crypto.randomUUID(),
        name: 'Robes',
        description: 'Simple but durable wizard robes.',
        type: 'Clothing',
        value: '-',
        fit: 'Full body',
        character_id: characterLyraId,
        item_id: itemsIds.robesId
    },
    {
        id: crypto.randomUUID(),
        name: 'Leather Armor',
        description: 'Light leather armor optimized for stealth and mobility.',
        type: 'Armor',
        value: 'DR 2',
        fit: 'Torso',
        character_id: characterKaelId,
        item_id: itemsIds.kaelLeatherArmorId
    },
    {
        id: crypto.randomUUID(),
        name: 'Dark Hooded Cloak',
        description: 'A dark, hooded cloak that helps blend into shadows.',
        type: 'Clothing',
        value: '-',
        fit: 'Shoulders',
        character_id: characterKaelId,
        item_id: itemsIds.darkHoodedCloakId
    }
]

type SeedCharacterSkill = {
    id: string
    characterId: string
    skillId: string
    costPoints: number
    effect: string
}

export const characterSkills: SeedCharacterSkill[] = [
    {
        id: crypto.randomUUID(),
        characterId: characterGalarhornId,
        skillId: skillsIds.skillSwordsmanshipId,
        costPoints: 14,
        effect: 'Used for melee attacks with swords and blades.'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterLyraId,
        skillId: skillsIds.skillThaumatologyId,
        costPoints: 8,
        effect: 'Used to study and understand the principles of magic.'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterLyraId,
        skillId: skillsIds.skillResearchId,
        costPoints: 4,
        effect: 'Used to conduct investigations in libraries and archives.'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterLyraId,
        skillId: skillsIds.skillOccultismId,
        costPoints: 4,
        effect: 'Used to recognize and understand occult symbols and practices.'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterLyraId,
        skillId: skillsIds.skillAlchemyId,
        costPoints: 4,
        effect: 'Used to brew potions and identify alchemical substances.'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterLyraId,
        skillId: skillsIds.skillMeditationId,
        costPoints: 2,
        effect: 'Used to calm the mind and focus magical energy.'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterKaelId,
        skillId: skillsIds.skillStealthId,
        costPoints: 12,
        effect: 'Used to move silently and hide in shadows.'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterKaelId,
        skillId: skillsIds.skillLockpickingId,
        costPoints: 8,
        effect: 'Used to open locks without a key.'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterKaelId,
        skillId: skillsIds.skillPickpocketId,
        costPoints: 8,
        effect: 'Used to steal items from pockets unnoticed.'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterKaelId,
        skillId: skillsIds.skillKnifeId,
        costPoints: 8,
        effect: 'Used for close combat with knives and daggers.'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterKaelId,
        skillId: skillsIds.skillClimbingId,
        costPoints: 4,
        effect: 'Used to scale walls and other vertical surfaces.'
    },
    {
        id: crypto.randomUUID(),
        characterId: characterKaelId,
        skillId: skillsIds.skillStreetwiseId,
        costPoints: 4,
        effect: 'Used to gather information in urban underworlds.'
    }
]

type SeedCharacterAdvantage = {
    id: string
    advantage_id: string
    name: string
    category: string
    subcategory: string
    character_id: string
    cost_points: string
    effect: string
}

export const characterAdvantages: SeedCharacterAdvantage[] = [
    {
        id: crypto.randomUUID(),
        advantage_id: advantagesIds.advantageEideticMemoryId,
        name: 'Leadership',
        category: 'Social',
        subcategory: 'Command',
        character_id: characterGalarhornId,
        cost_points: '5',
        effect: 'Used to inspire allies and lead them in battle.'
    },
    {
        id: crypto.randomUUID(),
        advantage_id: advantagesIds.advantageAbsoluteDirectionId,
        name: 'Absolute Direction',
        category: 'Social',
        subcategory: 'Command',
        character_id: characterGalarhornId,
        cost_points: '10',
        effect: 'Used to always know which way is north and navigate effectively.'
    },
    {
        id: crypto.randomUUID(),
        advantage_id: advantagesIds.advantageCombatReflexesId,
        name: 'Combat Reflexes',
        category: 'Social',
        subcategory: 'Command',
        character_id: characterGalarhornId,
        cost_points: '15',
        effect: 'Used to react quickly in combat and avoid attacks.'
    },
    {
        id: crypto.randomUUID(),
        advantage_id: advantagesIds.advantageMageryId,
        name: 'Magery 3',
        category: 'Magical',
        subcategory: 'Talent',
        character_id: characterLyraId,
        cost_points: '35',
        effect: 'Used to channel and enhance magical spells.'
    },
    {
        id: crypto.randomUUID(),
        advantage_id: advantagesIds.advantageEideticMemoryId,
        name: 'Eidetic Memory',
        category: 'Mental',
        subcategory: 'Talent',
        character_id: characterLyraId,
        cost_points: '5',
        effect: 'Used to remember spells and research with exceptional clarity.'
    },
    {
        id: crypto.randomUUID(),
        advantage_id: advantagesIds.advantageFlexibilityId,
        name: 'Flexibility',
        category: 'Physical',
        subcategory: 'Talent',
        character_id: characterKaelId,
        cost_points: '5',
        effect: 'Used to gain a bonus on Climbing and Escape checks.'
    }
]

type SeedCharacterDisadvantage = {
    id: string
    disadvantage_id: string | null
    name: string
    character_id: string
    cost_points: number
    effect: string
}

export const characterDisadvantages: SeedCharacterDisadvantage[] = [
    {
        id: crypto.randomUUID(),
        disadvantage_id: disadvantagesIds.disadvantageCodeOfHonorId,
        name: 'Code of Honor (Soldier)',
        character_id: characterGalarhornId,
        cost_points: -10,
        effect: 'Maintains discipline and professional conduct.'
    },
    {
        id: crypto.randomUUID(),
        disadvantage_id: null,
        name: 'Enemy',
        character_id: characterGalarhornId,
        cost_points: -10,
        effect: 'A corrupt former captain of the city watch seeks revenge.'
    },
    {
        id: crypto.randomUUID(),
        disadvantage_id: disadvantagesIds.disadvantageOverconfidenceId,
        name: 'Overconfidence',
        character_id: characterGalarhornId,
        cost_points: -5,
        effect: 'Frequently underestimates opponents.'
    },
    {
        id: crypto.randomUUID(),
        disadvantage_id: null,
        name: 'Curious',
        character_id: characterLyraId,
        cost_points: -5,
        effect: 'Cannot resist investigating mysteries.'
    },
    {
        id: crypto.randomUUID(),
        disadvantage_id: disadvantagesIds.disadvantageLowPainThresholdId,
        name: 'Low Pain Threshold',
        character_id: characterLyraId,
        cost_points: -10,
        effect: 'Poor tolerance for injury.'
    },
    {
        id: crypto.randomUUID(),
        disadvantage_id: null,
        name: 'Pacifism (Reluctant Killer)',
        character_id: characterLyraId,
        cost_points: -5,
        effect: 'Avoids taking lives whenever possible.'
    },
    {
        id: crypto.randomUUID(),
        disadvantage_id: disadvantagesIds.disadvantageGreedId,
        name: 'Greed',
        character_id: characterKaelId,
        cost_points: -15,
        effect: 'Has difficulty ignoring valuable treasures.'
    },
    {
        id: crypto.randomUUID(),
        disadvantage_id: null,
        name: 'Secret',
        character_id: characterKaelId,
        cost_points: -10,
        effect: 'Wanted by a major thieves guild.'
    },
    {
        id: crypto.randomUUID(),
        disadvantage_id: disadvantagesIds.disadvantageOverconfidenceId,
        name: 'Overconfidence',
        character_id: characterKaelId,
        cost_points: -5,
        effect: 'Often takes unnecessary risks.'
    }
]
