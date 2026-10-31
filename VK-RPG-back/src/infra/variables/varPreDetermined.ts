import * as skillsIds from './MainUUIDIds/uuidSkills'

type SeedModifierGameTableSkillsPreDetermined = {
    id: string,
    origin_skill_id: string,
    depends_on_skill_id: string | null,
    depends_on_skill_value: string | null,
    depends_on_skill_for_others_attributes: string | null
}

export const  modifierGameTableSkillsPreDetermined: SeedModifierGameTableSkillsPreDetermined[] = [
    // Animal Training (Adestramento de Animais): [['IQ', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillAnimalTrainingId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 6'
    },
    // Falconry (Falcoaria): [['IQ', 6], ['Animal Training', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillFalconryId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 6'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillFalconryId,
        depends_on_skill_id: skillsIds.skillAnimalTrainingId,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: null
    },
    // Animal Packing (Carregamento): [['IQ', 6], ['Animal Training', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillAnimalPackingId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 6'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillAnimalPackingId,
        depends_on_skill_id: skillsIds.skillAnimalTrainingId,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: null
    },
    // Riding (Cavalgar): [['DX', 5], ['Animal Training', 3]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillRidingId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillRidingId,
        depends_on_skill_id: skillsIds.skillAnimalTrainingId,
        depends_on_skill_value: '3',
        depends_on_skill_for_others_attributes: null
    },
    // Teamster (Carreiro): [['DX', 5], ['Animal Training', 3]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillTeamsterId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillTeamsterId,
        depends_on_skill_id: skillsIds.skillAnimalTrainingId,
        depends_on_skill_value: '3',
        depends_on_skill_for_others_attributes: null
    },
    // Veterinary (VeterinÃ¡ria): [['Medicine', 5], ['Animal Training', 3]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillVeterinaryId,
        depends_on_skill_id: skillsIds.skillMedicineId,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: null
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillVeterinaryId,
        depends_on_skill_id: skillsIds.skillAnimalTrainingId,
        depends_on_skill_value: '3',
        depends_on_skill_for_others_attributes: null
    },
    // Artist (Artista): [['IQ', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillArtistId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 6'
    },
    // Bard (Trovador): [['IQ', 5], ['Performance', 2]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBardId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBardId,
        depends_on_skill_id: skillsIds.skillPerformanceId,
        depends_on_skill_value: '2',
        depends_on_skill_for_others_attributes: null
    },
    // Dancing (DanÃ§a): [['DX', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillDancingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    // Poetry (Poesia): [['IQ', 5], ['Language', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillPoetryId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillPoetryId,
        depends_on_skill_id: skillsIds.skillLanguageId,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: null
    },
    // Sculpting (Escultura): [['DX', 5], ['IQ', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSculptingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSculptingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    // Sing (Canto): [['HT', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'ht - 4'
    },
    // Writing (Escrita): [['IQ', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillWritingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    // Acrobatics (Acrobacia): [['DX', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillAcrobaticsId,
        depends_on_skill_id: null,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: 'dx - 6'
    },
    // Zero-G (Gravidade Zero): [['DX', 5], ['HT', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillZeroGId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillZeroGId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'ht - 5'
    },
    // Jumping (Salto): [['DX', 4], ['IQ', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillJumpingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillJumpingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: 'iq - 6'
    },
    // Diving (Mergulho): [['IQ', 5], ['Swimming', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillDivingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillDivingId,
        depends_on_skill_id: skillsIds.skillSwimmingId,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: null
    },
    // Skiing (Esqui): [['DX', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSkiingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: 'dx - 6'
    },
    // Swimming (NataÃ§Ã£o): [['ST', 5], ['DX', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSwimmingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'st - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSwimmingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    // Axe or Mace (Machado ou MaÃ§a): [['DX', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillAxeMaceId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    // Axe Throwing (Arremesso de Machado): [['DX', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillAxeThrowingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    // Combat Suit (Traje de Combate): [['IQ', 5], ['DX', 5], ['Pressure Suit', 3]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillCombatSuitId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillCombatSuitId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillCombatSuitId,
        depends_on_skill_id: skillsIds.skillPressureSuitId,
        depends_on_skill_value: '3',
        depends_on_skill_for_others_attributes: null
    },
    // ===== Skills from pericias2 =====
    // Beam Weapons (Armas de Feixe): [['DX', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBeamWeaponsId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    // Blackjack (Armas de Feixe): [['DX', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBlackjackId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    // Guns (Musket) (Armas de PÃ³lvora): [['DX', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillGunsMusketId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    // Blowpipe (Zarabatana): [['DX', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBlowpipeId,
        depends_on_skill_id: null,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: 'dx - 6'
    },
    // Bolas (Boleadeiras): [['DX', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBolasId,
        depends_on_skill_id: null,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: 'dx - 6'
    },
    // Bow (Arco): [['DX', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBowId,
        depends_on_skill_id: null,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: 'dx - 6'
    },
    // Broadsword (Espada de LÃ¢mina Larga): [['DX', 5], ['Shortsword', 2]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBroadswordId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBroadswordId,
        depends_on_skill_id: skillsIds.skillShortswordId,
        depends_on_skill_value: '2',
        depends_on_skill_for_others_attributes: null
    },
    // Buckler (Broquel): [['DX', 4], ['Shield', 2]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBucklerId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBucklerId,
        depends_on_skill_id: skillsIds.skillShieldId,
        depends_on_skill_value: '2',
        depends_on_skill_for_others_attributes: null
    },
    // Crossbow (Besta): [['DX', 4], ['Shield', 2]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillCrossbowId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillCrossbowId,
        depends_on_skill_id: skillsIds.skillShieldId,
        depends_on_skill_value: '2',
        depends_on_skill_for_others_attributes: null
    },
    // Fencing (Esgrima): [['DX', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillFencingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    // Flail (Mangual): [['DX', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillFlailId,
        depends_on_skill_id: null,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: 'dx - 6'
    },
    // Guns (Armas de Fogo): [['DX', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillGunsId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    // Knife (Faca): [['DX', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillKnifeId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    // Knife Throwing (Arremesso de Faca): [['DX', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillKnifeThrowingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    // Lance (Lança de Justa): [['DX', 6], ['Spear', 3]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillLanceId,
        depends_on_skill_id: null,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: 'dx - 6'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillLanceId,
        depends_on_skill_id: skillsIds.skillSpearId,
        depends_on_skill_value: '3',
        depends_on_skill_for_others_attributes: null
    },
    // Polearm (Armas de Haste): [['DX', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillPolearmId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    // Shield (Escudo): [['DX', 4], ['Buckler', 2]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillShieldId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillShieldId,
        depends_on_skill_id: skillsIds.skillBucklerId,
        depends_on_skill_value: '2',
        depends_on_skill_for_others_attributes: null
    },
    // Shortsword (Espadas Curtas): [['DX', 5], ['Broadsword', 2]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillShortswordId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillShortswordId,
        depends_on_skill_id: skillsIds.skillBroadswordId,
        depends_on_skill_value: '2',
        depends_on_skill_for_others_attributes: null
    },
    // Sling (Funda): [['DX', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSlingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: 'dx - 6'
    },
    // Spear (Lança): [['DX', 5], ['Staff', 2]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSpearId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSpearId,
        depends_on_skill_id: skillsIds.skillStaffId,
        depends_on_skill_value: '2',
        depends_on_skill_for_others_attributes: null
    },
    // Spear Thrower (Arremessador de Lança): [['DX', 4], ['Spear Throwing', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSpearThrowerId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSpearThrowerId,
        depends_on_skill_id: skillsIds.skillSpearThrowingId,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: null
    },
    // Spear Throwing (Arremesso de Lança): [['DX', 4], ['Spear Thrower', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSpearThrowingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSpearThrowingId,
        depends_on_skill_id: skillsIds.skillSpearThrowerId,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: null
    },
    // Staff (Bastão): [['DX', 5], ['Spear', 2]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillStaffId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillStaffId,
        depends_on_skill_id: skillsIds.skillSpearId,
        depends_on_skill_value: '2',
        depends_on_skill_for_others_attributes: null
    },
    // Two-Handed Axe/Mace (Machado de Duas Mãos/Maça): [['DX', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillTwoHandedAxeMaceId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    // Two-Handed Sword (Espadas de Duas Mãos): [['DX', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillTwoHandedSwordId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    // Armoury (Armeiro): [['IQ', 5], ['Smith', 3]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillArmouryId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillArmouryId,
        depends_on_skill_id: skillsIds.skillSmithId,
        depends_on_skill_value: '3',
        depends_on_skill_for_others_attributes: null
    },
    // Smith (Ferreiro): [['IQ', 5], ['Jeweler', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSmithId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSmithId,
        depends_on_skill_id: skillsIds.skillJewelerId,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: null
    },
    // Carpentry (Carpintaria): [['IQ', 4], ['DX', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillCarpentryId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'iq - 4'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillCarpentryId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'dx - 4'
    },
    // Cooking (Culinária): [['IQ', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillCookingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'iq - 4'
    },
    // Jeweler (Joalheiro): [['IQ', 6], ['Smith', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillJewelerId,
        depends_on_skill_id: null,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: 'iq - 6'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillJewelerId,
        depends_on_skill_id: skillsIds.skillSmithId,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: null
    },
    // Leatherworking (Trabalhos em Couro): [['IQ', 4], ['DX', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillLeatherworkingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'iq - 4'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillLeatherworkingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    // Mechanic (Mecânica): [['IQ', 5], ['Engineering (Mechanical)', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillMechanicId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillMechanicId,
        depends_on_skill_id: skillsIds.skillEngineeringMechanicalId,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: null
    },
    // Pottery (Cerâmica): [['IQ', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillPotteryId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    // Woodworking (Marcenaria): [['DX', 5], ['Carpentry', 3]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillWoodworkingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillWoodworkingId,
        depends_on_skill_id: skillsIds.skillCarpentryId,
        depends_on_skill_value: '3',
        depends_on_skill_for_others_attributes: null
    },
    // Mime/Pantomime (Mímica): [['DX', 5], ['Sign Language', 0]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillMimePantomimeId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillMimePantomimeId,
        depends_on_skill_id: skillsIds.skillSignLanguageId,
        depends_on_skill_value: '0',
        depends_on_skill_for_others_attributes: null
    },
    // Medicine (Medicina): [['Veterinary', 5], ['First Aid', 11], ['IQ', 7]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillMedicineId,
        depends_on_skill_id: skillsIds.skillVeterinaryId,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: null
    },
    // {
    //     id: crypto.randomUUID(),
    //     origin_skill_id: skillsIds.skillMedicineId,
    //     depends_on_skill_id: skillsIds.skillFirstAidId,
    //     depends_on_skill_value: '11',
    //     depends_on_skill_for_others_attributes: null
    // },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillMedicineId,
        depends_on_skill_id: null,
        depends_on_skill_value: '7',
        depends_on_skill_for_others_attributes: 'iq - 7'
    },
    // Surgery (Cirurgia): [['Veterinary', 5], ['Medicine', 5], ['Physiology', 8], ['First Aid', 12]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSurgeryId,
        depends_on_skill_id: skillsIds.skillVeterinaryId,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: null
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSurgeryId,
        depends_on_skill_id: skillsIds.skillMedicineId,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: null
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSurgeryId,
        depends_on_skill_id: skillsIds.skillPhysiologyId,
        depends_on_skill_value: '8',
        depends_on_skill_for_others_attributes: null
    },
    // {
    //     id: crypto.randomUUID(),
    //     origin_skill_id: skillsIds.skillSurgeryId,
    //     depends_on_skill_id: skillsIds.skillFirstAidId,
    //     depends_on_skill_value: '12',
    //     depends_on_skill_for_others_attributes: null
    // },
    // Climbing (Escalada): [['DX', 5], ['ST', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillClimbingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'dx - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillClimbingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: 'st - 5'
    },
    // Fishing (Pescaria): [['IQ', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillFishingId,
        depends_on_skill_id: null,
        depends_on_skill_value: '4',
        depends_on_skill_for_others_attributes: 'iq - 4'
    },
    // Naturalist (Naturalista): [['IQ', 6]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillNaturalistId,
        depends_on_skill_id: null,
        depends_on_skill_value: '6',
        depends_on_skill_for_others_attributes: 'iq - 6'
    },
    // Navigation (Navegação): [['Astronomy', 5], ['Seamanship', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillNavigationId,
        depends_on_skill_id: skillsIds.skillAstronomyId,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: null
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillNavigationId,
        depends_on_skill_id: skillsIds.skillSeamanshipId,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: null
    },
    // Seamanship (Marinhagem): [['IQ', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSeamanshipId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 4'
    },
    // Survival (Sobrevivência): [['IQ', 5], ['Naturalist', 3], ['Survival', 3]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSurvivalId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSurvivalId,
        depends_on_skill_id: skillsIds.skillNaturalistId,
        depends_on_skill_value: '3',
        depends_on_skill_for_others_attributes: null
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSurvivalId,
        depends_on_skill_id: skillsIds.skillSurvivalId,
        depends_on_skill_value: '3',
        depends_on_skill_for_others_attributes: null
    },
    // Tracking (Rastreamento): [['IQ', 5], ['Naturalist', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillTrackingId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillTrackingId,
        depends_on_skill_id: skillsIds.skillNaturalistId,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: null
    },
    // Accounting (Contabilidade): [['IQ', 10], ['Merchant', 5], ['Mathematics', 5]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillAccountingId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 10'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillAccountingId,
        depends_on_skill_id: skillsIds.skillMerchantId,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: null
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillAccountingId,
        depends_on_skill_id: skillsIds.skillMathematicsId,
        depends_on_skill_value: '5',
        depends_on_skill_for_others_attributes: null
    },
    // Computer Operation (Operação de Computadores): [['IQ', 4]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillComputerOperationId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 4'
    },
    // Electronics Operation (Operação de Aparelhos Eletrônicos): [['IQ', 5], ['Electronics', 3]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillElectronicsOperationId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 5'
    },
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillElectronicsOperationId,
        depends_on_skill_id: skillsIds.skillElectronicsId,
        depends_on_skill_value: '3',
        depends_on_skill_for_others_attributes: null
    },
    // Heraldry (Heráldica): [['IQ', 5], ['Savoir-Faire', 3]]
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillHeraldryId,
        depends_on_skill_id: null,
        depends_on_skill_value: null,
        depends_on_skill_for_others_attributes: 'iq - 5'
    }
]