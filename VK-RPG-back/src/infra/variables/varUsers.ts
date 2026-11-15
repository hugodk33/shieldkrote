import crypto from 'crypto'
import { adminId , playerOneId, narratorUserId } from './MainUUIDIds/uuidGeral'

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
  SeedUser,
  SeedUser
] = [
  {
    // Superadmin da seed: administra o catálogo (kits e categorias) sem
    // ser dono das mesas de exemplo. O nome é contrato do fluxo exclusivo
    // (`isSuperAdmin` no front e o guard do backend).
    id: adminId,
    type: 2,
    username: 'd3miurg0',
    password: '123456',
    phone: '85999999999',
    email: 'd3miurg0@email.com'
  },
  {
    // Narrador das mesas de exemplo. Separado do superadmin para que as
    // mesas semeadas sejam campanhas normais, não o balcão do catálogo.
    id: narratorUserId,
    type: 0,
    username: 'Narrador',
    password: '123456',
    phone: '85988887777',
    email: 'narrador@email.com'
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