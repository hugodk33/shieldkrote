import { Router, Request, Response } from 'express'
import { UserType } from '../../domain/types/UserType'

import { UserController } from '../controllers/UserController'
import { CreateUserUseCase } from '../../application/use-cases/users-use-cases/CreateUserUseCase'
import { UserRepository } from '../../domain/repositories/UserRepository'
import { NarratorRepository } from '../../domain/repositories/NarratorRepository'
import { FindAllUsersUseCase } from '../../application/use-cases/users-use-cases/FindAllUsersUseCase'

import { GameTableRepository } from '../../domain/repositories/GameTableRepository'
import { CreateGameTableUseCase } from '../../application/use-cases/tables-use-cases/CreateGameTableCase'
import { GameTableController } from '../controllers/GameTableController'
import { FindGameTableUseCase } from '../../application/use-cases/tables-use-cases/FindGameTableUseCase'
import { FindAllGameTablesUseCase } from '../../application/use-cases/tables-use-cases/FindAllGameTablesUseCase'
import { FindAllGameTableScenesUseCase } from '../../application/use-cases/tables-use-cases/FindAllGameTableScenesUseCase'
import { EditGameTableUseCase } from '../../application/use-cases/tables-use-cases/EditGameTableUseCase'
import { CreateSceneUseCase } from '../../application/use-cases/tables-use-cases/CreateSceneUseCase'
import { SetSceneImageUseCase } from '../../application/use-cases/tables-use-cases/SetSceneImageUseCase'
import { CreateNarrationUseCase } from '../../application/use-cases/tables-use-cases/CreateNarrationUseCase'
import { CreateNarrationActionUseCase } from '../../application/use-cases/tables-use-cases/CreateNarrationActionUseCase'

import { FindByStringUserUseCase } from '../../application/use-cases/tables-use-cases/FindByStringGameTableUseCase'
import { EditUsersUseCase } from '../../application/use-cases/users-use-cases/EditUsersUseCase'
import { AuthenticateUserUseCase } from '../../application/use-cases/users-use-cases/AuthenticateUserUseCase'
import { FindUserTablesUseCase } from '../../application/use-cases/users-use-cases/FindUserTablesUseCase'

import { GameTableRulesRepository } from '../../domain/repositories/GameTableRulesRepository'
import { FindGameTableSkillUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableSkillUseCase'
import { GameTableRulesController } from '../controllers/GameTableRulesController'
import { FindGameTableSkillsUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableSkillsUseCase'

import { FindGameTableAdvantagesUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableAdvantagesUseCase '
import { FindGameTableDisadvantagesUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableDisadvantagesUseCase'
import { FindAllGameTableNPCSUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableNPCSUseCase'
import { FindGameTableItemsUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableItemsUseCase'
import { CreateGameTableAdvantagesUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableAdvantagesUseCase'
import { EditGameTableAdvantagesUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableAdvantagesUseCase'
import { FindGameTableAdvantageUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableAdvantageUseCase'
import { FindGameTablePeculiarityUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTablePeculiarityUseCase'
import { FindAllGameTablePeculiaritiesUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTablePeculiaritiesUseCase'
import { CreateGameTablePeculiaritiesUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTablePeculiaritiesUseCase'
import { EditGameTablePeculiaritiesUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTablePeculiaritiesUseCase'
import { FindGameTableItemUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableItemUseCase'
import { CreateGameTableItemsUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableItemsUseCase'
import { EditGameTableItemsUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableItemsUseCase'
import { CreateGameTableNPCUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableNPCUseCase'
import { EditGameTableNPCUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableNPCUseCase'
import { FindGameTableNPCUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableNPCUseCase'
import { CreateGameTableCharacterUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableCharacterUseCase'
import { EditGameTableCharacterUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableCharacterUseCase'
import { FindGameTableCharacterUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableCharacterUseCase'
import { FindGameTableCharacterHistoryUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableCharacterHistoryUseCase'
import { EditGameCharacterEquipmentUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameCharacterEquipmentUseCase'
import { DeleteGameCharacterEquipmentUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteGameCharacterEquipmentUseCase'
import { TransferGameCharacterEquipmentUseCase } from '../../application/use-cases/table-game-rules-use-case/TransferGameCharacterEquipmentUseCase'
import { SellGameCharacterEquipmentUseCase } from '../../application/use-cases/table-game-rules-use-case/SellGameCharacterEquipmentUseCase'
import { FindAllGameTableCharactersUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameTableCharactersUseCase'
import { FindGameTableNPCVisibilityUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameTableNPCVisibilityUseCase'
import { EditGameTableNPCVisibilityUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameTableNPCVisibilityUseCase'
import { CreateGameTableNPCVisibilityUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameTableNPCVisibilityUseCase'
import { CreateGameModifierUseCase } from '../../application/use-cases/table-game-rules-use-case/CreateGameModifierUseCase'
import { EditGameModifierUseCase } from '../../application/use-cases/table-game-rules-use-case/EditGameModifierUseCase'
import { FindGameModifierUseCase } from '../../application/use-cases/table-game-rules-use-case/FindGameModifierUseCase'
import { FindAllGameModifiersUseCase } from '../../application/use-cases/table-game-rules-use-case/FindAllGameModifiersUseCase'
import { DeleteGameModifierUseCase } from '../../application/use-cases/table-game-rules-use-case/DeleteGameModifierUseCase'
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
import { EndPlayerTurnUseCase } from '../../application/use-cases/table-game-rules-use-case/EndPlayerTurnUseCase'
import { FindUserByIdUseCase } from '../../application/use-cases/users-use-cases/FindUserByIdUseCase'

import { ContentCatalogRepository } from '../../domain/repositories/ContentCatalogRepository'
import { FindContentCatalogUseCase } from '../../application/use-cases/content-use-cases/FindContentCatalogUseCase'
import { CreateContentModuleUseCase } from '../../application/use-cases/content-use-cases/CreateContentModuleUseCase'
import { CreateContentCategoryUseCase } from '../../application/use-cases/content-use-cases/CreateContentCategoryUseCase'
import { ContentModuleController } from '../controllers/ContentModuleController'
import { TableAccessController } from '../controllers/TableAccessController'
import { TableAccessRepository } from '../../domain/repositories/TableAccessRepository'
import {
  ListTableAccessUseCase,
  ResolveTableViewerUseCase,
  RevokeTableAccessUseCase,
  SaveTableAccessUseCase,
} from '../../application/use-cases/table-access-use-cases/TableAccessUseCases'
import { TableJoinController } from '../controllers/TableJoinController'
import { TableJoinRequestRepository } from '../../domain/repositories/TableJoinRequestRepository'
import {
  CancelJoinRequestUseCase,
  GetJoinStatusUseCase,
  GetMembershipUseCase,
  LeaveTableUseCase,
  ListJoinCandidatesUseCase,
  ListJoinRequestsUseCase,
  ListTableMembersUseCase,
  RemoveTableMemberUseCase,
  RequestTableJoinUseCase,
  ResolveJoinRequestUseCase,
  SetMemberMutedUseCase,
} from '../../application/use-cases/table-join-use-cases/TableJoinUseCases'
import { publishTable, resolveLocationTableId } from '../../infra/realtime/TableEvents'
import { TradeController } from '../controllers/TradeController'
import { TradeRepository } from '../../domain/repositories/TradeRepository'
import {
  CancelTradeOfferUseCase,
  ConfirmTradeOfferUseCase,
  CreateTradeOfferUseCase,
  EditTradeOfferUseCase,
  GetTradeOfferUseCase,
  ListCharacterTradeOffersUseCase,
  ListTableTradeOffersUseCase,
  RejectTradeOfferUseCase,
} from '../../application/use-cases/trade-use-cases/TradeUseCases'
import { LocationShopController } from '../controllers/LocationShopController'
import { LocationShopRepository } from '../../domain/repositories/LocationShopRepository'
import {
  CopyItemIntoLocationShopUseCase,
  EditLocationShopItemUseCase,
  FindLocationShopUseCase,
  RemoveLocationShopItemUseCase,
  StockLocationShopItemUseCase,
} from '../../application/use-cases/location-shop-use-cases/LocationShopUseCases'

const router: Router = Router()

const repo = new UserRepository()
const narratorRepo = new NarratorRepository()
const gameTableRepo = new GameTableRepository()
const gameTableRulesRepo = new GameTableRulesRepository()
const contentCatalogRepo = new ContentCatalogRepository()

/* USERS */
const findAllUsersUseCase = new FindAllUsersUseCase(repo)
const findUserByIdUseCase = new FindUserByIdUseCase(repo)
const createUserUseCase = new CreateUserUseCase(repo, narratorRepo)
const findByStringUserUseCase = new FindByStringUserUseCase(repo)
const editUsersUseCase = new EditUsersUseCase(repo) 
const authenticateUserUseCase = new AuthenticateUserUseCase(repo)
const tableAccessRepo = new TableAccessRepository()
const findUserTablesUseCase = new FindUserTablesUseCase(repo, gameTableRepo, tableAccessRepo)

/* ========== */
const userController = 
    new UserController(
        createUserUseCase, 
        findAllUsersUseCase , 
        findUserByIdUseCase,
        findByStringUserUseCase, 
        editUsersUseCase,
        authenticateUserUseCase,
        findUserTablesUseCase
    );  

/* GAME TABLE */
const createGameTableUseCase = new CreateGameTableUseCase(gameTableRepo, contentCatalogRepo)
const findGameTableUseCase = new FindGameTableUseCase(gameTableRepo)
const findAllGameTablesUseCase = new FindAllGameTablesUseCase(gameTableRepo)
const findAllGameTableScenesUseCase = new FindAllGameTableScenesUseCase(gameTableRepo)
const editGameTableUseCase = new EditGameTableUseCase(gameTableRepo)
const createSceneUseCase = new CreateSceneUseCase(gameTableRepo)
const setSceneImageUseCase = new SetSceneImageUseCase(gameTableRepo)
const createNarrationUseCase = new CreateNarrationUseCase(gameTableRepo)
const createNarrationActionUseCase = new CreateNarrationActionUseCase(gameTableRepo)
/* ========== */
const gameTableController = new GameTableController(createGameTableUseCase, findGameTableUseCase , findAllGameTablesUseCase , findAllGameTableScenesUseCase, editGameTableUseCase, createSceneUseCase, createNarrationUseCase, createNarrationActionUseCase, setSceneImageUseCase)

/* CONTENT MODULES */
const findContentCatalogUseCase = new FindContentCatalogUseCase(contentCatalogRepo)
const createContentModuleUseCase = new CreateContentModuleUseCase(contentCatalogRepo)
const createContentCategoryUseCase = new CreateContentCategoryUseCase(contentCatalogRepo)
/* ========== */
const contentModuleController = new ContentModuleController(
    findContentCatalogUseCase,
    createContentModuleUseCase,
    createContentCategoryUseCase
)

/* ============================================================
   SUPERADMIN — o "anel que comanda os outros anéis".
   A seed cria d3miurg0 como usuário type 2 (Admin). O cadastro do
   catálogo global (pacotes e categorias) é exclusivo dele; qualquer
   outro ator recebe 403. A identidade dev continua vindo do `actor`.
   ============================================================ */
const SUPERADMIN_USERNAME = 'd3miurg0'

function resolveActorId(req: Request): string | null {
  const queryActor = typeof req.query?.actor === 'string' ? req.query.actor : null
  const bodyActor = typeof req.body?.actor === 'string' ? req.body.actor : null
  const headerActor = typeof req.headers['x-actor'] === 'string' ? req.headers['x-actor'] : null
  return queryActor || bodyActor || headerActor || null
}

async function requireSuperAdmin(req: Request, res: Response): Promise<boolean> {
  const actorId = resolveActorId(req)
  if (!actorId) {
    res.status(401).json({ error: 'Informe o superadmin em ?actor=<userId>.' })
    return false
  }
  const actor = await repo.findById(actorId)
  if (!actor || actor.type !== UserType.Admin || actor.username !== SUPERADMIN_USERNAME) {
    res.status(403).json({ error: 'Apenas d3miurg0 pode cadastrar pacotes e categorias.' })
    return false
  }
  return true
}

/* TABLE ACCESS (narrador convidado) */
const listTableAccessUseCase = new ListTableAccessUseCase(tableAccessRepo, repo)
const saveTableAccessUseCase = new SaveTableAccessUseCase(tableAccessRepo, repo)
const revokeTableAccessUseCase = new RevokeTableAccessUseCase(tableAccessRepo, repo)
/* Resolve quem está pedindo a partir do `actor` — usado no filtro de locations. */
const resolveTableViewerUseCase = new ResolveTableViewerUseCase(
    tableAccessRepo,
    repo,
    gameTableRulesRepo
)
/* ========== */
const tableAccessController = new TableAccessController(
    listTableAccessUseCase,
    saveTableAccessUseCase,
    revokeTableAccessUseCase
)

/* TABLE JOIN (entrada na mesa com pré-aprovação) */
const tableJoinRepo = new TableJoinRequestRepository()
const requestTableJoinUseCase = new RequestTableJoinUseCase(tableJoinRepo, tableAccessRepo, repo)
const getJoinStatusUseCase = new GetJoinStatusUseCase(tableJoinRepo, tableAccessRepo, repo)
const listJoinCandidatesUseCase = new ListJoinCandidatesUseCase(tableJoinRepo, tableAccessRepo, repo)
const listJoinRequestsUseCase = new ListJoinRequestsUseCase(tableJoinRepo, tableAccessRepo, repo)
const resolveJoinRequestUseCase = new ResolveJoinRequestUseCase(tableJoinRepo, tableAccessRepo, repo)
const cancelJoinRequestUseCase = new CancelJoinRequestUseCase(tableJoinRepo)
const listTableMembersUseCase = new ListTableMembersUseCase(tableJoinRepo, tableAccessRepo, repo)
const setMemberMutedUseCase = new SetMemberMutedUseCase(tableJoinRepo, tableAccessRepo, repo)
const removeTableMemberUseCase = new RemoveTableMemberUseCase(tableJoinRepo, tableAccessRepo, repo)
const leaveTableUseCase = new LeaveTableUseCase(tableJoinRepo)
const getMembershipUseCase = new GetMembershipUseCase(tableJoinRepo)
/* ========== */
const tableJoinController = new TableJoinController(
    requestTableJoinUseCase,
    getJoinStatusUseCase,
    listJoinCandidatesUseCase,
    listJoinRequestsUseCase,
    resolveJoinRequestUseCase,
    cancelJoinRequestUseCase,
    listTableMembersUseCase,
    setMemberMutedUseCase,
    removeTableMemberUseCase,
    leaveTableUseCase,
    getMembershipUseCase
)

/* GAME TABLE RULES*/
const findGameTableSkillsUseCase = new FindGameTableSkillUseCase(gameTableRulesRepo)   
const findAllGameTableSkillsUseCase = new FindGameTableSkillsUseCase(gameTableRulesRepo) 
const findGameTableAdvantageUseCase = new FindGameTableAdvantageUseCase(gameTableRulesRepo)
const findAllGameTableAdvantagesUseCase = new FindGameTableAdvantagesUseCase(gameTableRulesRepo)
const findAllGameTableDisadvantagesUseCase = new FindGameTableDisadvantagesUseCase(gameTableRulesRepo)
const createGameTableAdvantagesUseCase = new CreateGameTableAdvantagesUseCase(gameTableRulesRepo)
const editGameTableAdvantagesUseCase = new EditGameTableAdvantagesUseCase(gameTableRulesRepo)
const findGameTablePeculiarityUseCase = new FindGameTablePeculiarityUseCase(gameTableRulesRepo)
const findAllGameTablePeculiaritiesUseCase = new FindAllGameTablePeculiaritiesUseCase(gameTableRulesRepo)
const createGameTablePeculiaritiesUseCase = new CreateGameTablePeculiaritiesUseCase(gameTableRulesRepo)
const editGameTablePeculiaritiesUseCase = new EditGameTablePeculiaritiesUseCase(gameTableRulesRepo)
const findGameTableItemUseCase = new FindGameTableItemUseCase(gameTableRulesRepo)
const createGameTableItemsUseCase = new CreateGameTableItemsUseCase(gameTableRulesRepo)
const editGameTableItemsUseCase = new EditGameTableItemsUseCase(gameTableRulesRepo)
const findAllGameTableItemsUseCase = new FindGameTableItemsUseCase(gameTableRulesRepo)
const findGameTableNPCSSingleUseCase = new FindGameTableNPCUseCase(gameTableRulesRepo)
const findAllGameNPCsUseCase = new FindAllGameTableNPCSUseCase(gameTableRulesRepo)
const createGameTableNPCSUseCase = new CreateGameTableNPCUseCase(gameTableRulesRepo)
const editGameTableNPCSUseCase = new EditGameTableNPCUseCase(gameTableRulesRepo)
const createGameTableCharacterUseCase = new CreateGameTableCharacterUseCase(gameTableRulesRepo)
const editGameTableCharacterUseCase = new EditGameTableCharacterUseCase(gameTableRulesRepo)
const findGameTableCharacterUseCase = new FindGameTableCharacterUseCase(gameTableRulesRepo)
const findGameTableCharacterHistoryUseCase = new FindGameTableCharacterHistoryUseCase(gameTableRulesRepo)
const editGameCharacterEquipmentUseCase = new EditGameCharacterEquipmentUseCase(gameTableRulesRepo)
const deleteGameCharacterEquipmentUseCase = new DeleteGameCharacterEquipmentUseCase(gameTableRulesRepo)
const transferGameCharacterEquipmentUseCase = new TransferGameCharacterEquipmentUseCase(gameTableRulesRepo)
const sellGameCharacterEquipmentUseCase = new SellGameCharacterEquipmentUseCase(gameTableRulesRepo)
const findAllGameTableCharactersUseCase = new FindAllGameTableCharactersUseCase(gameTableRulesRepo)
const createGameTableNPCVisibilityUseCase = new CreateGameTableNPCVisibilityUseCase(gameTableRulesRepo)
const editGameTableNPCVisibilityUseCase = new EditGameTableNPCVisibilityUseCase(gameTableRulesRepo)
const findGameTableNPCVisibilityUseCase = new FindGameTableNPCVisibilityUseCase(gameTableRulesRepo)
const createGameModifierUseCase = new CreateGameModifierUseCase(gameTableRulesRepo)
const editGameModifierUseCase = new EditGameModifierUseCase(gameTableRulesRepo)
const findGameModifierUseCase = new FindGameModifierUseCase(gameTableRulesRepo)
const findAllGameModifiersUseCase = new FindAllGameModifiersUseCase(gameTableRulesRepo)
const deleteGameModifierUseCase = new DeleteGameModifierUseCase(gameTableRulesRepo)
const createGameVisibilityUseCase = new CreateGameVisibilityUseCase(gameTableRulesRepo)
const editGameVisibilityUseCase = new EditGameVisibilityUseCase(gameTableRulesRepo)
const findGameVisibilityUseCase = new FindGameVisibilityUseCase(gameTableRulesRepo)
const findAllGameVisibilityUseCase = new FindAllGameVisibilityUseCase(gameTableRulesRepo)
const createGameQueueUseCase = new CreateGameQueueUseCase(gameTableRulesRepo)
const editGameQueueUseCase = new EditGameQueueUseCase(gameTableRulesRepo)
const findGameQueueUseCase = new FindGameQueueUseCase(gameTableRulesRepo)
const findAllGameQueueUseCase = new FindAllGameQueueUseCase(gameTableRulesRepo)
const applyGameSkillEffectUseCase = new ApplyGameSkillEffectUseCase(gameTableRulesRepo)
const findGameTableDisadvantageUseCase = new FindGameTableDisadvantageUseCase(gameTableRulesRepo)
const findTableLocationUseCase = new FindTableLocationUseCase(gameTableRulesRepo)
const findAllTableLocationsUseCase = new FindAllTableLocationsUseCase(gameTableRulesRepo)
const createTableLocationUseCase = new CreateTableLocationUseCase(gameTableRulesRepo)
const editTableLocationUseCase = new EditTableLocationUseCase(gameTableRulesRepo)
const deleteTableLocationUseCase = new DeleteTableLocationUseCase(gameTableRulesRepo)
const setDefaultGameLocationUseCase = new SetDefaultGameLocationUseCase(gameTableRulesRepo)
const endPlayerTurnUseCase = new EndPlayerTurnUseCase(gameTableRulesRepo)
const grantGameItemUseCase = new GrantGameItemUseCase(gameTableRulesRepo)
const awardGameCharacterPointsUseCase = new AwardGameCharacterPointsUseCase(gameTableRulesRepo)
const grantGameTraitToCharacterUseCase = new GrantGameTraitToCharacterUseCase(gameTableRulesRepo)
const removeGameTraitFromCharacterUseCase = new RemoveGameTraitFromCharacterUseCase(gameTableRulesRepo)
const toggleGameModifierForCharacterUseCase = new ToggleGameModifierForCharacterUseCase(gameTableRulesRepo)
const findGameTableSettingsUseCase = new FindGameTableSettingsUseCase(gameTableRulesRepo)
const editGameTableSettingsUseCase = new EditGameTableSettingsUseCase(gameTableRulesRepo)
const createGameTableSkillsUseCase = new CreateGameTableSkillsUseCase(gameTableRulesRepo)
const editGameTableSkillsUseCase = new EditGameTableSkillsUseCase(gameTableRulesRepo)
const deleteGameTableSkillUseCase = new DeleteGameTableSkillUseCase(gameTableRulesRepo)
const createSkillRelationUseCase = new CreateSkillRelationUseCase(gameTableRulesRepo)
const editSkillRelationUseCase = new EditSkillRelationUseCase(gameTableRulesRepo)
const deleteSkillRelationUseCase = new DeleteSkillRelationUseCase(gameTableRulesRepo)
const createGameTableDisadvantagesUseCase = new CreateGameTableDisadvantagesUseCase(gameTableRulesRepo)
const editGameTableDisadvantagesUseCase = new EditGameTableDisadvantagesUseCase(gameTableRulesRepo)
const deleteGameTableDisadvantageUseCase = new DeleteGameTableDisadvantageUseCase(gameTableRulesRepo)
const deleteGameTableAdvantageUseCase = new DeleteGameTableAdvantageUseCase(gameTableRulesRepo)
const deleteGameTableItemUseCase = new DeleteGameTableItemUseCase(gameTableRulesRepo)
const deleteGameTableNPCUseCase = new DeleteGameTableNPCUseCase(gameTableRulesRepo)
const deleteGameTableCharacterUseCase = new DeleteGameTableCharacterUseCase(gameTableRulesRepo)

/* ========== */
const gameTableRulesController = new GameTableRulesController(
    findGameTableSkillsUseCase,
    findAllGameTableSkillsUseCase,
    findGameTableAdvantageUseCase,
    findAllGameTableAdvantagesUseCase,
    findAllGameTableDisadvantagesUseCase,
    findGameTablePeculiarityUseCase,
    findAllGameTablePeculiaritiesUseCase,
    findGameTableItemUseCase,
    findAllGameTableItemsUseCase,
    findGameTableNPCSSingleUseCase,
    findAllGameNPCsUseCase,
    createGameTableAdvantagesUseCase,
    editGameTableAdvantagesUseCase,
    createGameTablePeculiaritiesUseCase,
    editGameTablePeculiaritiesUseCase,
    createGameTableItemsUseCase,
    editGameTableItemsUseCase,
    createGameTableNPCSUseCase,
    editGameTableNPCSUseCase,
    createGameTableNPCVisibilityUseCase,
    editGameTableNPCVisibilityUseCase,
    findGameTableNPCVisibilityUseCase,
    createGameTableCharacterUseCase,
    editGameTableCharacterUseCase,
    findGameTableCharacterUseCase,
    findAllGameTableCharactersUseCase,
    findGameTableCharacterHistoryUseCase,
    editGameCharacterEquipmentUseCase,
    createGameModifierUseCase,
    editGameModifierUseCase,
    findGameModifierUseCase,
    findAllGameModifiersUseCase,
    deleteGameModifierUseCase,
    createGameVisibilityUseCase,
    editGameVisibilityUseCase,
    findGameVisibilityUseCase,
    findAllGameVisibilityUseCase,
    createGameQueueUseCase,
    editGameQueueUseCase,
    findGameQueueUseCase,
    findAllGameQueueUseCase,
    applyGameSkillEffectUseCase,
    findGameTableDisadvantageUseCase,
    findTableLocationUseCase,
    findAllTableLocationsUseCase,
    createTableLocationUseCase,
    editTableLocationUseCase,
    deleteTableLocationUseCase,
    setDefaultGameLocationUseCase,
    endPlayerTurnUseCase,
    deleteGameCharacterEquipmentUseCase,
    transferGameCharacterEquipmentUseCase,
    sellGameCharacterEquipmentUseCase,
    grantGameItemUseCase,
    awardGameCharacterPointsUseCase,
    grantGameTraitToCharacterUseCase,
    removeGameTraitFromCharacterUseCase,
    toggleGameModifierForCharacterUseCase,
    findGameTableSettingsUseCase,
    editGameTableSettingsUseCase,
    createGameTableSkillsUseCase,
    editGameTableSkillsUseCase,
    deleteGameTableSkillUseCase,
  createSkillRelationUseCase,
  editSkillRelationUseCase,
  deleteSkillRelationUseCase,
    createGameTableDisadvantagesUseCase,
    editGameTableDisadvantagesUseCase,
    deleteGameTableDisadvantageUseCase,
    deleteGameTableAdvantageUseCase,
    deleteGameTableItemUseCase,
    deleteGameTableNPCUseCase,
    deleteGameTableCharacterUseCase,
    resolveTableViewerUseCase)

/* TRADE (troca entre jogadores) */
const tradeRepo = new TradeRepository()
const createTradeOfferUseCase = new CreateTradeOfferUseCase(tradeRepo, tableAccessRepo)
const listCharacterTradeOffersUseCase = new ListCharacterTradeOffersUseCase(tradeRepo, tableAccessRepo)
const listTableTradeOffersUseCase = new ListTableTradeOffersUseCase(tradeRepo, tableAccessRepo)
const getTradeOfferUseCase = new GetTradeOfferUseCase(tradeRepo, tableAccessRepo)
const editTradeOfferUseCase = new EditTradeOfferUseCase(tradeRepo, tableAccessRepo)
const confirmTradeOfferUseCase = new ConfirmTradeOfferUseCase(tradeRepo, tableAccessRepo)
const rejectTradeOfferUseCase = new RejectTradeOfferUseCase(tradeRepo, tableAccessRepo)
const cancelTradeOfferUseCase = new CancelTradeOfferUseCase(tradeRepo, tableAccessRepo)
/* ========== */
const tradeController = new TradeController(
    createTradeOfferUseCase,
    listCharacterTradeOffersUseCase,
    listTableTradeOffersUseCase,
    getTradeOfferUseCase,
    editTradeOfferUseCase,
    confirmTradeOfferUseCase,
    rejectTradeOfferUseCase,
    cancelTradeOfferUseCase
)

/* LOCATION SHOP (estoque das lojas por local) */
const locationShopRepo = new LocationShopRepository()
const findLocationShopUseCase = new FindLocationShopUseCase(locationShopRepo, gameTableRulesRepo)
const stockLocationShopItemUseCase = new StockLocationShopItemUseCase(locationShopRepo, gameTableRulesRepo)
const copyItemIntoLocationShopUseCase = new CopyItemIntoLocationShopUseCase(locationShopRepo, gameTableRulesRepo)
const editLocationShopItemUseCase = new EditLocationShopItemUseCase(locationShopRepo, gameTableRulesRepo)
const removeLocationShopItemUseCase = new RemoveLocationShopItemUseCase(locationShopRepo, gameTableRulesRepo)
const locationShopController = new LocationShopController(
    findLocationShopUseCase,
    stockLocationShopItemUseCase,
    copyItemIntoLocationShopUseCase,
    editLocationShopItemUseCase,
    removeLocationShopItemUseCase
)

/* ROUTES */
/* ===== USER ===== */
router.post('/login', (req, res) => userController.login(req, res))
router.post('/create-user', (req, res) => userController.create(req, res))
router.get('/users', (req, res) => userController.findAll(req, res))
router.get('/users/search/:searchTerm', (req, res) => userController.findByString(req, res))
router.get('/users/:id/tables', (req, res) => userController.tables(req, res))
router.get('/users/:id', (req, res) => userController.findById(req, res))
router.put('/users/edit/:id', (req, res) => userController.editUser(req, res))

/* ===== GAME TABLES ===== */
router.post('/create-game-table', (req, res) => gameTableController.create(req, res))
router.get('/game-tables', (req, res) => gameTableController.findAll(req, res))
router.get('/game-table/:id', (req, res) => gameTableController.findById(req, res))
router.get('/game-table-scenes/:id', (req, res) => gameTableController.findByAllScenes(req, res))
router.put('/game-table/edit/:id', (req, res) => gameTableController.editGameTable(req, res))
router.post('/game-table-scene', (req, res) => gameTableController.createScene(req, res))
router.put('/game-table-scene/:id', (req, res) => gameTableController.setSceneImage(req, res))
router.post('/game-table-narration', (req, res) => gameTableController.createNarration(req, res))
router.post('/game-table-action', (req, res) => gameTableController.createNarrationAction(req, res))

/* ===== TABLE ACCESS (narrador convidado) ===== */
router.get('/table-access/resources', (req, res) => tableAccessController.resources(req, res))
router.get('/game-table/:id/access', (req, res) => tableAccessController.list(req, res))
router.post('/game-table/:id/access', (req, res) => tableAccessController.save(req, res))
router.put('/game-table/:id/access', (req, res) => tableAccessController.save(req, res))
router.delete('/game-table/:id/access/:userId', (req, res) => tableAccessController.revoke(req, res))

/* ===== TABLE JOIN (entrada com pré-aprovação) ===== */
router.get('/table-join/roles', (req, res) => tableJoinController.roles(req, res))
router.get('/game-table/:id/join/candidates', (req, res) => tableJoinController.candidates(req, res))
router.get('/game-table/:id/join-requests', (req, res) => tableJoinController.list(req, res))
router.post('/game-table/:id/join-requests/:userId', (req, res) => tableJoinController.resolve(req, res))
router.get('/game-table/:id/join', (req, res) => tableJoinController.status(req, res))
router.post('/game-table/:id/join', (req, res) => tableJoinController.request(req, res))
router.delete('/game-table/:id/join/:userId', (req, res) => tableJoinController.cancel(req, res))

/* ===== ELENCO DA MESA (membros: silenciar / remover / sair) ===== */
router.get('/game-table/:id/members', (req, res) => tableJoinController.members(req, res))
router.get('/game-table/:id/membership', (req, res) => tableJoinController.membership(req, res))
router.put('/game-table/:id/members/:userId/mute', (req, res) => tableJoinController.mute(req, res))
router.delete('/game-table/:id/members/:userId', (req, res) => tableJoinController.removeMember(req, res))
router.post('/game-table/:id/leave', (req, res) => tableJoinController.leave(req, res))

/* ações de cena: editar / excluir / duplicar (na mesma narração) */
const resolveActionTableId = async (id: string): Promise<string | null> => {
  const action: any = await gameTableRepo.readNarrationAction(id)
  if (!action) return null
  return gameTableRepo.getNarrationTableId(action.narrations_id)
}
router.put('/game-table-action/:id', async (req, res) => {
  try {
    const result = await gameTableRepo.editNarrationAction(req.params.id, req.body)
    const tableId = await resolveActionTableId(req.params.id)
    if (tableId) publishTable(tableId, 'action')
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})
router.delete('/game-table-action/:id', async (req, res) => {
  try {
    const tableId = await resolveActionTableId(req.params.id)
    const result = await gameTableRepo.deleteNarrationAction(req.params.id)
    if (tableId) publishTable(tableId, 'action')
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})
router.post('/game-table-action/:id/copy', async (req, res) => {
  try {
    const result = await gameTableRepo.duplicateNarrationAction(req.params.id)
    const tableId = await resolveActionTableId(req.params.id)
    if (tableId) publishTable(tableId, 'action')
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

/* cópia de catálogos para outra mesa */
const copyHandler = (fn: (id: string, tableId: string) => Promise<any>) => {
  return async (req: any, res: any) => {
    try {
      const targetTableId = req.body?.tableId
      if (!targetTableId) return res.status(400).json({ error: 'tableId is required' })
      const result = await fn(req.params.id, targetTableId)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
router.post('/game-table-skill/:id/copy', copyHandler((id, tid) => gameTableRulesRepo.duplicateGameSkill(id, tid)))
router.post('/game-table-advantage/:id/copy', copyHandler((id, tid) => gameTableRulesRepo.duplicateGameAdvantage(id, tid)))
router.post('/game-table-disadvantage/:id/copy', copyHandler((id, tid) => gameTableRulesRepo.duplicateGameDisadvantage(id, tid)))
router.post('/game-table-item/:id/copy', copyHandler((id, tid) => gameTableRulesRepo.duplicateGameItems(id, tid)))
router.post('/game-table-npc/:id/copy', copyHandler((id, tid) => gameTableRulesRepo.duplicateGameNPC(id, tid)))
router.post('/game-table-character/:id/copy', copyHandler((id, tid) => gameTableRulesRepo.duplicateGameCharacter(id, tid)))
router.post('/table-location/:id/copy', async (req, res) => {
  try {
    const targetTableId = req.body?.tableId
    if (!targetTableId) return res.status(400).json({ error: 'tableId is required' })
    const result = await gameTableRulesRepo.duplicateGameLocation(req.params.id, targetTableId)
    if (result?.id) publishTable(targetTableId, 'location')
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

/* ===== CONTENT MODULES ===== */
router.get('/content-modules', (req, res) => contentModuleController.findCatalog(req, res))
router.post('/content-modules', async (req, res) => {
  if (!(await requireSuperAdmin(req, res))) return
  return contentModuleController.createModule(req, res)
})
router.post('/content-categories', async (req, res) => {
  if (!(await requireSuperAdmin(req, res))) return
  return contentModuleController.createCategory(req, res)
})

router.get('/game-table-skills/:id', (req, res) => gameTableRulesController.findAllSkills(req, res))
router.get('/game-table-skill/:id', (req, res) => gameTableRulesController.findSkill(req, res))
router.post('/game-table-skill', (req, res) => gameTableRulesController.createSkill(req, res))
router.put('/game-table-skill/:id', (req, res) => gameTableRulesController.editSkill(req, res))
router.delete('/game-table-skill/:id', (req, res) => gameTableRulesController.deleteSkill(req, res))

// Relações de skill: `:kind` ∈ {predefinition, dependency}. O controller
// rejeita qualquer outro valor antes de tocar o banco.
router.post('/game-table-skill-relation/:kind', (req, res) => gameTableRulesController.createSkillRelation(req, res))
router.put('/game-table-skill-relation/:kind/:id', (req, res) => gameTableRulesController.editSkillRelation(req, res))
router.delete('/game-table-skill-relation/:kind/:id', (req, res) => gameTableRulesController.deleteSkillRelation(req, res))
router.get('/game-table-advantages/:id', (req, res) => gameTableRulesController.findAllAdvantages(req, res))
router.get('/game-table-advantage/:id', (req, res) => gameTableRulesController.findAdvantage(req, res))
router.post('/game-table-advantage', (req, res) => gameTableRulesController.createAdvantage(req, res))
router.put('/game-table-advantage/:id', (req, res) => gameTableRulesController.editAdvantage(req, res))
router.delete('/game-table-advantage/:id', (req, res) => gameTableRulesController.deleteAdvantage(req, res))
router.get('/game-table-disadvantages/:id', (req, res) => gameTableRulesController.findAllDisadvantages(req, res))
router.get('/game-table-disadvantage/:id', (req, res) => gameTableRulesController.findDisadvantage(req, res))
router.post('/game-table-disadvantage', (req, res) => gameTableRulesController.createDisadvantage(req, res))
router.put('/game-table-disadvantage/:id', (req, res) => gameTableRulesController.editDisadvantage(req, res))
router.delete('/game-table-disadvantage/:id', (req, res) => gameTableRulesController.deleteDisadvantage(req, res))
router.get('/game-table-peculiarities/:id', (req, res) => gameTableRulesController.findAllPeculiarities(req, res))
router.get('/game-table-peculiarity/:id', (req, res) => gameTableRulesController.findPeculiarity(req, res))
router.post('/game-table-peculiarity', (req, res) => gameTableRulesController.createPeculiarity(req, res))
router.put('/game-table-peculiarity', (req, res) => gameTableRulesController.editPeculiarity(req, res))
router.get('/game-table-items/:id', (req, res) => gameTableRulesController.findAllItems(req, res))
router.get('/game-table-item/:id', (req, res) => gameTableRulesController.findItem(req, res))
router.post('/game-table-item', (req, res) => gameTableRulesController.createItem(req, res))
router.put('/game-table-item', (req, res) => gameTableRulesController.editItem(req, res))
router.delete('/game-table-item/:id', (req, res) => gameTableRulesController.deleteItem(req, res))
router.get('/table-location/:id', (req, res) => gameTableRulesController.findLocation(req, res))
/* Só a mesa dona de um local. Existe para o front resolver qual `actor` usar
   antes de ler o local — sem devolver nenhum dado do catálogo. */
router.get('/table-location/:id/table', (req, res) => {
  const tableId = resolveLocationTableId(req.params.id as string)
  if (!tableId) return res.status(404).json({ error: 'Local não encontrado.' })
  return res.json({ tableId })
})
router.get('/game-table-locations/:id', (req, res) => gameTableRulesController.findAllLocations(req, res))
router.post('/table-location', (req, res) => gameTableRulesController.createLocation(req, res))
router.put('/table-location/:id', (req, res) => gameTableRulesController.editLocation(req, res))
router.delete('/table-location/:id', (req, res) => gameTableRulesController.deleteLocation(req, res))
/* Galeria do local: substituir/apagar/ordenar fotos sem reenviar a entidade.
   O PUT da location faz merge campo a campo, mas exige o objeto completo e
   percorre a árvore de hex. Este caminho curto só grava as linhas de
   `location_images` e republica a mesa. */
router.put('/table-location/:id/images', async (req, res) => {
  try {
    await gameTableRulesRepo.editGameLocationImages(req.params.id as string, req.body)
    const tableId = resolveLocationTableId(req.params.id as string)
    if (tableId) publishTable(tableId, 'location')
    res.json({ success: true })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/game-table-locations/default', (req, res) => gameTableRulesController.setDefaultLocation(req, res))

/* ===== LOCATION CONNECTIONS (portas/escadas/portais entre plantas) ===== */
router.get('/table-location/:id/links', async (req, res) => {
  try {
    const links = await gameTableRulesRepo.findLocationConnections(req.params.id)
    res.json({ links })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})
router.post('/table-location/:id/link', async (req, res) => {
  try {
    const self = await gameTableRulesRepo.findGameLocation(req.params.id)
    const tableId = req.body?.tableId ?? self?.table_id ?? null
    const result = await gameTableRulesRepo.createLocationConnection({
      ...req.body,
      tableId,
      from: { ...(req.body?.from ?? {}), id: req.params.id },
    })
    const target = result?.table_id ?? tableId
    if (target) publishTable(target, 'location')
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})
router.put('/table-location-link/:id', async (req, res) => {
  try {
    const result = await gameTableRulesRepo.editLocationConnection(req.params.id, req.body)
    const tableId = result?.table_id ?? (await gameTableRulesRepo.findLocationConnections(req.params.id))[0]?.tableId ?? null
    if (tableId) publishTable(tableId, 'location')
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})
router.delete('/table-location-link/:id', async (req, res) => {
  try {
    const existing = (await gameTableRulesRepo.findLocationConnections(req.params.id))[0]
    const result = await gameTableRulesRepo.deleteLocationConnection(req.params.id)
    if (existing?.tableId) publishTable(existing.tableId, 'location')
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})
router.get('/game-table-npcs/:id', (req, res) => gameTableRulesController.findAllNPCS(req, res))
router.get('/game-table-npc/:id', (req, res) => gameTableRulesController.findNPC(req, res))
router.post('/game-table-npc', (req, res) => gameTableRulesController.createNPC(req, res))
router.put('/game-table-npc', (req, res) => gameTableRulesController.editNPC(req, res))
router.delete('/game-table-npc/:id', (req, res) => gameTableRulesController.deleteNPC(req, res))
router.post('/game-table-character', (req, res) => gameTableRulesController.createCharacter(req, res))
router.put('/game-table-character', (req, res) => gameTableRulesController.editCharacter(req, res))
/* Galeria do personagem (retrato/corpo/galeria) sem reenviar a entidade.
   O PUT de cima grava `user_id`/`table_id` direto do corpo: um PATCH parcial
   (`{ id, images }`) zeraria os dois e desvincularia o personagem da mesa.
   Este caminho só toca `game_table_character_images`. */
router.put('/game-table-character/:id/images', async (req, res) => {
  try {
    await gameTableRulesRepo.editGameCharacterImages(req.params.id as string, req.body)
    res.json({ success: true })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/game-table-character/:id', (req, res) => gameTableRulesController.deleteCharacter(req, res))
router.put('/game-table-character-equipment', (req, res) => gameTableRulesController.editCharacterEquipment(req, res))
router.delete('/game-table-character-equipment', (req, res) => gameTableRulesController.deleteCharacterEquipment(req, res))
router.post('/game-table-character-equipment/transfer', (req, res) => gameTableRulesController.transferCharacterEquipment(req, res))
router.post('/game-table-character-equipment/sell', (req, res) => gameTableRulesController.sellCharacterEquipment(req, res))
router.get('/game-table-character/:id/history', (req, res) => gameTableRulesController.findCharacterHistory(req, res))
router.get('/game-table-character/:id', (req, res) => gameTableRulesController.findCharacter(req, res))
router.get('/game-table-characters/:id', (req, res) => gameTableRulesController.findAllCharacters(req, res))

/* ===== MODIFIERS ===== */
router.get('/game-table-modifiers/:id', (req, res) => gameTableRulesController.findAllModifiers(req, res))
router.get('/game-table-modifier/:id', (req, res) => gameTableRulesController.findModifier(req, res))
  router.post('/game-table-modifier', (req, res) => gameTableRulesController.createModifier(req, res))
  router.put('/game-table-modifier', (req, res) => gameTableRulesController.editModifier(req, res))
  router.delete('/game-table-modifier/:id', (req, res) => gameTableRulesController.deleteModifier(req, res))
router.post('/game-table-item/grant', (req, res) => gameTableRulesController.grantItem(req, res))
router.post('/game-table-character/points', (req, res) => gameTableRulesController.awardPoints(req, res))
// Traços depois que a ficha existe (kind: 'advantage' | 'disadvantage')
router.post('/game-table-character/trait', (req, res) => gameTableRulesController.grantTrait(req, res))
router.delete('/game-table-character/trait', (req, res) => gameTableRulesController.removeTrait(req, res))
// Instância por personagem de um modelo: liga/desliga e sobrescreve
router.post('/game-table-character/modifier', (req, res) => gameTableRulesController.toggleModifier(req, res))
router.post('/game-table-roll-effect', (req, res) => gameTableRulesController.applySkillEffect(req, res))
router.post('/game-table-end-turn', (req, res) => gameTableRulesController.endPlayerTurn(req, res))

/* ===== TABLE SETTINGS ===== */
router.get('/game-table-settings/:id', (req, res) => gameTableRulesController.findTableSettings(req, res))
router.put('/game-table-settings', (req, res) => gameTableRulesController.editTableSettings(req, res))

/* ===== VISIBILITY ===== */
router.get('/game-table-visibility/:id', (req, res) => gameTableRulesController.findAllVisibility(req, res))
router.get('/game-table-visibility-item/:id', (req, res) => gameTableRulesController.findVisibility(req, res))
router.post('/game-table-visibility', (req, res) => gameTableRulesController.createVisibility(req, res))
router.put('/game-table-visibility', (req, res) => gameTableRulesController.editVisibility(req, res))

/* ===== QUEUE ===== */
router.get('/game-table-queue/:id', (req, res) => gameTableRulesController.findAllQueue(req, res))
router.get('/game-table-queue-item/:id', (req, res) => gameTableRulesController.findQueue(req, res))
router.post('/game-table-queue', (req, res) => gameTableRulesController.createQueue(req, res))
router.put('/game-table-queue', (req, res) => gameTableRulesController.editQueue(req, res))

/* ===== TRADE (troca entre jogadores) ===== */
router.post('/game-table-trade', (req, res) => tradeController.create(req, res))
router.get('/game-table-trade/character/:characterId', (req, res) => tradeController.listByCharacter(req, res))
router.get('/game-table-trade/table/:tableId', (req, res) => tradeController.listByTable(req, res))
router.get('/game-table-trade/offer/:id', (req, res) => tradeController.get(req, res))
router.put('/game-table-trade/offer/:id', (req, res) => tradeController.edit(req, res))
router.post('/game-table-trade/offer/:id/confirm', (req, res) => tradeController.confirm(req, res))
router.post('/game-table-trade/offer/:id/reject', (req, res) => tradeController.reject(req, res))
router.post('/game-table-trade/offer/:id/cancel', (req, res) => tradeController.cancel(req, res))

/* ===== LOCATION SHOP (estoque das lojas por local) ===== */
router.get('/game-table-shop/:locationId', (req, res) => locationShopController.find(req, res))
router.post('/game-table-shop/:locationId/items', (req, res) => locationShopController.stock(req, res))
router.post('/game-table-shop/:locationId/items/copy', (req, res) => locationShopController.copy(req, res))
router.put('/game-table-shop/:locationId/items/:itemId', (req, res) => locationShopController.edit(req, res))
router.delete('/game-table-shop/:locationId/items/:itemId', (req, res) => locationShopController.remove(req, res))

export default router