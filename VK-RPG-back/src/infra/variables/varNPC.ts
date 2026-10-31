import * as NPCIds from "./MainUUIDIds/uuidNPC"
import { characterNPCsIds } from "./MainUUIDIds/uuidCharacters"

type SeedNpc = {
  id: string
  character_id: string
  status: 'enemy' | 'ally' | 'neutral' | 'boss'
}

export const  newNpcs: SeedNpc[] = [
  { id: NPCIds.Npc1Id, character_id: characterNPCsIds[0] as string, status: 'enemy' },
  { id: NPCIds.Npc2Id, character_id: characterNPCsIds[1] as string, status: 'enemy' },
  { id: NPCIds.Npc3Id, character_id: characterNPCsIds[2] as string, status: 'boss' },
  { id: NPCIds.Npc4Id, character_id: characterNPCsIds[3] as string, status: 'neutral' },
  { id: NPCIds.Npc5Id, character_id: characterNPCsIds[4] as string, status: 'ally' },
  { id: NPCIds.Npc6Id, character_id: characterNPCsIds[5] as string, status: 'enemy' },
  { id: NPCIds.Npc7Id, character_id: characterNPCsIds[6] as string, status: 'enemy' },
  { id: NPCIds.Npc8Id, character_id: characterNPCsIds[7] as string, status: 'ally' },
  { id: NPCIds.Npc9Id, character_id: characterNPCsIds[8] as string, status: 'neutral' },
  { id: NPCIds.Npc10Id, character_id: characterNPCsIds[9] as string, status: 'boss' }
]