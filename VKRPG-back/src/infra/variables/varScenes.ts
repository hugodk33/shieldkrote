import crypto  from 'crypto'
import { mainGameTableId } from "./MainUUIDIds/uuidGeral"

type SeedScene= {
  id: string
  table_id: string
  title: string
  chapter: number
  moment: number
}

export const  scenes: [SeedScene ,  SeedScene , SeedScene , SeedScene ] = [
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    title: 'The Guild Job',
    chapter: 1,
    moment: 0,
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    title: 'Iron Alley Investigation',
    chapter: 1,
    moment: 1,
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    title: 'The Underground Tunnels',
    chapter: 1,
    moment: 2
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    title: 'The Forgotten Temple',
    chapter: 1,
    moment: 3
  }
]