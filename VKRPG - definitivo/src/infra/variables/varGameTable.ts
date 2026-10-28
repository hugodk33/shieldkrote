import crypto from 'crypto'

import { mainGameTableId, mainNarratorId, adminId } from './MainUUIDIds/uuidGeral'

import { users } from './varUsers'


type SeedNarrator = {
  id: string
  userId: string
  name: string
}

export const  narrators: SeedNarrator[] = [
  {
    id: mainNarratorId,
    userId: adminId,
    name: 'admin'
  }
]

const  narratorId = mainNarratorId

type SeedGameTable = {
  id: string
  title: string
  system: string
  narratorId: string
  intro: string
}

export const  gameTables: [SeedGameTable] = [
  {
    id: mainGameTableId,
    narratorId,
    title: 'The Shadow of Old King',
    system: 'GURPS',
    intro: 'In the crumbling streets of the kingdom\'s capital, a shadow falls over the city. The ancient noble houses whisper of disappearances in the night, and the party must navigate intrigue, forbidden ruins, and dark magic to uncover the truth before the kingdom falls into chaos.'
  }
]

type SeedGameTablePlayer = {
  id: string
  tableId: string
  userId: string
}

export const  gameTablePlayers: SeedGameTablePlayer[] = [
  { id: crypto.randomUUID(), tableId: mainGameTableId, userId: users[1].id },
  { id: crypto.randomUUID(), tableId: mainGameTableId, userId: users[2].id },
  { id: crypto.randomUUID(), tableId: mainGameTableId, userId: users[3].id },
  { id: crypto.randomUUID(), tableId: mainGameTableId, userId: users[4].id },
  { id: crypto.randomUUID(), tableId: mainGameTableId, userId: users[5].id }
]