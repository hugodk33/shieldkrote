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
    title: 'O Trabalho da Guilda',
    chapter: 1,
    moment: 0,
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    title: 'Investigação no Beco do Ferro',
    chapter: 1,
    moment: 1,
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    title: 'Os Túneis Subterrâneos',
    chapter: 1,
    moment: 2
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    title: 'O Templo Esquecido',
    chapter: 1,
    moment: 3
  }
]
