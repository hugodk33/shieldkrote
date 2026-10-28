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
    title: 'A Sombra do Velho Reino',
    system: 'GURPS',
    intro: 'Nas ruas em ruínas da capital do reino, uma sombra se abate sobre a cidade. As antigas casas nobres sussurram sobre desaparecimentos durante a noite, e o grupo precisa navegar por intrigas, ruínas proibidas e magia sombria para descobrir a verdade antes que o reino caia no caos.'
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
