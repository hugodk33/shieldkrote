import * as skillsIds from './MainUUIDIds/uuidSkills'
import { mainGameTableId } from './MainUUIDIds/uuidGeral'

type SeedSkill = {
  id: string
  table_id: string
  name: string
  predefinition_type: string
  predefinition_difficulty: string
  description: string
}

export const  skills: SeedSkill[] = [
    {
        id: skillsIds.skillSwordsmanshipId,
        table_id: mainGameTableId,
        name: 'Swordsmanship',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: 'A skill for fighting with swords, including techniques for attack and defense.'
    },
    {
        id: skillsIds.skillBowsId,
        table_id: mainGameTableId,
        name: 'Bows',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: 'A skill for using bows and crossbows, covering aiming, shooting, and maintenance.'
    },
    {
        id: skillsIds.skillStealthId,
        table_id: mainGameTableId,
        name: 'Stealth',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "The ability to hide and move silently. A successful test roll indicates you can hide anywhere except a completely empty room, or move so quietly that no one will hear you, or follow someone without being noticed (to follow someone in a crowd use the Shadowing skill). Modifiers: minus your Encumbrance level; -5 to hide in an area without natural hiding places; -5 to move silently if running instead of walking; -5 to fool dogs instead of people."
    },
    {
        id: skillsIds.skillTacticsId,
        table_id: mainGameTableId,
        name: 'Tactics',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "The ability to plan military actions and predict those of the enemy. Normally taught only by the military. A successful skill test allows you to deduce the enemy's military plans, unless they are led by someone with this skill. In that case, the GM should make a Quick Contest of Skills between the two tacticians. If the player's character loses, they will make an incorrect conjecture about enemy plans."
    },
    {
        id: skillsIds.skillMagicId,
        table_id: mainGameTableId,
        name: 'Magery',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: 'A skill for casting spells and performing magical rituals.'
    },
    {
        id: skillsIds.skillSingId,
        table_id: mainGameTableId,                                  
        name: "Sing",         
        predefinition_type: "Physical",
        predefinition_difficulty: "Easy",
        description: "The study of this skill is based on HT, not DX. This is the ability to sing pleasantly. A success on a skill test means the audience liked your song. Modifiers: -2 if the audience doesn't understand the language you're singing in; +2 if you have the Melodious Voice advantage."
    },
    {
        id: skillsIds.skillStrategyId,
        table_id: mainGameTableId,                                  
        name: "Strategy",         
        predefinition_type: "Mental",
        predefinition_difficulty: "Hard",
        description: "The ability to plan military actions and predict those of the enemy. Normally taught only by the military. A successful skill test allows you to deduce the enemy's military plans, unless they are led by someone with this skill. In that case, the GM should make a Quick Contest of Skills between the two strategists. If the player's character loses, they will make an incorrect conjecture about enemy plans. The amount of information obtained depends on how good your test result was, but not on the quality of the enemy's plans."
    },
    // Skills from var-skills.ts (translated to English)
    {
        id: skillsIds.skillAnimalTrainingId,
        table_id: mainGameTableId,
        name: 'Animal Training',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: 'The ability to train and work with all kinds of animals. To train an animal, the trainer must succeed on a skill test each day of training. A failure means the animal learned nothing. A critical failure means the animal attacked the trainer.'
    },
    {
        id: skillsIds.skillFalconryId,
        table_id: mainGameTableId,
        name: 'Falconry',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'The ability to hunt small animals using a trained falcon. A good falconer knows hunting and training techniques, as well as how to care for a falcon.'
    },
    {
        id: skillsIds.skillAnimalPackingId,
        table_id: mainGameTableId,
        name: 'Animal Packing',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: 'The ability to load and unload animals quickly and efficiently. Includes the ability to correctly assess animals before purchase, get the best performance from them, and select the best routes for caravans.'
    },
    {
        id: skillsIds.skillRidingId,
        table_id: mainGameTableId,
        name: 'Riding',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: 'This skill is different for each type of animal. If you encounter a mount you are not familiar with, use your skill level with the closest animal type. Modifiers: +5 if the animal knows and likes you; -10 if the animal is not a "common" mount or has not been trained as such.'
    },
    {
        id: skillsIds.skillTeamsterId,
        table_id: mainGameTableId,
        name: 'Teamster',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'The skill of driving teams of animals, such as a wagon. Includes the ability to hitch and care for animals, and assess them before purchase. Driving a group with more than 4 animals, or with unfamiliar animals, subjects the character to a -2 penalty.'
    },
    {
        id: skillsIds.skillVeterinaryId,
        table_id: mainGameTableId,
        name: 'Veterinary',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: 'The ability to care for injured or sick animals. This is a Medical skill. Modifiers: +5 if the animal already knows and trusts you; -2 or worse if the animal is of a type you are not familiar with.'
    },
    {
        id: skillsIds.skillArtistId,
        table_id: mainGameTableId,
        name: 'Artist',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: 'The ability to draw and paint with beauty and precision. A success on a skill test could mean you made a drawing good enough to help identify a person, draw an easy-to-follow map, or even paint a picture good enough to trade for a meal.'
    },
    {
        id: skillsIds.skillBardId,
        table_id: mainGameTableId,
        name: 'Bard',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'The ability to tell stories and speak impromptu. Good use of this talent will allow you to give a good political speech, entertain a group of people around a campfire, incite (or calm) a riot, or succeed in the role of "court jester".'
    },
    {
        id: skillsIds.skillDancingId,
        table_id: mainGameTableId,
        name: 'Dancing',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: 'The ability to perform dances peculiar to your own culture and learn new styles quickly. Modifiers: -5 if the dance is unknown. A dance will be familiar to you after you successfully perform it 3 times.'
    },
    {
        id: skillsIds.skillPoetryId,
        table_id: mainGameTableId,
        name: 'Poetry',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'The ability to compose any kind of poetry known in your civilization with "good" quality, in any language you are fluent in. A successful Poetry test means you composed a good poem in an adequate time.'
    },
    {
        id: skillsIds.skillSculptingId,
        table_id: mainGameTableId,
        name: 'Sculpting',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: 'The ability to shape an image reasonably similar to a human being or object, using clay, wood, ivory, or whatever comes to hand. To produce a metal sculpture, you need to have forging skill.'
    },
    {
        id: skillsIds.skillWritingId,
        table_id: mainGameTableId,
        name: 'Writing',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'The ability to write clearly and/or entertainingly. A success on a skill test means the work is legible and accurate. Modifiers: -3 if you were in a hurry; +3 if you had plenty of time; -5 if you were writing about a subject you are not familiar with.'
    },
    {
        id: skillsIds.skillAcrobaticsId,
        table_id: mainGameTableId,
        name: 'Acrobatics',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: 'The ability to perform acrobatic and gymnastic feats, roll, take tumbles, etc. A test should be made for each trick you attempt. This skill can be convenient in an adventure; tightrope walking, human pyramids, and trapeze all have practical applications.'
    },
    {
        id: skillsIds.skillBreathControlId,
        table_id: mainGameTableId,
        name: 'Breath Control',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: 'The ability to breathe as efficiently as possible. On a successful skill test, the character can triple the time they can hold their breath for any reason. A success also enables recovery of 1 fatigue point in just two minutes.'
    },
    {
        id: skillsIds.skillZeroGId,
        table_id: mainGameTableId,
        name: 'Zero-G',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'The skill of dealing with a zero-gravity (free fall) environment. A test is required when you first enter free fall. A failure means you feel nauseous, and a successful HT test will be required to avoid suffocation.'
    },
    {
        id: skillsIds.skillJumpingId,
        table_id: mainGameTableId,
        name: 'Jumping',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: 'The skill of making the best possible use of your strength when jumping. When the character attempts a difficult jump, they may substitute their Jumping skill level for their ST or DX.'
    },
    {
        id: skillsIds.skillRunningId,
        table_id: mainGameTableId,
        name: 'Running',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: 'This skill is based on HT, not DX. It represents training in short and long distance running. If you studied this subject, divide your skill level by 8 (do not round) and add the result to your Speed parameter when calculating your Movement.'
    },
    {
        id: skillsIds.skillDivingId,
        table_id: mainGameTableId,
        name: 'Diving',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'The ability to use equipment to breathe underwater. To avoid ingesting water (which would result in loss of 1 ST point and risk of drowning), you must succeed on a test made as soon as you enter the water and subsequent tests made every 30 minutes.'
    },
    {
        id: skillsIds.skillSkiingId,
        table_id: mainGameTableId,
        name: 'Skiing',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: 'The ability to ski. A skill test is required when you start a descent, except on a very easy slope, and another every 30 minutes. A failure means you fall. In case of a critical failure, you suffer 1D-1 points of damage to a randomly chosen limb.'
    },
    {
        id: skillsIds.skillSwimmingId,
        table_id: mainGameTableId,
        name: 'Swimming',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: 'This skill is used both for swimming (or floating in emergency cases) and for saving a drowning victim. See Swimming for complete rules on swimming, drowning, and lifesaving.'
    },
    {
        id: skillsIds.skillAxeMaceId,
        table_id: mainGameTableId,
        name: 'Axe or Mace',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: 'Skill in using any small, unbalanced weapon like an axe, hatchet, mace, pickaxe, etc.'
    },
    {
        id: skillsIds.skillAxeThrowingId,
        table_id: mainGameTableId,
        name: 'Axe Throwing',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: 'Skill in throwing any balanced throwing axe, but not an unbalanced war axe.'
    },
    // new skill
    {
        id: skillsIds.skillCombatSuitId,
        table_id: mainGameTableId,
        name: 'Combat Suit',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'The ability to use a self-propelled armored suit, including the corresponding armament.'
    },
    {
        id: skillsIds.skillMedicineId,
        table_id: mainGameTableId,
        name: 'Medicine',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the generic professional skill for treating the sick, prescribing medications and treatments, etc. When a GM requires a test of Competence or general medical knowledge, it will be made against this skill. A doctor has the option of adopting a specialization."
    },
    {
        id: skillsIds.skillPerformanceId,
        table_id: mainGameTableId,
        name: 'Performance',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'The ability to act, perform, and tell stories for an audience.'
    },
    {
        id: skillsIds.skillLanguageId,
        table_id: mainGameTableId,
        name: 'Language',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'The ability to speak, read, and write a foreign language.'
    },
    {
        id: skillsIds.skillPressureSuitId,
        table_id: mainGameTableId,
        name: 'Pressure Suit',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'The ability to use a pressure suit or space suit for survival in hostile environments.'
    },
    // Skills from pericias2 (var-skills.ts)
    {
        id: skillsIds.skillBeamWeaponsId,
        table_id: mainGameTableId,
        name: 'Beam Weapons',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "This is the skill in using any type of Beam Weapon — ion beams, lasers, stunners, etc. It includes both pistol-type and rifle-type weapons, since neither suffers from recoil. If your IQ is 10 or 11, add 1 point to your skill level. If greater than 11, add 2 points. The modifiers are the same as those described for the Guns skill."
    },
    {
        id: skillsIds.skillBlackjackId,
        table_id: mainGameTableId,
        name: 'Blackjack',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "This weapon is only useful in close combat and, in most cases, is used for surprise attacks. Since it causes very small basic damage, it is usually used to strike the head. If you do not wish to cause serious injury, the attacker may 'pull their punch,' not using their full ST."
    },
    {
        id: skillsIds.skillGunsMusketId,
        table_id: mainGameTableId,
        name: 'Guns (Musket)',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "This is the skill in using gunpowder weapons, including muskets, pistols and rifles. Add 1 to your skill level if your IQ is 10 or 11, and 2 for IQ 12 or higher. The modifiers are the same as those found in Guns, p. 51."
    },
    {
        id: skillsIds.skillBlowpipeId,
        table_id: mainGameTableId,
        name: 'Blowpipe',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This is the skill in using the blowpipe to launch small darts (normally poisoned). These darts cannot pierce normal clothing, except in the case of a decisive success, and never penetrate clothing or armor. If a dart hits skin or light clothing, the poison may take effect. Modifiers: -2 or more in case of wind."
    },
    {
        id: skillsIds.skillBolasId,
        table_id: mainGameTableId,
        name: 'Bolas',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in throwing bolas (a leather strip with two or more weights attached to its ends) to entangle the victim. They are mainly used to stop animals in a herd, or hunting small wild animals or birds. They can also be used in combat. It is possible to dodge or block them, but an attempt to parry will cause them to automatically wrap around the weapon used. Exception: A successful parry with a cutting weapon will cut the strips, ruining the bolas."
    },
    {
        id: skillsIds.skillBowId,
        table_id: mainGameTableId,
        name: 'Bow',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This is the skill in using bows in general. It also covers composite bows, although someone who has never seen one before will need a successful IQ test to figure out how to use it correctly."
    },
    {
        id: skillsIds.skillBrawlingId,
        table_id: mainGameTableId,
        name: 'Brawling',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "This is the unscientific 'skill' of fist-fighting in close combat. Make a Brawling test whenever you attack an opponent with your hands or feet to see if you can hit them. Add 1/10 of your Brawling skill level (rounded down) to damage dealt. It is possible to parry twice per turn (one for each hand) when defending with bare hands, and your Parry parameter will be 2/3 of your Brawling skill level. With this skill, you can only parry attacks from hands, feet, and weapons used in close combat."
    },
    {
        id: skillsIds.skillBroadswordId,
        table_id: mainGameTableId,
        name: 'Broadsword',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in fighting with swords, including techniques for attack and defense."
    },
    {
        id: skillsIds.skillBucklerId,
        table_id: mainGameTableId,
        name: 'Buckler',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "This is the skill in using a buckler, a small shield used for active defense."
    },
    {
        id: skillsIds.skillCrossbowId,
        table_id: mainGameTableId,
        name: 'Crossbow',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "This is the skill in using crossbows, including bullet or stone crossbows. If you have this skill, you will know how siege-engine-type machines similar to crossbows work, but you will have no special ability in their use."
    },
    {
        id: skillsIds.skillFastDrawId,
        table_id: mainGameTableId,
        name: 'Fast-Draw',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "There is a separate skill for each type of weapon. It is available for the following weapons: Knife, Club, Sword (one-handed), Two-Handed Sword, Arrow (including crossbow bolts), Pistol, Rifle (including hand machine guns, etc.), magazines, speed loaders. The GM may add a new skill of this type for any weapon that can be drawn quickly, but is significantly different from all weapons above. This skill is used when you want to ready a weapon that is in its holster, sheath, etc. A success means you readied the weapon instantly (this does not count as a maneuver) and can attack with it (or load the bow) in the same turn. A failure means you readied the weapon normally, but can do nothing else this turn. A critical failure means you dropped the weapon."
    },
    {
        id: skillsIds.skillFencingId,
        table_id: mainGameTableId,
        name: 'Fencing',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to use fencer's weapons (rapier, smallsword, and sabre). The rapier is a long (range 2 hexes) and light thrusting weapon. The smallsword is a light, thrusting weapon, shorter (range 1 hex) somewhat similar to a modern foil with a point. The sabre is a light cutting and thrusting weapon. If you have one of these weapons, a small shield, and an Encumbrance no greater than Light, your Parry will be 2/3 of your Fencing skill level. Additionally, you can parry twice per turn."
    },
    {
        id: skillsIds.skillFlailId,
        table_id: mainGameTableId,
        name: 'Flail',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This is the skill in using unbalanced weapons with the head attached to the handle by a chain or cord, such as the flail, morningstar, or nunchaku. The flail is hard to use, but also hard to defend against. Any attempt to block one of these weapons is subject to a -2 penalty. Any attempt to parry has a -4 penalty. Knives and Fencing weapons cannot parry a Flail."
    },
    {
        id: skillsIds.skillGunsId,
        table_id: mainGameTableId,
        name: 'Guns',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "This is the skill in using any type of 20th-century cartridge weapon. Add 1 to your skill level if you have IQ 10 or 11, and 2 for IQ 12+. Modifiers: See Familiarity, p. 43. -2 for a weapon of a known type you are not familiar with; -4 or more for a weapon in poor condition; -4 or more for an unknown weapon type."
    },
    {
        id: skillsIds.skillJudoId,
        table_id: mainGameTableId,
        name: 'Judo',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This skill represents a general ability in falls and holds, not a specific school of unarmed combat. It is not possible to use Judo if holding anything in your hands or if your Encumbrance is greater than Light. Using Judo, you can parry with either hand as if it were a weapon, using 2/3 of your Judo skill level as your Parry."
    },
    {
        id: skillsIds.skillKarateId,
        table_id: mainGameTableId,
        name: 'Karate',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This skill does not represent any specific school of unarmed combat, but a general ability with punches and kicks. There is no penalty for using the left hand. Any hand used must be empty, and your Encumbrance must be Light or less. You can parry with either hand as if it were a weapon, using 2/3 of your Karate skill level as your Parry."
    },
    {
        id: skillsIds.skillKnifeId,
        table_id: mainGameTableId,
        name: 'Knife',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "The skill in using, but not throwing, any type of knife, dagger, or stiletto."
    },
    {
        id: skillsIds.skillKnifeThrowingId,
        table_id: mainGameTableId,
        name: 'Knife Throwing',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "The ability to throw any kind of knife."
    },
    {
        id: skillsIds.skillLanceId,
        table_id: mainGameTableId,
        name: 'Lance',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in using the jousting lance, a weapon similar to a normal spear, with a length of 3.5m or more, used on horseback. It is not common to parry in combat with lances; you must Block or Dodge enemy attacks."
    },
    {
        id: skillsIds.skillLassoId,
        table_id: mainGameTableId,
        name: 'Lasso',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in throwing the lasso. It is mainly used to lasso animals. You can try to lasso a specific body part, or choose one randomly from the Hit Location Table. Make a Quick Contest of ST if the lasso has caught an arm or torso. If the lassoer wins, the victim is immobilized; if they lose, they lost the rope."
    },
    {
        id: skillsIds.skillNetId,
        table_id: mainGameTableId,
        name: 'Net',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This is the skill in using the net as a weapon in a fight. It is possible to dodge a net, but not block or parry. In the case of a successful throw, the victim is entangled and unable to move or attack until the net is removed. To remove a net you need three successes, not necessarily consecutive, on DX tests."
    },
    {
        id: skillsIds.skillPolearmId,
        table_id: mainGameTableId,
        name: 'Polearm',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Skill in using very long and unbalanced pole weapons, including the bardiche, halberd, bill, and hundreds of variations of the type."
    },
    {
        id: skillsIds.skillShieldId,
        table_id: mainGameTableId,
        name: 'Shield',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "This is the skill in using a medieval-type shield or those used by shock troops. This skill is needed to attack with the Shield. However, the passive defense offered by the shield (1 to 4 points) protects whoever carries it, even if they do not know how to use it. The active defense of a shield (Block) is 1/2 of your Shield skill level."
    },
    {
        id: skillsIds.skillShortswordId,
        table_id: mainGameTableId,
        name: 'Shortsword',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in using any type of balanced weapon 30 to 60cm in length, including the cutlass, gladius, and short staff."
    },
    {
        id: skillsIds.skillSlingId,
        table_id: mainGameTableId,
        name: 'Sling',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This is the skill in using the sling or stave-sling."
    },
    {
        id: skillsIds.skillSpearId,
        table_id: mainGameTableId,
        name: 'Spear',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in using (but not throwing) any type of spear, dart, trident, bayonet, pike, or long, light, pointed weapon."
    },
    {
        id: skillsIds.skillSpearThrowerId,
        table_id: mainGameTableId,
        name: 'Spear Thrower',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This device, and the skill in its use, is different from the Spear Throwing skill, but the default level of one is equal to the other -4. A Spear Thrower is a long, flat rod with a notch and a strap at one end. It increases the force with which a dart or similar weapon is thrown, increasing the effective ST of the user (for range and damage) by 5 points."
    },
    {
        id: skillsIds.skillSpearThrowingId,
        table_id: mainGameTableId,
        name: 'Spear Throwing',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Skill in throwing any type of spear, dart, etc."
    },
    {
        id: skillsIds.skillFastReloadId,
        table_id: mainGameTableId,
        name: 'Fast Reload',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "This is the ability to quickly load a firearm. It is not the same as Fast-Draw, but you could, using the right skills, reload very quickly by drawing a speed loader or magazine from your belt or pocket and placing it in the weapon."
    },
    {
        id: skillsIds.skillStaffId,
        table_id: mainGameTableId,
        name: 'Staff',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This is the skill in using the Staff or any pole or improvised rod as a Staff. This is a type of weapon wielded with both hands. Your Parry will be 2/3 of your skill level."
    },
    {
        id: skillsIds.skillTwoHandedAxeMaceId,
        table_id: mainGameTableId,
        name: 'Two-Handed Axe/Mace',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Skill in using any long, heavy and unbalanced weapon such as the battleaxe or sledgehammer."
    },
    {
        id: skillsIds.skillTwoHandedSwordId,
        table_id: mainGameTableId,
        name: 'Two-Handed Sword',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in handling a long-bladed weapon (1m to 1.5m) with both hands. Note that the scimitar is used with this skill when wielded with two hands, but with the Broadsword skill when wielded with one hand."
    },
    {
        id: skillsIds.skillWhipId,
        table_id: mainGameTableId,
        name: 'Whip',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to use a whip as a weapon. Whips come in various lengths. In game terms, a 1m long whip has a reach of 1m. The time needed to re-ready a whip depends on its length: 0 turns for a 1m whip; 1 turn for a 2m whip; 2 turns for a 3m or longer whip."
    },
    {
        id: skillsIds.skillArmouryId,
        table_id: mainGameTableId,
        name: 'Armoury',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in building and repairing weapons and armor at the appropriate technology level. A successful test is needed to discover what is wrong with a weapon (unless it is obvious). A second success allows the character to repair it. The GM should determine a reasonable period for each repair attempt. Modifiers: -4 if the weapon is unfamiliar; -4 if you don't have the appropriate tools (-5 at TL 9+)."
    },
    {
        id: skillsIds.skillSmithId,
        table_id: mainGameTableId,
        name: 'Smith',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill of working manually with iron and other non-precious metals. For this work a forge is needed, but with the proper materials, a smith can build one in about 30 days. Modifier: -1 for each point of ST below 13."
    },
    {
        id: skillsIds.skillCarpentryId,
        table_id: mainGameTableId,
        name: 'Carpentry',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "This is the skill in manufacturing wooden objects. A successful test roll allows one hour of competent carpentry work. A failure means the work result was poor. Modifiers: +5 if you are being supervised or assisted by someone with skill level 15+; -5 if you don't have good tools."
    },
    {
        id: skillsIds.skillCookingId,
        table_id: mainGameTableId,
        name: 'Cooking',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "This is the skill in preparing a pleasant meal from raw ingredients. In any 'outdoor' society, this skill will include the ability to clean game, i.e., prepare a freshly killed animal for cooking."
    },
    {
        id: skillsIds.skillJewelerId,
        table_id: mainGameTableId,
        name: 'Jeweler',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the skill in working with precious metals of all types, manufacturing jewelry, decorating weapons, and so on. A forge is needed (see Smith, above) to work the metal. A jeweler can identify any precious metal, or determine the value of any precious trinket, if they succeed on a skill test."
    },
    {
        id: skillsIds.skillLeatherworkingId,
        table_id: mainGameTableId,
        name: 'Leatherworking',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "This is the skill in working with leather to make belts, saddles, armor, etc. Someone with this skill can make new objects or repair used ones. With a successful skill test, they can determine the value of a leather object."
    },
    {
        id: skillsIds.skillMechanicId,
        table_id: mainGameTableId,
        name: 'Mechanic',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in diagnosing and solving common mechanical problems, usually, but not always, in a vehicle's engine."
    },
    {
        id: skillsIds.skillPotteryId,
        table_id: mainGameTableId,
        name: 'Pottery',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in working with various types of ceramics. A potter can make pots and other clay utensils. With a successful skill test, they can identify appropriate clay (for bricks or domestic utensils); determine the origin or value of a ceramic object; etc."
    },
    {
        id: skillsIds.skillWoodworkingId,
        table_id: mainGameTableId,
        name: 'Woodworking',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in performing 'fine' woodwork; furniture construction, decorative carvings, etc. With a successful skill test, a woodworker can determine the origin and fair value of a wood carving, or identify the type of wood used."
    },
    {
        id: skillsIds.skillMimePantomimeId,
        table_id: mainGameTableId,
        name: 'Mime/Pantomime',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "This is the ability to communicate through simple improvised hand signals. Deaf and/or mute individuals have a +3 bonus when using this skill. A successful Mime/Pantomime test allows you to communicate a simple idea to another person, or understand one communicated by another."
    },
    {
        id: skillsIds.skillSignLanguageId,
        table_id: mainGameTableId,
        name: 'Sign Language',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is any of the true gesture languages. One of the best known is American Sign Language (Ameslan). Other examples could be the language of a speechless alien race, a sign code used by spies or revolutionaries, etc. A sign language is complex, stylized, and can communicate practically any concept."
    },
    {
        id: skillsIds.skillTelegraphyId,
        table_id: mainGameTableId,
        name: 'Telegraphy',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "This is the ability to send and receive Morse code, perform small repairs on telegraph systems, and recognize other telegraph operators by their 'fist,' i.e., their characteristic way of sending a message. This skill is normally found between technology levels 5 and 7."
    },
    {
        id: skillsIds.skillSurgeryId,
        table_id: mainGameTableId,
        name: 'Surgery',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "This skill is used when someone attempts to operate on a character to cure diseases, injuries, or organic dysfunctions. A surgeon may optionally specialize in a particular part of the body."
    },
    {
        id: skillsIds.skillClimbingId,
        table_id: mainGameTableId,
        name: 'Climbing',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to climb mountains, stone walls, trees, building walls, and anything else that appears in your path. Modifiers: +3 if you have the Double-Jointed advantage; minus your Encumbrance level."
    },
    {
        id: skillsIds.skillFishingId,
        table_id: mainGameTableId,
        name: 'Fishing',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "This is the ability to catch a fish (with a net, hook and line, or any other method used by your culture). If you have the appropriate equipment and there are fish to be caught, a successful skill test will bring them to you. When no fishing materials are available, you can improvise."
    },
    {
        id: skillsIds.skillNaturalistId,
        table_id: mainGameTableId,
        name: 'Naturalist',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This skill comprises knowledge of animals, plants, and nature in its various forms. It is the kind of knowledge one would expect from a good 20th-century biology teacher. A successful skill test allows identification of a plant and its application, or tells you something about an animal and its habits."
    },
    {
        id: skillsIds.skillNavigationId,
        table_id: mainGameTableId,
        name: 'Navigation',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the ability to know your position (on Earth, not in space) by the stars, ocean currents, etc. A successful skill test will tell you where you are, at sea or on land. Note that if you don't have the skill and are attempting a test at default level, you cannot use your Seamanship skill if you are not actually at sea!"
    },
    {
        id: skillsIds.skillSeamanshipId,
        table_id: mainGameTableId,
        name: 'Seamanship',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "This is the ability to crew a long-range vessel. You will need to crew a ship (or captain it!). Modifiers: standard penalties related to TL."
    },
    {
        id: skillsIds.skillSurvivalId,
        table_id: mainGameTableId,
        name: 'Survival',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill of 'living off the land,' finding water and good food, avoiding dangers, building shelters, etc. Each type of terrain requires a different skill."
    },
    {
        id: skillsIds.skillTrackingId,
        table_id: mainGameTableId,
        name: 'Tracking',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to follow a trail left by a man or animal. Make a Tracking test to find a clue and another every 5 minutes of travel. Modifiers: -5 if the trail is more than a day old; -10 if more than a week; +5 if following a man; +10 if following a group of men."
    },
    {
        id: skillsIds.skillAccountingId,
        table_id: mainGameTableId,
        name: 'Accounting',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the ability to keep a company's books up to date, examine the conditions of a business, etc., being mainly useful as a means of getting a job. However, a successful Accounting test (requiring about 2 hours of study) can tell you if a company's records are correct."
    },
    {
        id: skillsIds.skillComputerOperationId,
        table_id: mainGameTableId,
        name: 'Computer Operation',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "This is the ability to operate a computer, extract data, run existing programs, play video games, etc. This is not the same as programming (which is a separate and more difficult skill). Modifiers: -3 or more in case of a strange computer or program. This skill is only available at TL 7+."
    },
    {
        id: skillsIds.skillElectronicsOperationId,
        table_id: mainGameTableId,
        name: 'Electronics Operation',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This skill allows the use of electronic equipment within a known specialty. There is no need for skill tests for normal daily use of equipment. They are needed only in emergency situations, cases of 'abnormal' use of the equipment, or use of complex equipment by inexperienced people."
    },
    {
        id: skillsIds.skillHeraldryId,
        table_id: mainGameTableId,
        name: 'Heraldry',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in designing and recognizing coats of arms, clan colors and devices, and other emblems. If successful on a skill test, a herald can recognize a knight or noble by the standard or shield being carried and describe them appropriately in heraldic terms."
    },
    {
        id: skillsIds.skillLawId,
        table_id: mainGameTableId,
        name: 'Law',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Modifiers: +4 if the character is dealing with the Law of a specific area. A successful skill test allows them to remember, deduce, or devise an answer to a question about the law. Remember, however, that few legal questions have a precise answer."
    },
    {
        id: skillsIds.skillAgronomyId,
        table_id: mainGameTableId,
        name: 'Agronomy',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the science of plant cultivation. An agronomist could answer questions or solve problems related to agriculture and livestock. An experienced farmer is an agronomist, whether they know the word or not."
    },
    {
        id: skillsIds.skillAlchemyId,
        table_id: mainGameTableId,
        name: 'Alchemy',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "This is the science of magical transmutations."
    },
    {
        id: skillsIds.skillAnthropologyId,
        table_id: mainGameTableId,
        name: 'Anthropology',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of human culture and evolution. An anthropologist knows the customs of primitive (and not-so-primitive) groups of human beings (or other intelligent creatures they study). Anthropology tests could be used to explain, or even predict, the strange rituals and customs a traveler might encounter."
    },
    {
        id: skillsIds.skillArchaeologyId,
        table_id: mainGameTableId,
        name: 'Archaeology',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of ancient civilizations. An archaeologist feels at home with excavations, pottery shards, inscriptions, etc. In case of a successful skill test, an archaeologist can answer questions about ancient history, identify artifacts and dead languages, etc."
    },
    {
        id: skillsIds.skillArchitectureId,
        table_id: mainGameTableId,
        name: 'Architecture',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in designing buildings and inferring the form of buildings from their function and vice versa. A successful Architecture test would allow you to draw conclusions about an unknown building, find a secret room or passage, etc."
    },
    {
        id: skillsIds.skillAstronavigationId,
        table_id: mainGameTableId,
        name: 'Astronavigation',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This skill relates to space and interstellar navigation. There is a different skill for each type of faster-than-light propulsion. Each of these skills can have its default level set by another with a penalty of up to -4, depending on how different the propulsion systems are."
    },
    {
        id: skillsIds.skillAstronomyId,
        table_id: mainGameTableId,
        name: 'Astronomy',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of stars and other celestial bodies. An astronomer could solve problems related to the Sun, the planets of the solar system, meteorites, and so on. At TL 4 and below, this skill merges with Astrology."
    },
    {
        id: skillsIds.skillBiochemistryId,
        table_id: mainGameTableId,
        name: 'Biochemistry',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "This is the study of the chemistry of living beings. A biochemist is a specialist in the chemical reactions that sustain life."
    },
    {
        id: skillsIds.skillBotanyId,
        table_id: mainGameTableId,
        name: 'Botany',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of plants. A botanist can identify plants, make assumptions about the habitat and properties of an unknown plant, etc."
    },
    {
        id: skillsIds.skillChemistryId,
        table_id: mainGameTableId,
        name: 'Chemistry',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of matter. A chemist can identify elements, simple compounds. With the appropriate equipment, they can perform complex analyses and syntheses."
    },
    {
        id: skillsIds.skillComputerProgrammingId,
        table_id: mainGameTableId,
        name: 'Computer Programming',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the skill of writing computer programs."
    },
    {
        id: skillsIds.skillCriminologyId,
        table_id: mainGameTableId,
        name: 'Criminology',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the study of crime and criminal behavior."
    },
    {
        id: skillsIds.skillEconomicsId,
        table_id: mainGameTableId,
        name: 'Economics',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of money, exchange, and banking transactions. An economist could answer questions about investments, economic programs, etc. They could also predict the local effects of economic changes."
    },
    {
        id: skillsIds.skillEcologyId,
        table_id: mainGameTableId,
        name: 'Ecology',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of relationships between living beings, or the entire environment. This science does not exist at TL below 6. Use Naturalist instead. An ecologist could tell which creatures are vital to an environment and which are not."
    },
    {
        id: skillsIds.skillElectronicsId,
        table_id: mainGameTableId,
        name: 'Electronics',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is electronic engineering, the ability to design and build electronic devices. A successful test could determine the purpose of an unknown device, diagnose a fault, perform a repair, design new systems, or improvise a device to solve a problem."
    },
    {
        id: skillsIds.skillEngineeringMechanicalId,
        table_id: mainGameTableId,
        name: 'Engineering (Mechanical)',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the skill in designing and building complex mechanisms. A successful test allows determining the purpose of an unknown mechanism, diagnosing an electrical or mechanical problem, making a repair, designing a new mechanism, or improvising a device to solve a problem."
    },
    {
        id: skillsIds.skillForensicsId,
        table_id: mainGameTableId,
        name: 'Forensics',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the general science of 'laboratory' criminology: calculating bullet trajectories, chemical or microscopic analysis of clues, etc. Depending on the situation, the GM may allow the use of Chemistry or another appropriate field of study as a default for Forensics."
    },
    {
        id: skillsIds.skillGeneticsId,
        table_id: mainGameTableId,
        name: 'Genetics',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "This is the study of heredity. A geneticist can identify genetic diseases, knows how to cross animals to develop certain characteristics, etc. The specialty Genetic Engineering comes into existence at TL 9+."
    },
    {
        id: skillsIds.skillGeologyId,
        table_id: mainGameTableId,
        name: 'Geology',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the science that studies the Earth. A geologist studies ores, rocks, oil, knows about earthquakes, volcanoes, and fossils. In a campaign, they could find water using their 'field sensitivity' as in the Survival skill."
    },
    {
        id: skillsIds.skillHistoryId,
        table_id: mainGameTableId,
        name: 'History',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of the recorded past (as opposed to archaeology which studies pre-historic past). A historian can answer questions about history and might be allowed (at the GM's discretion) to test if they remember a useful historical parallel."
    },
    {
        id: skillsIds.skillLinguisticsId,
        table_id: mainGameTableId,
        name: 'Linguistics',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "This is the study of the principles on which languages are based. A linguist can identify an unknown language from a fragment of written or spoken text, if successful on a skill test."
    },
    {
        id: skillsIds.skillLiteratureId,
        table_id: mainGameTableId,
        name: 'Literature',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of great literary works. A student of literature would have knowledge of ancient poetry, dusty volumes, philosophy, criticism, etc. This can be useful for finding clues to hidden treasures, submerged continents, secrets man was not meant to know, and similar things."
    },
    {
        id: skillsIds.skillMathematicsId,
        table_id: mainGameTableId,
        name: 'Mathematics',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This represents general knowledge of mathematics. Although there are dozens of specialties, it is unlikely that the difference between them will affect the game. A mathematician can make skill tests to answer any type of math-related problem."
    },
    {
        id: skillsIds.skillMetallurgyId,
        table_id: mainGameTableId,
        name: 'Metallurgy',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of metals and their properties. A metallurgist can identify metals or alloys and solve problems related to metals, their mining, and refining."
    },
    {
        id: skillsIds.skillMeteorologyId,
        table_id: mainGameTableId,
        name: 'Meteorology',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the study of weather and the ability to predict it. The GM always makes Meteorology skill tests for the player. A good result means they will tell the truth, while a failure means a random answer or a lie."
    },
    {
        id: skillsIds.skillNuclearPhysicsId,
        table_id: mainGameTableId,
        name: 'Nuclear Physics',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "This is the study of nuclear processes. A nuclear physicist could answer questions about the interior of the sun, nuclear weapons, and/or nuclear power plants."
    },
    {
        id: skillsIds.skillOccultismId,
        table_id: mainGameTableId,
        name: 'Occultism',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the study of the inexplicable and/or supernatural. An occultist has intense knowledge of mysticism, primitive magical doctrines, ancient rituals, obsessions, etc. Remember that an occultist does not necessarily have to believe in the material they study."
    },
    {
        id: skillsIds.skillPhysicsId,
        table_id: mainGameTableId,
        name: 'Physics',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of matter, energy, and the fundamental forces of nature."
    },
    {
        id: skillsIds.skillPhysiologyId,
        table_id: mainGameTableId,
        name: 'Physiology',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "This is the study of the human body and its functions. A physiologist knows where muscles, bones, and organs are located and how they function."
    },
    {
        id: skillsIds.skillProspectingId,
        table_id: mainGameTableId,
        name: 'Prospecting',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is applied geology: the ability to discover valuable minerals through local inspection. Long-distance prospecting, using maps and instruments, requires the Geology skill. A prospector is subject to a -1 penalty in a new area of a familiar type."
    },
    {
        id: skillsIds.skillPsychologyId,
        table_id: mainGameTableId,
        name: 'Psychology',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of behavior. A psychologist deals with the human mind (and possibly other types too). A successful Psychology test can predict, in general terms, the behavior of an individual or small group in a defined situation."
    },
    {
        id: skillsIds.skillResearchId,
        table_id: mainGameTableId,
        name: 'Research',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This skill can also have its default level set by any scientific skill (subject to a -2 penalty), if you are researching material related to it. Research is the general ability to conduct an investigation in a library or archive. A successful Research test in an appropriate place will allow you to discover some useful piece of information."
    },
    {
        id: skillsIds.skillTheologyId,
        table_id: mainGameTableId,
        name: 'Theology',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of religion. A theologian has knowledge of ancient and modern religious creeds, history of religions, etc. You should consider having this skill, specialized in your own religion, if your character is a priest or saint."
    },
    {
        id: skillsIds.skillZoologyId,
        table_id: mainGameTableId,
        name: 'Zoology',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the study of animals. A zoologist can identify animals, have a good idea about their natural diet, habits and habitat, and predict their behavior."
    },
    {
        id: skillsIds.skillActingId,
        table_id: mainGameTableId,
        name: 'Acting',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to simulate moods, emotions, and voices, and to lie convincingly for a period of time. It is not the same as Disguise or Performance. A successful skill test allows you to pretend to think or feel something you do not feel. Modifiers: +1 for each point of IQ you have over the person you are trying to deceive."
    },
    {
        id: skillsIds.skillAdministrationId,
        table_id: mainGameTableId,
        name: 'Administration',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to direct a large organization. It is mainly useful for making money or qualifying for high positions. A trained administrator (level 15+) receives a +2 bonus when dealing with a bureaucrat and, on a successful skill test, can predict the best way to deal with a bureaucracy."
    },
    {
        id: skillsIds.skillAreaKnowledgeId,
        table_id: mainGameTableId,
        name: 'Area Knowledge',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "This is familiarity with the people, politics, and geography of a given area. Normally a character will have Area Knowledge only of the area they consider their 'base,' whether a simple farm or an entire solar system."
    },
    {
        id: skillsIds.skillCarousingId,
        table_id: mainGameTableId,
        name: 'Carousing',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This skill is 'bought' based on your HT attribute, not DX. It is the ability to participate in social activities, parties, etc. A successful Carousing test, made under the right circumstances, gives you a +2 bonus on a request for help or information."
    },
    {
        id: skillsIds.skillDiplomacyId,
        table_id: mainGameTableId,
        name: 'Diplomacy',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the ability to negotiate, make deals, and get along with others. A Diplomacy test can replace any reaction test in a situation where combat is not imminent. A successful test allows you to predict the possible outcomes of a course of action while negotiating."
    },
    {
        id: skillsIds.skillFastTalkId,
        table_id: mainGameTableId,
        name: 'Fast-Talk',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to persuade others to do things against their better judgment. It is not taught (at least intentionally) in schools; it is learned while working as a salesman, con artist, lawyer, etc."
    },
    {
        id: skillsIds.skillGamblingId,
        table_id: mainGameTableId,
        name: 'Gambling',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill with games of chance. A successful Gambling test can tell you, among other things, whether the game is fair or not, identify a gambler among a group of strangers, or evaluate the odds in a complicated situation."
    },
    {
        id: skillsIds.skillLeadershipId,
        table_id: mainGameTableId,
        name: 'Leadership',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in coordinating a group of people in a tense or dangerous situation. Some level of leadership is needed to get a post in a military or paramilitary organization."
    },
    {
        id: skillsIds.skillMerchantId,
        table_id: mainGameTableId,
        name: 'Merchant',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in trading, buying and selling goods. It involves a talent for sales, understanding of business practices, and psychology. On a successful skill test, a Merchant can evaluate goods, discover where a given article is bought or sold, etc."
    },
    {
        id: skillsIds.skillSexAppealId,
        table_id: mainGameTableId,
        name: 'Sex Appeal',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Based on HT, not IQ. This is the ability to impress the opposite sex. It can only be studied in spare time (maximum 3 hours per day), unless you are part of a harem or similar. Sex Appeal has as much to do with your attitude as with your appearance."
    },
    {
        id: skillsIds.skillTeachingId,
        table_id: mainGameTableId,
        name: 'Teaching',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to teach other people. To teach someone, you need to know the skill being studied at a higher level than your student. For game purposes, anyone with a level 12+ should be able to act as a teacher in most situations."
    },
    {
        id: skillsIds.skillCamouflageId,
        table_id: mainGameTableId,
        name: 'Camouflage',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "This is the skill in using natural elements and/or paint to disguise yourself and hide your position, equipment, etc. To determine if the camouflage was done well, a Quick Contest of Skills (Vision vs. Camouflage) should be made."
    },
    {
        id: skillsIds.skillDemolitionId,
        table_id: mainGameTableId,
        name: 'Demolition',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to blow things up. Every time you use explosives, a Demolition test is required. It takes 15 to 60 minutes to properly install explosives and detonate them. A successful skill test means everything went well. A failure means you made a mistake."
    },
    {
        id: skillsIds.skillDetectLiesId,
        table_id: mainGameTableId,
        name: 'Detect Lies',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the ability to tell if someone is lying or not. It is not the same as Interrogation; Detect Lies works in informal and social situations. When you ask to use this skill, the GM will make a Quick Contest between your Detect Lies and the target's IQ."
    },
    {
        id: skillsIds.skillDisguiseId,
        table_id: mainGameTableId,
        name: 'Disguise',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to make yourself look like another person, through the use of clothing, makeup, etc. It takes 30 to 60 minutes to prepare a good disguise. Make a Quick Contest of Skills (usually Disguise vs. IQ) for each person or group your disguise needs to fool."
    },
    {
        id: skillsIds.skillEscapeId,
        table_id: mainGameTableId,
        name: 'Escape',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to free yourself from ropes, handcuffs, and similar restraints. The first attempt to escape takes 1 minute; each subsequent attempt takes 10 minutes. Modifiers: The more carefully you are tied up, the greater the penalty the GM will apply."
    },
    {
        id: skillsIds.skillForgeryId,
        table_id: mainGameTableId,
        name: 'Forgery',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This is the ability to forge a bill, passport, or other similar document. It is not taught except by espionage organizations and the underworld, although you can always study it on your own. A skill test is required every time a forged document you are using is inspected."
    },
    {
        id: skillsIds.skillHoldoutId,
        table_id: mainGameTableId,
        name: 'Holdout',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This is the ability to hide objects on your body or on other people (normally with their cooperation). It is also the ability to find such objects hidden by others."
    },
    {
        id: skillsIds.skillIntelligenceAnalysisId,
        table_id: mainGameTableId,
        name: 'Intelligence Analysis',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "The ability to analyze and interpret secret information (normally military) in order to assess enemy plans and resources."
    },
    {
        id: skillsIds.skillInterrogationId,
        table_id: mainGameTableId,
        name: 'Interrogation',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to interrogate a prisoner. It is only taught in secret services, police forces, prisons, military units, and the underworld."
    },
    {
        id: skillsIds.skillLipReadingId,
        table_id: mainGameTableId,
        name: 'Lip Reading',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to see what others are saying. To do so, you must be at a distance of less than 6 meters, or use magic or binoculars for visual approximation. Each successful test allows you to catch one phrase of the conversation."
    },
    {
        id: skillsIds.skillLockpickingId,
        table_id: mainGameTableId,
        name: 'Lockpicking',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to open locks, padlocks, and safes without having the key or combination. Each attempt takes 1 minute. If you succeed in opening the lock, each point of your margin of success reduces the time spent by 5 seconds."
    },
    {
        id: skillsIds.skillPickpocketId,
        table_id: mainGameTableId,
        name: 'Pickpocket',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This is the ability to take a wallet, knife, etc. from someone, or 'plant' something on them. Modifiers: +5 if the victim is distracted; +10 if they are asleep or drunk; up to -5 for items in an inner pocket."
    },
    {
        id: skillsIds.skillPoisonId,
        table_id: mainGameTableId,
        name: 'Poison',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the general practical knowledge of poisons. A successful test allows you to recognize a poisonous plant in the field, distill poison into a useful form, recognize poison by taste in food or drink, identify poison by observing its effects, or know the proper antidote."
    },
    {
        id: skillsIds.skillScroungingId,
        table_id: mainGameTableId,
        name: 'Scrounging',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "This is the ability to find, recover, or improvise useful objects that others cannot locate. Each attempt takes one hour. The scrounger does not necessarily steal their loot — they just locate it and then obtain it by whatever means necessary."
    },
    {
        id: skillsIds.skillShadowingId,
        table_id: mainGameTableId,
        name: 'Shadowing',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to follow another person in a crowd without being noticed. (Use Tracking and Stealth when in the countryside.) Make a Contest between your Shadowing and the victim's Vision every 10 minutes."
    },
    {
        id: skillsIds.skillSleightOfHandId,
        table_id: mainGameTableId,
        name: 'Sleight of Hand',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "This is the ability to 'palm' small objects, do tricks with coins and cards, etc. Each success on a skill test allows you to perform a small 'magic trick'. A failure means you messed up the trick."
    },
    {
        id: skillsIds.skillStreetwiseId,
        table_id: mainGameTableId,
        name: 'Streetwise',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to get along well with 'bad company'. A successful skill test can allow you to find out where any type of illegal activity is happening; which local police or bureaucrats can be bought and for how much; how to contact the local underworld, etc."
    },
    {
        id: skillsIds.skillTrapsId,
        table_id: mainGameTableId,
        name: 'Traps',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in building traps and detection devices and how to neutralize them. A successful Traps test enables detection of a trap, if you are looking for it; disarming a trap after detection; rearming it after passing; or (with appropriate material) building a new one."
    },
    {
        id: skillsIds.skillUnderwaterDemolitionId,
        table_id: mainGameTableId,
        name: 'Underwater Demolition',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Skill in preparing and detonating an explosive charge underwater. Otherwise, same as Demolition (above). If a demolition engineer is using the default level of this skill, the test only serves to evaluate the preparation of the charge."
    },
    {
        id: skillsIds.skillVentriloquismId,
        table_id: mainGameTableId,
        name: 'Ventriloquism',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "This is the ability to disguise and 'throw' your voice a short distance. A successful skill test allows you to throw your voice well enough to fool your audience. Modifiers: +5 if you have a puppet or accomplice to distract the audience's attention."
    },
    {
        id: skillsIds.skillCyclingId,
        table_id: mainGameTableId,
        name: 'Cycling',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "This is the ability to ride a bicycle without falling. You can also make a test roll with a -5 penalty to try to repair a broken bicycle, assuming tools and spare parts are available."
    },
    {
        id: skillsIds.skillBoatingId,
        table_id: mainGameTableId,
        name: 'Boating',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the skill in handling canoes, rowboats, small sailboats, etc. By definition, a test roll is needed when getting into the boat (to avoid falling in the water) and another to get the boat moving. The GM may require new tests whenever danger arises."
    },
    {
        id: skillsIds.skillDrivingId,
        table_id: mainGameTableId,
        name: 'Driving',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to drive a specific type of vehicle (a specialization is needed). Modifiers: -2 for a vehicle of a known type you are not familiar with; -2 or more for a vehicle in poor condition; -2 or more for poor driving conditions."
    },
    {
        id: skillsIds.skillMotorcycleId,
        table_id: mainGameTableId,
        name: 'Motorcycle',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "This is the ability to ride a motorcycle. A specialization is needed in light scooters/motorcycles or medium/heavy motorcycles. Modifiers: -2 for an unfamiliar motorcycle of a known type; -4 or more for a motorcycle in poor condition."
    },
    {
        id: skillsIds.skillPilotingId,
        table_id: mainGameTableId,
        name: 'Piloting',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to pilot a specific type of aircraft or spacecraft. A specialization is needed. The default level uses IQ, as intelligence is needed to understand the controls in an emergency. But when the skill is normally learned, it is based on DX like other physical skills."
    },
    {
        id: skillsIds.skillPowerboatId,
        table_id: mainGameTableId,
        name: 'Powerboat',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "This is the ability to drive all types of small motorized vessels. When using the default level of this skill, a DX or Boating test is needed when getting into the boat (to avoid falling in the water). All dangerous situations require another roll."
    },
    {
        id: skillsIds.skillMeditationId,
        table_id: mainGameTableId,
        name: 'Meditation',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: 'The ability to calm the mind and achieve inner peace. Can be used to resist mental attacks and recover fatigue from mental exertion.'
    },
    {
        id: skillsIds.skillThaumatologyId,
        table_id: mainGameTableId,
        name: 'Thaumatology',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: 'The scholarly study of magic, including its theory, history, and underlying principles. Provides knowledge of all magical colleges.'
    }
]