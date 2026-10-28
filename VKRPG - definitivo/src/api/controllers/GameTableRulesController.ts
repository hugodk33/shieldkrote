import { Request , Response } from 'express'
import type { ViewerScope } from '../../domain/services/CharacterVisibility'
import { parsePage } from '../../domain/pagination'
import { FindGameTableSkillUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableSkillUseCase'
import { FindGameTableSkillsUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableSkillsUseCase'
import { FindGameTableAdvantageUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableAdvantageUseCase'
import { FindGameTableAdvantagesUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableAdvantagesUseCase '
import { FindGameTableDisadvantagesUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableDisadvantagesUseCase'
import { CreateGameTableAdvantagesUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableAdvantagesUseCase'
import { EditGameTableAdvantagesUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableAdvantagesUseCase'
import { FindGameTablePeculiarityUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTablePeculiarityUseCase'
import { FindAllGameTablePeculiaritiesUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTablePeculiaritiesUseCase'
import { CreateGameTablePeculiaritiesUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTablePeculiaritiesUseCase'
import { EditGameTablePeculiaritiesUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTablePeculiaritiesUseCase'
import { FindGameTableItemUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableItemUseCase'
import { FindGameTableItemsUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableItemsUseCase'
import { CreateGameTableItemsUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableItemsUseCase'
import { EditGameTableItemsUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableItemsUseCase'
import { FindGameTableNPCUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableNPCUseCase'
import { FindAllGameTableNPCSUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableNPCSUseCase'
import { CreateGameTableNPCUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableNPCUseCase'
import { EditGameTableNPCUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableNPCUseCase'
import { CreateGameTableNPCVisibilityUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableNPCVisibilityUseCase'
import { EditGameTableNPCVisibilityUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableNPCVisibilityUseCase'
import { FindGameTableNPCVisibilityUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableNPCVisibilityUseCase'
import { CreateGameTableCharacterUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableCharacterUseCase'
import { EditGameTableCharacterUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableCharacterUseCase'
import { FindGameTableCharacterUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableCharacterUseCase'
import { FindGameTableCharacterHistoryUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableCharacterHistoryUseCase'
import { EditGameCharacterEquipmentUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameCharacterEquipmentUseCase'
import { DeleteGameCharacterEquipmentUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteGameCharacterEquipmentUseCase'
import { TransferGameCharacterEquipmentUseCase } from '../../application/use-cases/table-game-rules-use-case/TransferGameCharacterEquipmentUseCase'
import { SellGameCharacterEquipmentUseCase } from '../../application/use-cases/table-game-rules-use-case/SellGameCharacterEquipmentUseCase'
import { FindAllGameTableCharactersUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableCharactersUseCase'
import { CreateGameModifierUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameModifierUseCase'
import { EditGameModifierUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameModifierUseCase'
import { FindGameModifierUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameModifierUseCase'
import { FindAllGameModifiersUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameModifiersUseCase'
import { DeleteGameModifierUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteGameModifierUseCase'
import { CreateGameVisibilityUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameVisibilityUseCase'
import { EditGameVisibilityUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameVisibilityUseCase'
import { FindGameVisibilityUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameVisibilityUseCase'
import { FindAllGameVisibilityUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameVisibilityUseCase'
import { CreateGameQueueUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameQueueUseCase'
import { EditGameQueueUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameQueueUseCase'
import { FindGameQueueUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameQueueUseCase'
import { FindAllGameQueueUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameQueueUseCase'
import { ApplyGameSkillEffectUseCase } from '../../application/use-cases/table-game-rules-use-case/ApplyGameSkillEffectUseCase'
import { FindGameTableDisadvantageUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableDisadvantageUseCase'
import { FindTableLocationUseCase } from '../../application/use-cases/table-game-rules-use-case/FindTableLocationUseCase'
import { FindAllTableLocationsUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllTableLocationsUseCase'
import { CreateTableLocationUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateTableLocationUseCase'
import { EditTableLocationUseCase } from '../../application/use-cases/table-game-rules-use-case/EditTableLocationUseCase'
import { DeleteTableLocationUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteTableLocationUseCase'
import { SetDefaultGameLocationUseCase } from '../../application/use-cases/table-game-rules-use-case/SetDefaultGameLocationUseCase'
import {
  ResolveTableViewerUseCase,
  TableAccessError,
  ViewerRole,
} from '../../application/use-cases/table-access-use-cases/TableAccessUseCases'
import { EndPlayerTurnUseCase } from '../../application/use-cases/table-game-rules-use-case/EndPlayerTurnUseCase'
import { GrantGameItemUseCase } from '../../application/use-cases/table-game-rules-use-case/GrantGameItemUseCase'
import { AwardGameCharacterPointsUseCase } from '../../application/use-cases/table-game-rules-use-case/AwardGameCharacterPointsUseCase'
import { GrantGameTraitToCharacterUseCase } from '../../application/use-cases/table-game-rules-use-case/GrantGameTraitToCharacterUseCase'
import { RemoveGameTraitFromCharacterUseCase } from '../../application/use-cases/table-game-rules-use-case/RemoveGameTraitFromCharacterUseCase'
import { ToggleGameModifierForCharacterUseCase } from '../../application/use-cases/table-game-rules-use-case/ToggleGameModifierForCharacterUseCase'
import { FindGameTableSettingsUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableSettingsUseCase'
import { EditGameTableSettingsUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableSettingsUseCase'
import { CreateGameTableSkillsUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableSkillsUseCase'
import { EditGameTableSkillsUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableSkillsUseCase'
import { DeleteGameTableSkillUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteGameTableSkillUseCase'
import { CreateSkillRelationUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateSkillRelationUseCase'
import { EditSkillRelationUseCase } from '../../application/use-cases/table-game-rules-use-case/EditSkillRelationUseCase'
import { DeleteSkillRelationUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteSkillRelationUseCase'
import { CreateGameTableDisadvantagesUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableDisadvantagesUseCase'
import { EditGameTableDisadvantagesUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableDisadvantagesUseCase'
import { DeleteGameTableDisadvantageUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteGameTableDisadvantageUseCase'
import { DeleteGameTableAdvantageUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteGameTableAdvantageUseCase'
import { DeleteGameTableItemUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteGameTableItemUseCase'
import { DeleteGameTableNPCUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteGameTableNPCUseCase'
import { DeleteGameTableCharacterUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteGameTableCharacterUseCase'
import { publishTable, resolveTableId, resolveLocationTableId } from '../../infra/realtime/TableEvents'
export class GameTableRulesController {
  constructor(
    private findGameTableSkillUseCase: FindGameTableSkillUseCase,
    private findAllGameTableSkillsUseCase: FindGameTableSkillsUseCase,
    private findGameTableAdvantageUseCase: FindGameTableAdvantageUseCase,
    private findAllGameTableAdvantagesUseCase: FindGameTableAdvantagesUseCase,
    private findAllGameTableDisadvantagesUseCase: FindGameTableDisadvantagesUseCase,
    private findGameTablePeculiarityUseCase: FindGameTablePeculiarityUseCase,
    private findAllGameTablePeculiaritiesUseCase: FindAllGameTablePeculiaritiesUseCase,
    private findGameTableItemUseCase: FindGameTableItemUseCase,
    private findAllGameTableItemsUseCase: FindGameTableItemsUseCase ,
    private findGameTableNPCUseCase: FindGameTableNPCUseCase,
    private findAllGameTableNPCSUseCase: FindAllGameTableNPCSUseCase,
    private createGameTableAdvantagesUseCase?: CreateGameTableAdvantagesUseCase,
    private editGameTableAdvantagesUseCase?: EditGameTableAdvantagesUseCase,
    private createGameTablePeculiaritiesUseCase?: CreateGameTablePeculiaritiesUseCase,
    private editGameTablePeculiaritiesUseCase?: EditGameTablePeculiaritiesUseCase,
    private createGameTableItemsUseCase?: CreateGameTableItemsUseCase,
    private editGameTableItemsUseCase?: EditGameTableItemsUseCase,
    private createGameTableNPCSUseCase?: CreateGameTableNPCUseCase,
    private editGameTableNPCSUseCase?: EditGameTableNPCUseCase,
    private createGameTableNPCVisibilityUseCase?: CreateGameTableNPCVisibilityUseCase,
    private editGameTableNPCVisibilityUseCase?: EditGameTableNPCVisibilityUseCase,
    private findGameTableNPCVisibilityUseCase?: FindGameTableNPCVisibilityUseCase,
    private createGameTableCharacterUseCase?: CreateGameTableCharacterUseCase,
    private editGameTableCharacterUseCase?: EditGameTableCharacterUseCase,
    private findGameTableCharacterUseCase?: FindGameTableCharacterUseCase,
    private findAllGameTableCharactersUseCase?: FindAllGameTableCharactersUseCase,
    private findGameTableCharacterHistoryUseCase?: FindGameTableCharacterHistoryUseCase,
    private editGameCharacterEquipmentUseCase?: EditGameCharacterEquipmentUseCase,
    private createGameModifierUseCase?: CreateGameModifierUseCase,
    private editGameModifierUseCase?: EditGameModifierUseCase,
    private findGameModifierUseCase?: FindGameModifierUseCase,
    private findAllGameModifiersUseCase?: FindAllGameModifiersUseCase,
    private deleteGameModifierUseCase?: DeleteGameModifierUseCase,
    private createGameVisibilityUseCase?: CreateGameVisibilityUseCase,
    private editGameVisibilityUseCase?: EditGameVisibilityUseCase,
    private findGameVisibilityUseCase?: FindGameVisibilityUseCase,
    private findAllGameVisibilityUseCase?: FindAllGameVisibilityUseCase,
    private createGameQueueUseCase?: CreateGameQueueUseCase,
    private editGameQueueUseCase?: EditGameQueueUseCase,
    private findGameQueueUseCase?: FindGameQueueUseCase,
    private findAllGameQueueUseCase?: FindAllGameQueueUseCase,
    private applyGameSkillEffectUseCase?: ApplyGameSkillEffectUseCase,
    private findGameTableDisadvantageUseCase?: FindGameTableDisadvantageUseCase,
    private findTableLocationUseCase?: FindTableLocationUseCase,
    private findAllTableLocationsUseCase?: FindAllTableLocationsUseCase,
    private createTableLocationUseCase?: CreateTableLocationUseCase,
    private editTableLocationUseCase?: EditTableLocationUseCase,
    private deleteTableLocationUseCase?: DeleteTableLocationUseCase,
    private setDefaultGameLocationUseCase?: SetDefaultGameLocationUseCase,
    private endPlayerTurnUseCase?: EndPlayerTurnUseCase,
    private deleteGameCharacterEquipmentUseCase?: DeleteGameCharacterEquipmentUseCase,
    private transferGameCharacterEquipmentUseCase?: TransferGameCharacterEquipmentUseCase,
    private sellGameCharacterEquipmentUseCase?: SellGameCharacterEquipmentUseCase,
    private grantGameItemUseCase?: GrantGameItemUseCase,
    private awardGameCharacterPointsUseCase?: AwardGameCharacterPointsUseCase,
    private grantGameTraitToCharacterUseCase?: GrantGameTraitToCharacterUseCase,
    private removeGameTraitFromCharacterUseCase?: RemoveGameTraitFromCharacterUseCase,
    private toggleGameModifierForCharacterUseCase?: ToggleGameModifierForCharacterUseCase,
    private findGameTableSettingsUseCase?: FindGameTableSettingsUseCase,
    private editGameTableSettingsUseCase?: EditGameTableSettingsUseCase,
    private createGameTableSkillsUseCase?: CreateGameTableSkillsUseCase,
    private editGameTableSkillsUseCase?: EditGameTableSkillsUseCase,
    private deleteGameTableSkillUseCase?: DeleteGameTableSkillUseCase,
    private createSkillRelationUseCase?: CreateSkillRelationUseCase,
    private editSkillRelationUseCase?: EditSkillRelationUseCase,
    private deleteSkillRelationUseCase?: DeleteSkillRelationUseCase,
    private createGameTableDisadvantagesUseCase?: CreateGameTableDisadvantagesUseCase,
    private editGameTableDisadvantagesUseCase?: EditGameTableDisadvantagesUseCase,
    private deleteGameTableDisadvantageUseCase?: DeleteGameTableDisadvantageUseCase,
    private deleteGameTableAdvantageUseCase?: DeleteGameTableAdvantageUseCase,
    private deleteGameTableItemUseCase?: DeleteGameTableItemUseCase,
    private deleteGameTableNPCUseCase?: DeleteGameTableNPCUseCase,
    private deleteGameTableCharacterUseCase?: DeleteGameTableCharacterUseCase,
    private resolveTableViewerUseCase?: ResolveTableViewerUseCase
  ) {}

  /**
   * Locations são lidas sempre com o papel resolvido no servidor a partir do
   * `actor`. O `viewer` não vem mais do cliente: ele é derivado do personagem
   * que o ator realmente tem nesta mesa.
   *
   * Narrador e convidado veem o catálogo inteiro; jogador vê só o que seu
   * personagem conhece. Sem `actor` o pedido é recusado — é o que impede um
   * player de pedir o mapa completo simplesmente omitindo o filtro.
   *
   * `tableId` vem explícito porque `:id` significa mesa em
   * `/game-table-locations/:id` e local em `/table-location/:id`.
   */
  private async resolveViewer(req: Request, tableId: string): Promise<ViewerScope> {
    if (!this.resolveTableViewerUseCase) {
      throw new TableAccessError('Resolução de acesso não configurada.', 500)
    }
    const actor = (req.query.actor ?? req.body?.actor) as string | undefined
    const asCharacter = (req.query.asCharacter ?? req.body?.asCharacter) as string | undefined
    const resolved = await this.resolveTableViewerUseCase.execute({
      tableId,
      actorId: actor ?? '',
      asCharacterId: asCharacter ?? null
    })
    // Preview do narrador: `characterId` preenchido mesmo com papel de owner,
    // e aí a leitura sai filtrada pelo conhecimento daquele personagem.
    if (resolved.characterId) return { characterId: resolved.characterId }
    // Player sem personagem na mesa continua sendo player: `characterId` nulo
    // resulta em catálogo vazio, não no catálogo completo.
    if (resolved.role === ViewerRole.Owner || resolved.role === ViewerRole.Guest) {
      return { unfiltered: true }
    }
    return { characterId: resolved.characterId }
  }

  async findSkill(req: Request, res: Response) {
    const skill = await this.findGameTableSkillUseCase.execute(req.params.id as string)
    return res.json(skill)
  }
  
  async findAllSkills(req: Request, res: Response) {
    const { search, type, difficulty, viewer } = req.query
    const skills = await this.findAllGameTableSkillsUseCase.execute(
      req.params.id as string,
      search as string | undefined,
      type as string | undefined,
      difficulty as string | undefined,
      viewer as string | undefined,
      parsePage(req.query)
    )
    return res.json(skills)
  }

  async createSkill(req: Request, res: Response) {
    try {
      await this.createGameTableSkillsUseCase!.execute(req.body)
      return res.json({ success: true })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async editSkill(req: Request, res: Response) {
    try {
      await this.editGameTableSkillsUseCase!.execute({ id: req.params.id, ...req.body })
      return res.json({ success: true })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async deleteSkill(req: Request, res: Response) {
    try {
      const result = await this.deleteGameTableSkillUseCase!.execute(req.params.id as string)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  /* `kind` e validado na porta: um valor fora do par faria o repositorio
     consultar uma tabela que nao existe. */
  private skillRelationKind(raw: unknown): 'predefinition' | 'dependency' | null {
    return raw === 'predefinition' || raw === 'dependency' ? raw : null
  }

  async createSkillRelation(req: Request, res: Response) {
    const kind = this.skillRelationKind(req.params.kind)
    if (!kind) {
      return res.status(400).json({ success: false, error: 'Invalid relation kind' })
    }
    try {
      const result = await this.createSkillRelationUseCase!.execute(kind, req.body)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async editSkillRelation(req: Request, res: Response) {
    const kind = this.skillRelationKind(req.params.kind)
    if (!kind) {
      return res.status(400).json({ success: false, error: 'Invalid relation kind' })
    }
    try {
      const result = await this.editSkillRelationUseCase!.execute(
        kind,
        req.params.id as string,
        req.body
      )
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async deleteSkillRelation(req: Request, res: Response) {
    const kind = this.skillRelationKind(req.params.kind)
    if (!kind) {
      return res.status(400).json({ success: false, error: 'Invalid relation kind' })
    }
    try {
      const result = await this.deleteSkillRelationUseCase!.execute(kind, req.params.id as string)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async createDisadvantage(req: Request, res: Response) {
    try {
      await this.createGameTableDisadvantagesUseCase!.execute(req.body)
      return res.json({ success: true })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async editDisadvantage(req: Request, res: Response) {
    try {
      await this.editGameTableDisadvantagesUseCase!.execute({ id: req.params.id, ...req.body })
      return res.json({ success: true })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async deleteDisadvantage(req: Request, res: Response) {
    try {
      const result = await this.deleteGameTableDisadvantageUseCase!.execute(req.params.id as string)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async deleteAdvantage(req: Request, res: Response) {
    try {
      const result = await this.deleteGameTableAdvantageUseCase!.execute(req.params.id as string)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async deleteItem(req: Request, res: Response) {
    try {
      const result = await this.deleteGameTableItemUseCase!.execute(req.params.id as string)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async deleteNPC(req: Request, res: Response) {
    try {
      const result = await this.deleteGameTableNPCUseCase!.execute(req.params.id as string)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async deleteCharacter(req: Request, res: Response) {
    try {
      const result = await this.deleteGameTableCharacterUseCase!.execute(req.params.id as string)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }
  
  async findAllAdvantages(req: Request, res: Response) {
    const { search, category, viewer } = req.query
    const advantages = await this.findAllGameTableAdvantagesUseCase.execute(
      req.params.id as string,
      search as string | undefined,
      category as string | undefined,
      viewer as string | undefined,
      parsePage(req.query)
    )
    return res.json(advantages)
  }

  async findAllDisadvantages(req: Request, res: Response) {
    const { search, category, viewer } = req.query
    const disadvantages = await this.findAllGameTableDisadvantagesUseCase.execute(
      req.params.id as string,
      search as string | undefined,
      category as string | undefined,
      viewer as string | undefined,
      parsePage(req.query)
    )
    return res.json(disadvantages)
  }

  async findAllItems(req: Request, res: Response) {
    const { search, category, type, viewer, location } = req.query
    const Items = await this.findAllGameTableItemsUseCase.execute(
      req.params.id as string,
      search as string | undefined,
      category as string | undefined,
      type as string | undefined,
      viewer as string | undefined,
      location as string | undefined,
      parsePage(req.query)
    )
    return res.json(Items)
  }

  async findAllNPCS(req: Request, res: Response) {
    const { location } = req.query
    const NPCS = await this.findAllGameTableNPCSUseCase.execute(
      req.params.id as string,
      location as string | undefined,
      parsePage(req.query)
    )
    return res.json(NPCS)
  }

  async createAdvantage(req: Request, res: Response) {
    try {
      await this.createGameTableAdvantagesUseCase!.execute(req.body)
      return res.json({ success: true })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async editAdvantage(req: Request, res: Response) {
    try {
      // O id da rota tem precedência sobre o do body para evitar editar a linha errada.
      await this.editGameTableAdvantagesUseCase!.execute({ ...req.body, id: req.params.id as string })
      return res.json({ success: true })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async findAdvantage(req: Request, res: Response) {
    const advantage = await this.findGameTableAdvantageUseCase.execute(req.params.id as string)
    return res.json(advantage)
  }

  async createPeculiarity(req: Request, res: Response) {
    await this.createGameTablePeculiaritiesUseCase!.execute(req.body)
    return res.json({ success: true })
  }

  async editPeculiarity(req: Request, res: Response) {
    await this.editGameTablePeculiaritiesUseCase!.execute(req.body)
    return res.json({ success: true })
  }

  async findPeculiarity(req: Request, res: Response) {
    const peculiarity = await this.findGameTablePeculiarityUseCase.execute(req.params.id as string)
    return res.json(peculiarity)
  }

  async findAllPeculiarities(req: Request, res: Response) {
    const peculiarities = await this.findAllGameTablePeculiaritiesUseCase.execute(req.params.id as string)
    return res.json(peculiarities)
  }

  async createItem(req: Request, res: Response) {
    const result = await this.createGameTableItemsUseCase!.execute(req.body)
    return res.json({ success: true, ...result })
  }

  async editItem(req: Request, res: Response) {
    await this.editGameTableItemsUseCase!.execute(req.body)
    return res.json({ success: true })
  }

  async findItem(req: Request, res: Response) {
    const item = await this.findGameTableItemUseCase.execute(req.params.id as string)
    return res.json(item)
  }

  async findDisadvantage(req: Request, res: Response) {
    const disadvantage = await this.findGameTableDisadvantageUseCase!.execute(req.params.id as string)
    return res.json(disadvantage)
  }

  async findLocation(req: Request, res: Response) {
    try {
      const locationId = req.params.id as string
      // Aqui `:id` é o local, não a mesa: a mesa vem da própria location.
      const tableId = resolveLocationTableId(locationId)
      if (!tableId) return res.status(404).json({ success: false, error: 'Local não encontrado.' })

      const viewer = await this.resolveViewer(req, tableId)
      const location = await this.findTableLocationUseCase!.execute(locationId, viewer)
      if (!location) return res.status(404).json({ success: false, error: 'Local não encontrado.' })
      return res.json(location)
    } catch (err: any) {
      const status = err instanceof TableAccessError ? err.status : 400
      return res.status(status).json({ success: false, error: err.message })
    }
  }

  async findAllLocations(req: Request, res: Response) {
    try {
      // Aqui `:id` já é a mesa.
      const viewer = await this.resolveViewer(req, req.params.id as string)
      const locations = await this.findAllTableLocationsUseCase!.execute(
        req.params.id as string,
        viewer
      )
      return res.json(locations)
    } catch (err: any) {
      const status = err instanceof TableAccessError ? err.status : 400
      return res.status(status).json({ success: false, error: err.message })
    }
  }

  async createLocation(req: Request, res: Response) {
    const location = await this.createTableLocationUseCase!.execute(req.body)
    const tableId = resolveLocationTableId(location?.id) ?? resolveTableId(req.body)
    if (tableId) publishTable(tableId, 'location')
    return res.json(location)
  }

  async editLocation(req: Request, res: Response) {
    await this.editTableLocationUseCase!.execute({ id: req.params.id, ...req.body })
    const tableId = resolveLocationTableId(req.params.id as string)
    if (tableId) publishTable(tableId, 'location')
    return res.json({ success: true })
  }

  async deleteLocation(req: Request, res: Response) {
    try {
      const tableId = resolveLocationTableId(req.params.id as string)
      const result = await this.deleteTableLocationUseCase!.execute(req.params.id as string)
      if (tableId) publishTable(tableId, 'location')
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async setDefaultLocation(req: Request, res: Response) {
    const { tableId, locationId } = req.body as { tableId?: string; locationId?: string | null }
    if (!tableId) {
      return res.status(400).json({ success: false, error: 'tableId is required' })
    }
    const result = await this.setDefaultGameLocationUseCase!.execute(tableId, locationId ?? null)
    if (result?.success === false) {
      return res.status(400).json(result)
    }
    publishTable(tableId, 'location')
    return res.json(result)
  }

  async createNPC(req: Request, res: Response) {
    const result = await this.createGameTableNPCSUseCase!.execute(req.body)
    return res.json({ success: true, ...result })
  }

  async editNPC(req: Request, res: Response) {
    await this.editGameTableNPCSUseCase!.execute(req.body)
    return res.json({ success: true })
  }

  async findNPC(req: Request, res: Response) {
    const npc = await this.findGameTableNPCUseCase.execute(req.params.id as string)
    return res.json(npc)
  }

  async createNPCVisibility(req: Request, res: Response) {
    await this.createGameTableNPCVisibilityUseCase!.execute(req.body)
    return res.json({ success: true })
  }

  async editNPCVisibility(req: Request, res: Response) {
    await this.editGameTableNPCVisibilityUseCase!.execute(req.body)
    return res.json({ success: true })
  }

  async findNPCVisibility(req: Request, res: Response) {
    const visibility = await this.findGameTableNPCVisibilityUseCase!.execute(req.params.id as string)
    return res.json(visibility)
  }

  async findAllNPCVisibility(req: Request, res: Response) {
    return res.json([])
  }

  async createCharacter(req: Request, res: Response) {
    try {
      const result = await this.createGameTableCharacterUseCase!.execute(req.body)
      return res.json({ success: true, ...result })
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message })
    }
  }

  async editCharacter(req: Request, res: Response) {
    await this.editGameTableCharacterUseCase!.execute(req.body)
    return res.json({ success: true })
  }

  async editCharacterEquipment(req: Request, res: Response) {
    const result = await this.editGameCharacterEquipmentUseCase!.execute(req.body)
    return res.json(result)
  }

  async deleteCharacterEquipment(req: Request, res: Response) {
    const result = await this.deleteGameCharacterEquipmentUseCase!.execute(req.body)
    return res.json(result)
  }

  async transferCharacterEquipment(req: Request, res: Response) {
    const result = await this.transferGameCharacterEquipmentUseCase!.execute(req.body)
    return res.json(result)
  }

  async sellCharacterEquipment(req: Request, res: Response) {
    const result = await this.sellGameCharacterEquipmentUseCase!.execute(req.body)
    return res.json(result)
  }

  async findCharacter(req: Request, res: Response) {
    try {
      const moment = req.query.moment ? parseInt(req.query.moment as string, 10) : undefined
      const viewer = req.query.viewer as string | undefined
      const character = await this.findGameTableCharacterUseCase!.execute(req.params.id as string, moment, viewer)
      return res.json(character)
    } catch (error: any) {
      const status = typeof error?.status === 'number' ? error.status : 500
      return res.status(status).json({ success: false, error: error?.message ?? 'Erro ao carregar personagem.' })
    }
  }

  async findCharacterHistory(req: Request, res: Response) {
    const moment = req.query.moment ? parseInt(req.query.moment as string, 10) : undefined
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined
    const history = await this.findGameTableCharacterHistoryUseCase!.execute(req.params.id as string, moment, limit)
    return res.json(history)
  }

  async findAllCharacters(req: Request, res: Response) {
    const viewer = req.query.viewer as string | undefined
    const characters = await this.findAllGameTableCharactersUseCase!.execute(req.params.id as string, viewer, parsePage(req.query))
    return res.json(characters)
  }

  /* =============== */
  /*    MODIFIERS    */
  /* =============== */

  async createModifier(req: Request, res: Response) {
    const result = await this.createGameModifierUseCase!.execute(req.body)
    return res.json({ success: true, ...result })
  }

  async editModifier(req: Request, res: Response) {
    await this.editGameModifierUseCase!.execute(req.body)
    return res.json({ success: true })
  }

  async findModifier(req: Request, res: Response) {
    const modifier = await this.findGameModifierUseCase!.execute(req.params.id as string)
    return res.json(modifier)
  }

  async findAllModifiers(req: Request, res: Response) {
    const modifiers = await this.findAllGameModifiersUseCase!.execute(req.params.id as string)
    return res.json(modifiers)
  }

  async deleteModifier(req: Request, res: Response) {
    try {
      const result = await this.deleteGameModifierUseCase!.execute(req.params.id as string)
      return res.json(result)
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message })
    }
  }

  /* GM quick actions — materialize + log */
  async grantItem(req: Request, res: Response) {
    try {
      const result = await this.grantGameItemUseCase!.execute(req.body)
      if (result && result.success === false) {
        return res.status(400).json(result)
      }
      return res.json({ success: true, ...result })
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message })
    }
  }

  async awardPoints(req: Request, res: Response) {
    try {
      const result = await this.awardGameCharacterPointsUseCase!.execute(req.body)
      if (result && result.success === false) {
        return res.status(400).json(result)
      }
      return res.json({ success: true, ...result })
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message })
    }
  }

  /* Traços numa ficha que já existe — o gancho que faltava para a modificação
     padrão: registro o traço e o efeito entra na leitura da ficha. */
  async grantTrait(req: Request, res: Response) {
    try {
      const result = await this.grantGameTraitToCharacterUseCase!.execute(req.body)
      return res.json({ success: true, ...result })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  async removeTrait(req: Request, res: Response) {
    try {
      const result = await this.removeGameTraitFromCharacterUseCase!.execute(req.body)
      return res.json({ success: true, ...result })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  /* Liga/desliga um modelo de modificação para um personagem só. */
  async toggleModifier(req: Request, res: Response) {
    try {
      const result = await this.toggleGameModifierForCharacterUseCase!.execute(req.body)
      return res.json({ success: true, ...result })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message })
    }
  }

  /* =============== */
  /*   VISIBILITY    */
  /* =============== */

  async createVisibility(req: Request, res: Response) {
    const result = await this.createGameVisibilityUseCase!.execute(req.body)
    return res.json({ success: true, ...result })
  }

  async editVisibility(req: Request, res: Response) {
    await this.editGameVisibilityUseCase!.execute(req.body)
    return res.json({ success: true })
  }

  async findVisibility(req: Request, res: Response) {
    const visibility = await this.findGameVisibilityUseCase!.execute(req.params.id as string)
    return res.json(visibility)
  }

  async findAllVisibility(req: Request, res: Response) {
    const visibility = await this.findAllGameVisibilityUseCase!.execute(req.params.id as string)
    return res.json(visibility)
  }

  /* =============== */
  /*      QUEUE      */
  /* =============== */

  async createQueue(req: Request, res: Response) {
    try {
      const result = await this.createGameQueueUseCase!.execute(req.body)
      const tableId = resolveTableId(req.body)
      if (tableId) publishTable(tableId, 'queue')
      return res.json({ success: true, ...result })
    } catch (e: any) {
      return res.status(e?.status ?? 400).json({ success: false, error: e.message })
    }
  }

  async editQueue(req: Request, res: Response) {
    try {
      await this.editGameQueueUseCase!.execute(req.body)
      const tableId = resolveTableId(req.body)
      if (tableId) publishTable(tableId, 'queue')
      return res.json({ success: true })
    } catch (e: any) {
      return res.status(e?.status ?? 400).json({ success: false, error: e.message })
    }
  }

  async findQueue(req: Request, res: Response) {
    const queueItem = await this.findGameQueueUseCase!.execute(req.params.id as string)
    return res.json(queueItem)
  }

  async findAllQueue(req: Request, res: Response) {
    const queueItems = await this.findAllGameQueueUseCase!.execute(req.params.id as string)
    return res.json(queueItems)
  }

  /* Efeito de skill aplicado na rolagem (só quando o teste passou). */
  async applySkillEffect(req: Request, res: Response) {
    const { character_id, skill_id } = req.body as { character_id?: string; skill_id?: string }
    if (!character_id || !skill_id) {
      return res.status(400).json({ success: false, error: 'character_id and skill_id are required' })
    }
    try {
      const applied = await this.applyGameSkillEffectUseCase!.execute(character_id, skill_id)
      const tableId = resolveTableId({ character_id })
      if (tableId) publishTable(tableId, 'effect')
      return res.json({ success: true, applied })
    } catch (e: any) {
      return res.status(e?.status ?? 400).json({ success: false, error: e.message })
    }
  }

  /* Turno do jogador encerrado num passo atomico: grava a action + sai da fila. */
  async endPlayerTurn(req: Request, res: Response) {
    try {
      const result = await this.endPlayerTurnUseCase!.execute(req.body)
      const tableId = resolveTableId(req.body)
      if (tableId) publishTable(tableId, 'turn')
      return res.json({ success: true, ...result })
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message })
    }
  }

  /* =============== */
  /*  TABLE SETTINGS */
  /* =============== */

  async findTableSettings(req: Request, res: Response) {
    const settings = await this.findGameTableSettingsUseCase!.execute(req.params.id as string)
    return res.json(settings)
  }

  async editTableSettings(req: Request, res: Response) {
    try {
      await this.editGameTableSettingsUseCase!.execute(req.body)
      return res.json({ success: true })
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message })
    }
  }
}