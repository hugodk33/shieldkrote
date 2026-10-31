const seedCharacterElricGalhorn = {
  name: 'Elric Galhorn Denmark',
  description: 'A streetwise duelist with quick reflexes.',
  backstory: 'Former city watch turned blade-for-hire, she fights for freedom and survival.',

  points: 150,

  st: 11,
  dx: 12,
  iq: 13,
  ht: 10,

  hp: 11,
  fatigue: 10,

  basic_speed: 5.5,
  move: 5,

  encumbrance: 'Light',

  advantages: [
    {
      name: 'Combat Reflexes',
      points: 15,
      description: 'Exceptional reactions in dangerous situations.'
    },
    {
      name: 'Absolute Direction',
      points: 5,
      description: 'Always knows cardinal directions.'
    },
    {
      name: 'Fit',
      points: 5,
      description: 'Recovers fatigue more quickly.'
    }
  ],

  disadvantages: [
    {
      name: 'Code of Honor (Soldier)',
      points: -10,
      description: 'Maintains discipline and professional conduct.'
    },
    {
      name: 'Enemy',
      points: -10,
      description: 'A corrupt former captain of the city watch seeks revenge.'
    },
    {
      name: 'Overconfidence',
      points: -5,
      description: 'Frequently underestimates opponents.'
    }
  ],

  quirks: [
    {
      name: 'Sharpens weapons daily',
      points: -1
    },
    {
      name: 'Distrusts nobles',
      points: -1
    },
    {
      name: 'Prefers tavern food',
      points: -1
    },
    {
      name: 'Collects foreign coins',
      points: -1
    },
    {
      name: 'Sleeps lightly',
      points: -1
    }
  ],

  skills: [
    {
      name: 'Broadsword',
      level: 15,
      points: 12
    },
    {
      name: 'Fast-Draw (Sword)',
      level: 14,
      points: 2
    },
    {
      name: 'Shield',
      level: 14,
      points: 4
    },
    {
      name: 'Leadership',
      level: 13,
      points: 2
    },
    {
      name: 'Streetwise',
      level: 13,
      points: 4
    },
    {
      name: 'Observation',
      level: 12,
      points: 2
    }
  ],

  items: [
    {
      name: 'Short Sword',
      category: 'Weapon',
      weight: 3,
      quality: 'Fine'
    },
    {
      name: 'Dagger',
      category: 'Weapon',
      weight: 1,
      quality: 'Fine'
    },
    {
      name: 'Medium Shield',
      category: 'Shield',
      weight: 8,
      quality: 'Good'
    },
    {
      name: 'Leather Armor',
      category: 'Armor',
      weight: 18,
      quality: 'Good'
    },
    {
      name: 'Leather Bracers',
      category: 'Armor',
      weight: 2,
      quality: 'Good'
    },
    {
      name: 'Leather Boots',
      category: 'Armor',
      weight: 3,
      quality: 'Good'
    },
    {
      name: 'Travel Cloak',
      category: 'Clothing',
      weight: 2,
      quality: 'Normal'
    },
    {
      name: 'Coin Purse',
      category: 'Equipment',
      weight: 0.5,
      quality: 'Normal'
    }
  ],

  damages: [
    {
      name: 'Punch',
      value: '1d-1 cr',
      range: 'C'
    },
    {
      name: 'Heavy Punch',
      value: '1d cr',
      range: 'C'
    },
    {
      name: 'Sword Thrust',
      value: '1d imp',
      range: '1'
    },
    {
      name: 'Sword Swing',
      value: '2d cut',
      range: '1'
    },
    {
      name: 'Dagger Thrust',
      value: '1d imp',
      range: 'C,1'
    }
  ]
};

const seedCharacterLyraMoonwhisper = {
  name: 'Lyra Moonwhisper',
  description: 'A gifted wizard obsessed with ancient knowledge.',
  backstory: 'Raised within a secluded arcane academy, Lyra left to uncover forgotten magical secrets.',

  points: 150,

  st: 9,
  dx: 10,
  iq: 15,
  ht: 10,

  hp: 9,
  fatigue: 13,

  basic_speed: 5,
  move: 5,

  encumbrance: 'None',

  advantages: [
    {
      name: 'Magery 3',
      points: 35,
      description: 'Exceptional natural magical talent.'
    },
    {
      name: 'Eidetic Memory',
      points: 5,
      description: 'Excellent memory for spells and research.'
    },
    {
      name: 'Language Talent',
      points: 10,
      description: 'Quickly learns ancient and magical languages.'
    }
  ],

  disadvantages: [
    {
      name: 'Curious',
      points: -5,
      description: 'Cannot resist investigating mysteries.'
    },
    {
      name: 'Low Pain Threshold',
      points: -10,
      description: 'Poor tolerance for injury.'
    },
    {
      name: 'Pacifism (Reluctant Killer)',
      points: -5,
      description: 'Avoids taking lives whenever possible.'
    }
  ],

  quirks: [
    { name: 'Collects rare books', points: -1 },
    { name: 'Talks to herself while studying', points: -1 },
    { name: 'Prefers tea over ale', points: -1 },
    { name: 'Keeps detailed journals', points: -1 },
    { name: 'Sleeps very little', points: -1 }
  ],

  skills: [
    { name: 'Thaumatology', level: 16, points: 8 },
    { name: 'Research', level: 15, points: 4 },
    { name: 'Occultism', level: 15, points: 4 },
    { name: 'Alchemy', level: 14, points: 4 },
    { name: 'Meditation', level: 14, points: 2 }
  ],

  items: [
    {
      name: 'Wizard Staff',
      category: 'Weapon',
      weight: 4,
      quality: 'Fine'
    },
    {
      name: 'Spellbook',
      category: 'Equipment',
      weight: 3,
      quality: 'Fine'
    },
    {
      name: 'Robes',
      category: 'Armor',
      weight: 2,
      quality: 'Good'
    },
    {
      name: 'Potion Belt',
      category: 'Equipment',
      weight: 2,
      quality: 'Good'
    }
  ],

  damages: [
    {
      name: 'Staff Strike',
      value: '1d cr',
      range: '1'
    },
    {
      name: 'Fireball',
      value: '2d burn',
      range: '25'
    },
    {
      name: 'Lightning Bolt',
      value: '2d burn surge',
      range: '20'
    },
    {
      name: 'Ice Shard',
      value: '1d+2 imp',
      range: '15'
    }
  ]
};

const seedCharacterKaelShadowstep = {
  name: 'Kael Shadowstep',
  description: 'A nimble rogue specializing in infiltration and silent kills.',
  backstory: 'Raised among thieves and smugglers, Kael learned that information is often worth more than gold.',

  points: 150,

  st: 10,
  dx: 14,
  iq: 12,
  ht: 11,

  hp: 10,
  fatigue: 11,

  basic_speed: 6.25,
  move: 6,

  encumbrance: 'None',

  advantages: [
    {
      name: 'Flexibility',
      points: 5,
      description: 'Exceptional body control.'
    },
    {
      name: 'Acute Vision 2',
      points: 4,
      description: 'Excellent eyesight.'
    },
    {
      name: 'Night Vision 5',
      points: 5,
      description: 'Can operate effectively in darkness.'
    }
  ],

  disadvantages: [
    {
      name: 'Greed',
      points: -15,
      description: 'Has difficulty ignoring valuable treasures.'
    },
    {
      name: 'Secret',
      points: -10,
      description: 'Wanted by a major thieves guild.'
    },
    {
      name: 'Overconfidence',
      points: -5,
      description: 'Often takes unnecessary risks.'
    }
  ],

  quirks: [
    { name: 'Flips coins when nervous', points: -1 },
    { name: 'Never refuses a wager', points: -1 },
    { name: 'Dislikes guards', points: -1 },
    { name: 'Collects lockpicks', points: -1 },
    { name: 'Always plans an escape route', points: -1 }
  ],

  skills: [
    { name: 'Stealth', level: 16, points: 12 },
    { name: 'Lockpicking', level: 15, points: 8 },
    { name: 'Pickpocket', level: 15, points: 8 },
    { name: 'Knife', level: 16, points: 8 },
    { name: 'Climbing', level: 14, points: 4 },
    { name: 'Streetwise', level: 13, points: 4 }
  ],

  items: [
    {
      name: 'Fine Dagger',
      category: 'Weapon',
      weight: 1,
      quality: 'Fine'
    },
    {
      name: 'Throwing Knife',
      category: 'Weapon',
      weight: 0.5,
      quality: 'Good'
    },
    {
      name: 'Lockpick Set',
      category: 'Equipment',
      weight: 0.5,
      quality: 'Fine'
    },
    {
      name: 'Leather Armor',
      category: 'Armor',
      weight: 12,
      quality: 'Good'
    },
    {
      name: 'Dark Hooded Cloak',
      category: 'Clothing',
      weight: 2,
      quality: 'Good'
    }
  ],

  damages: [
    {
      name: 'Punch',
      value: '1d-2 cr',
      range: 'C'
    },
    {
      name: 'Dagger Thrust',
      value: '1d imp',
      range: 'C,1'
    },
    {
      name: 'Dagger Slash',
      value: '1d+1 cut',
      range: 'C,1'
    },
    {
      name: 'Thrown Knife',
      value: '1d imp',
      range: '10'
    },
    {
      name: 'Sneak Attack',
      value: '1d+2 imp',
      range: 'C,1'
    }
  ]
};