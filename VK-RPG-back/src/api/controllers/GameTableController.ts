import { Request , Response } from 'express'
import { CreateGameTableUseCase } from '../../application/use-cases/tables-use-cases/CreateGameTableCase'
import { FindGameTableUseCase } from '../../application/use-cases/tables-use-cases/FindGameTableUseCase'
import { FindAllGameTablesUseCase } from '../../application/use-cases/tables-use-cases/FindAllGameTablesUseCase'
import { FindAllGameTableScenesUseCase } from '../../application/use-cases/tables-use-cases/FindAllGameTableScenesUseCase'
import { EditGameTableUseCase } from '../../application/use-cases/tables-use-cases/EditGameTableUseCase'
import { CreateSceneUseCase } from '../../application/use-cases/tables-use-cases/CreateSceneUseCase'
import { CreateNarrationUseCase } from '../../application/use-cases/tables-use-cases/CreateNarrationUseCase'
import { CreateNarrationActionUseCase } from '../../application/use-cases/tables-use-cases/CreateNarrationActionUseCase'
import { SetSceneImageUseCase } from '../../application/use-cases/tables-use-cases/SetSceneImageUseCase'
import { publishTable, resolveTableId } from '../../infra/realtime/TableEvents'

export class GameTableController {
  constructor(
    private createGameTableUseCase: CreateGameTableUseCase,
    private findGameTableUseCase: FindGameTableUseCase,
    private findAllGameTablesUseCase: FindAllGameTablesUseCase,
    private findAllGameTableScenesUseCase: FindAllGameTableScenesUseCase,
    private editGameTableUseCase: EditGameTableUseCase,
    private createSceneUseCase: CreateSceneUseCase,
    private createNarrationUseCase: CreateNarrationUseCase,
    private createNarrationActionUseCase: CreateNarrationActionUseCase,
    private setSceneImageUseCase: SetSceneImageUseCase
  ) {}

  async create(req: Request, res: Response) {
    const user = await this.createGameTableUseCase.execute(req.body)
    return res.json(user)
  }

  async findById(req: Request, res: Response) {
    const gameTablesById = await this.findGameTableUseCase.execute(req.params.id as string) 
    return res.json(gameTablesById)
  }

  async findAll(req: Request, res: Response) {
    const gameAllTables = await this.findAllGameTablesUseCase.execute() 
    return res.json(gameAllTables) 
  }

  async findByAllScenes(req: Request, res: Response) {
    const gameTablesScenes = await this.findAllGameTableScenesUseCase.execute(req.params.id as string) 
    return res.json(gameTablesScenes)
  }

  async editGameTable(req: Request, res: Response) {
    const { id } = req.params as any
    const gameTable = await this.editGameTableUseCase.execute({ ...req.body, id })
    return res.json(gameTable)
  }

  async createScene(req: Request, res: Response) {
    try {
      const scene = await this.createSceneUseCase.execute(req.body)
      const tableId = resolveTableId(req.body)
      if (tableId) publishTable(tableId, 'scene')
      return res.json({ success: true, scene })
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message })
    }
  }

  async setSceneImage(req: Request, res: Response) {
    try {
      const imageUrl = (req.body?.imageUrl ?? req.body?.image_url) ?? null
      const tableId = await this.setSceneImageUseCase.execute(req.params.id as string, imageUrl)
      if (tableId) publishTable(tableId, 'scene')
      return res.json({ success: true })
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message })
    }
  }

  async createNarration(req: Request, res: Response) {
    try {
      const narration = await this.createNarrationUseCase.execute(req.body)
      const tableId = resolveTableId(req.body)
      if (tableId) publishTable(tableId, 'narration')
      return res.json({ success: true, narration })
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message })
    }
  }

  async createNarrationAction(req: Request, res: Response) {
    try {
      const action = await this.createNarrationActionUseCase.execute(req.body)
      const tableId = resolveTableId(req.body)
      if (tableId) publishTable(tableId, 'action')
      return res.json({ success: true, action })
    } catch (e: any) {
      return res.status(e?.status ?? 500).json({ success: false, error: e.message })
    }
  }
}
