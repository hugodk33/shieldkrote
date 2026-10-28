import { Router } from 'express'
import { GameTableRulesRepository } from '../../../domain/repositories/GameTableRulesRepository'
import { GameTableRepository } from '../../../domain/repositories/GameTableRepository'
import { FindAllGameTablesUseCase } from '../../../application/use-cases/tables-use-cases/FindAllGameTablesUseCase'
import { FindAllGameTableScenesUseCase } from '../../../application/use-cases/tables-use-cases/FindAllGameTableScenesUseCase'
import { FindGameTableUseCase } from '../../../application/use-cases/tables-use-cases/FindGameTableUseCase'
import { characterViewer, playerCharacterViewer } from './templates/character-viewer'
import { gameTableCards } from './templates/game-table-list'
import { apiDocs } from './templates/api-docs'
import { gameTableScenes } from './templates/game-table-scenes'
import { gameTableCharacters } from './templates/game-table-characters'
import { formGameTable } from './templates/form-game-table'
import { formCharacter } from './templates/form-character'
import { formNpc } from './templates/form-npc'
import { formItem } from './templates/form-item'
import { formAdvantage } from './templates/form-advantage'
import { formDisadvantage } from './templates/form-disadvantage'
import { narratorDashboard } from './templates/narrator-dashboard'
import { playerDashboard } from './templates/player-dashboard'
import { tableItems } from './templates/table-items'
import { tableAdvantages } from './templates/table-advantages'
import { tableDisadvantages } from './templates/table-disadvantages'
import { sessionScreen } from './templates/session-screen'
import { playerSession } from './templates/player-session'
import { tableSkills } from './templates/table-skills'
import { tableLocations } from './templates/table-locations'
import { playerGameTableScenes } from './templates/player-game-table-scenes'
import { playerGameTableCharacters } from './templates/player-game-table-characters'
import { playerTableItems } from './templates/player-table-items'
import { playerTableAdvantages } from './templates/player-table-advantages'
import { playerTableDisadvantages } from './templates/player-table-disadvantages'
import { playerTableSkills } from './templates/player-table-skills'
import { playerTableLocations } from './templates/player-table-locations'
import { FindAllGameTableCharactersUseCase } from '../../../application/use-cases/table-game-rules-use-case/FindAllGameTableCharactersUseCase'
import { FindGameTableSkillsUseCase } from '../../../application/use-cases/table-game-rules-use-case/FindAllGameTableSkillsUseCase'

const router = Router()
const gameTableRepo = new GameTableRepository()
const findAllGameTablesUseCase = new FindAllGameTablesUseCase(gameTableRepo)
const findAllGameTableScenesUseCase = new FindAllGameTableScenesUseCase(gameTableRepo)
const findGameTableUseCase = new FindGameTableUseCase(gameTableRepo)
const charRepo = new GameTableRulesRepository()
const findAllGameTableCharactersUseCase = new FindAllGameTableCharactersUseCase(charRepo)
const findAllGameTableSkillsUseCase = new FindGameTableSkillsUseCase(charRepo)

router.get('/', async (req, res) => {
  try {
    res.send(apiDocs(gameTableCards()))
  } catch (e: any) {
    console.error('Route / error:', e?.message || e)
    res.status(500).send('Internal server error')
  }
})

router.get('/view/game_table_scenes/:id', async (req, res) => {
  try {
    const data = await findAllGameTableScenesUseCase.execute(req.params.id)
    res.send(gameTableScenes(data))
  } catch {
    res.status(500).send('Internal server error')
  }
})

router.get('/player/game_table_scenes/:id', async (req, res) => {
  try {
    const data = await findAllGameTableScenesUseCase.execute(req.params.id)
    const chars = await charRepo.findAllGameCharacters(req.params.id)
    const playerChar = (chars?.characters ?? []).find((c: any) => !c.isNpc)
    res.send(playerGameTableScenes({ ...data, characterUrl: playerChar ? `/player/game-table-character-viewer/${playerChar.id}` : undefined }))
  } catch {
    res.status(500).send('Internal server error')
  }
})

router.get('/view/game_table_characters/:id', async (req, res) => {
  try {
    const data = await findAllGameTableCharactersUseCase.execute(req.params.id)
    res.send(gameTableCharacters(data))
  } catch {
    res.status(500).send('Internal server error')
  }
})

router.get('/player/game_table_characters/:id', async (req, res) => {
  try {
    const data: any = await findAllGameTableCharactersUseCase.execute(req.params.id)
    const playerChar = (data?.characters ?? []).find((c: any) => !c.isNpc)
    res.send(playerGameTableCharacters({ ...data, characterUrl: playerChar ? `/player/game-table-character-viewer/${playerChar.id}` : undefined }))
  } catch {
    res.status(500).send('Internal server error')
  }
})

router.get('/game-table-character-viewer/:id', async (req, res) => {
  try {
    const moment = req.query.moment ? parseInt(req.query.moment as string, 10) : undefined
    const character = await charRepo.findGameCharacter(req.params.id, moment)
    if (!character) {
      return res.status(404).send('Character not found')
    }
    res.send(characterViewer(character))
  } catch {
    res.status(500).send('Internal server error')
  }
})

router.get('/player/game-table-character-viewer/:id', async (req, res) => {
  try {
    const moment = req.query.moment ? parseInt(req.query.moment as string, 10) : undefined
    const character = await charRepo.findGameCharacter(req.params.id, moment)
    if (!character) {
      return res.status(404).send('Character not found')
    }
    res.send(playerCharacterViewer(character))
  } catch {
    res.status(500).send('Internal server error')
  }
})

router.get('/view/game_table_items/:id', async (req, res) => {
  try {
    const data = await charRepo.findAllGameItems(req.params.id)
    res.send(tableItems(data))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/player/game_table_items/:id', async (req, res) => {
  try {
    const data = await charRepo.findAllGameItems(req.params.id)
    const chars = await charRepo.findAllGameCharacters(req.params.id)
    const playerChar = (chars?.characters ?? []).find((c: any) => !c.isNpc)
    res.send(playerTableItems({ ...data, characterUrl: playerChar ? `/player/game-table-character-viewer/${playerChar.id}` : undefined }))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/view/game_table_advantages/:id', async (req, res) => {
  try {
    const data = await charRepo.findAllGameAdvantages(req.params.id)
    res.send(tableAdvantages(data))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/player/game_table_advantages/:id', async (req, res) => {
  try {
    const data = await charRepo.findAllGameAdvantages(req.params.id)
    const chars = await charRepo.findAllGameCharacters(req.params.id)
    const playerChar = (chars?.characters ?? []).find((c: any) => !c.isNpc)
    res.send(playerTableAdvantages({ ...data, characterUrl: playerChar ? `/player/game-table-character-viewer/${playerChar.id}` : undefined }))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/view/game_table_disadvantages/:id', async (req, res) => {
  try {
    const data = await charRepo.findAllGameDisadvantages(req.params.id)
    res.send(tableDisadvantages(data))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/player/game_table_disadvantages/:id', async (req, res) => {
  try {
    const data = await charRepo.findAllGameDisadvantages(req.params.id)
    const chars = await charRepo.findAllGameCharacters(req.params.id)
    const playerChar = (chars?.characters ?? []).find((c: any) => !c.isNpc)
    res.send(playerTableDisadvantages({ ...data, characterUrl: playerChar ? `/player/game-table-character-viewer/${playerChar.id}` : undefined }))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/view/game_table_skills/:id', async (req, res) => {
  try {
    const data = await charRepo.findAllGameTableSkills(req.params.id)
    res.send(tableSkills(data))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/player/game_table_skills/:id', async (req, res) => {
  try {
    const data = await charRepo.findAllGameTableSkills(req.params.id)
    const chars = await charRepo.findAllGameCharacters(req.params.id)
    const playerChar = (chars?.characters ?? []).find((c: any) => !c.isNpc)
    res.send(playerTableSkills({ ...data, characterUrl: playerChar ? `/player/game-table-character-viewer/${playerChar.id}` : undefined }))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/view/game_table_locations/:id', async (req, res) => {
  try {
    const scenes = await findAllGameTableScenesUseCase.execute(req.params.id)
    const locations: any[] = []
    const seen = new Set()
    for (const scene of (scenes?.scenes ?? [])) {
      for (const n of (scene.narrations ?? [])) {
        const loc = (n as any).location
        if (loc && loc.name && !seen.has(loc.name)) {
          seen.add(loc.name)
          locations.push(loc)
        }
      }
    }
    res.send(tableLocations({ table: scenes?.table, locations }))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/player/game_table_locations/:id', async (req, res) => {
  try {
    const scenes = await findAllGameTableScenesUseCase.execute(req.params.id)
    const locations: any[] = []
    const seen = new Set()
    for (const scene of (scenes?.scenes ?? [])) {
      for (const n of (scene.narrations ?? [])) {
        const loc = (n as any).location
        if (loc && loc.name && !seen.has(loc.name)) {
          seen.add(loc.name)
          locations.push(loc)
        }
      }
    }
    const chars = await charRepo.findAllGameCharacters(req.params.id)
    const playerChar = (chars?.characters ?? []).find((c: any) => !c.isNpc)
    res.send(playerTableLocations({ table: scenes?.table, locations, characterUrl: playerChar ? `/player/game-table-character-viewer/${playerChar.id}` : undefined }))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/session/:tableId', async (req, res) => {
  try {
    const [characters, scenes] = await Promise.all([
      charRepo.findAllGameCharacters(req.params.tableId),
      findAllGameTableScenesUseCase.execute(req.params.tableId)
    ])
    res.send(sessionScreen({ table: characters?.table || scenes?.table, characters: characters?.characters || [], scenes: scenes?.scenes || [] }))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/session/:tableId/player', async (req, res) => {
  try {
    const [characters, scenes] = await Promise.all([
      charRepo.findAllGameCharacters(req.params.tableId),
      findAllGameTableScenesUseCase.execute(req.params.tableId)
    ])
    res.send(playerSession({ table: characters?.table || scenes?.table, characters: characters?.characters || [], scenes: scenes?.scenes || [] }))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/form/game-table/new', (_req, res) => {
  res.send(formGameTable())
})

router.get('/form/game-table/:id', async (req, res) => {
  try {
    const table = await findGameTableUseCase.execute(req.params.id)
    if (!table) return res.status(404).send('Mesa não encontrada')
    res.send(formGameTable(table))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/form/character/new', async (req, res) => {
  const tableId = req.query.table_id as string
  if (tableId) {
    try {
      const table = await findGameTableUseCase.execute(tableId)
      res.send(formCharacter({ table, table_id: tableId }))
      return
    } catch { /* fall through */ }
  }
  res.send(formCharacter({ table_id: tableId || '' }))
})

router.get('/form/character/:id', async (req, res) => {
  try {
    const ch = await charRepo.findGameCharacter(req.params.id)
    if (!ch) return res.status(404).send('Personagem não encontrado')
    res.send(formCharacter(ch))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/form/npc/new', async (_req, res) => {
  res.send(formNpc({}))
})

router.get('/form/npc/:id', async (req, res) => {
  try {
    const npc = await charRepo.findGameNPC(req.params.id)
    if (!npc) return res.status(404).send('NPC não encontrado')
    res.send(formNpc(npc))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/form/item/new', (req, res) => {
  const tableId = req.query.table_id as string
  res.send(formItem({ table_id: tableId || '' }))
})

router.get('/form/item/:id', async (req, res) => {
  try {
    const item = await charRepo.findGameItems(req.params.id)
    if (!item) return res.status(404).send('Item não encontrado')
    res.send(formItem(item))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/form/advantage/new', (req, res) => {
  const tableId = req.query.table_id as string
  res.send(formAdvantage({ table_id: tableId || '' }))
})

router.get('/form/advantage/:id', async (req, res) => {
  try {
    const adv = await charRepo.findGameAdvantages(req.params.id)
    if (!adv) return res.status(404).send('Vantagem não encontrada')
    res.send(formAdvantage(adv))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/form/disadvantage/new', (req, res) => {
  const tableId = req.query.table_id as string
  res.send(formDisadvantage({ table_id: tableId || '' }))
})

router.get('/form/disadvantage/:id', async (req, res) => {
  try {
    const tables = await findAllGameTablesUseCase.execute()
    const table = tables[0]
    res.send(formDisadvantage({ table_id: table?.id || '' }))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/tables', async (req, res) => {
  try {
    const tables = await findAllGameTablesUseCase.execute()
    res.send(narratorDashboard({
      narrator: { name: 'Narrador' },
      tables
    }))
  } catch { res.status(500).send('Internal server error') }
})

router.get('/table', async (req, res) => {
  try {
    const tables = await findAllGameTablesUseCase.execute()
    const characterName = 'Elric'
    let foundTableId = ''

    for (const t of tables) {
      const chars = await charRepo.findAllGameCharacters(t.id)
      const match = (chars?.characters ?? []).find((c: any) => String(c.name ?? '').startsWith(characterName))
      if (match) {
        foundTableId = t.id
        break
      }
    }

    if (foundTableId) {
      res.redirect('/table/' + foundTableId)
    } else {
      res.send(playerSession({ table: null, characters: [], scenes: [] }))
    }
  } catch { res.status(500).send('Internal server error') }
})

router.get('/table/:tableId', async (req, res) => {
  try {
    const [characters, scenes] = await Promise.all([
      charRepo.findAllGameCharacters(req.params.tableId),
      findAllGameTableScenesUseCase.execute(req.params.tableId)
    ])
    res.send(playerSession({ table: characters?.table || scenes?.table, characters: characters?.characters || [], scenes: scenes?.scenes || [] }))
  } catch { res.status(500).send('Internal server error') }
})

export default router
