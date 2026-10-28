import crypto from 'crypto'
import { adminId , playerOneId } from './MainUUIDIds/uuidGeral'

type SeedUser = {
  id: string
  type: number
  username: string
  password: string
  phone: string
  email: string
}

export const  users: [
  SeedUser,
  SeedUser,
  SeedUser,
  SeedUser,
  SeedUser,
  SeedUser,
  SeedUser,
  SeedUser,
  SeedUser
] = [
  {
    id: adminId,
    type: 0,
    username: 'admin',
    password: '123456',
    phone: '85999999999',
    email: 'admin@email.com'
  },
  {
    id: playerOneId,
    type: 1,
    username: 'João Pedro',
    password: '123456',
    phone: '85888888888',
    email: 'joao.pedro@email.com'
  },
  {
    id: crypto.randomUUID(),
    type: 1,
    username: 'Garry S Mod',
    password: '123456',
    phone: '85777777777',
    email: 'garrys.mod@email.com'
  },
  {
    id: crypto.randomUUID(),
    type: 1,
    username: 'Rafael Silva',
    password: '123456',
    phone: '85666666666',
    email: 'rafael.silva@email.com'
  },
  {
    id: crypto.randomUUID(),
    type: 1,
    username: 'Daniela Souza',
    password: '123456',
    phone: '85555555555',
    email: 'daniela.souza@email.com'
  },
  {
    id: crypto.randomUUID(),
    type: 1,
    username: 'Danilo Nascimento',
    password: '123456',
    phone: '85444444444',
    email: 'danilo.nascimento@email.com'
  },
  {
    id: crypto.randomUUID(),
    type: 1,
    username: 'Dan Smith',
    password: '123456',
    phone: '85333333333',
    email: 'dan.smith@email.com'
  },
  {
    id: crypto.randomUUID(),
    type: 1,
    username: 'Player Test One',
    password: '123456',
    phone: '85222222222',
    email: 'player.one@email.com'
  },
  {
    id: crypto.randomUUID(),
    type: 1,
    username: 'Player Test Two',
    password: '123456',
    phone: '85111111111',
    email: 'player.two@email.com'
  }
]