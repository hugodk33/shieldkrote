import { Request , Response } from 'express'
import { CreateUserUseCase } from '../../application/use-cases/users-use-cases/CreateUserUseCase'
import { FindAllUsersUseCase } from '../../application/use-cases/users-use-cases/FindAllUsersUseCase'
import { FindUserByIdUseCase } from '../../application/use-cases/users-use-cases/FindUserByIdUseCase'
import { FindByStringUserUseCase } from '../../application/use-cases/tables-use-cases/FindByStringGameTableUseCase'
import { EditUsersUseCase } from '../../application/use-cases/users-use-cases/EditUsersUseCase'
import { AuthenticateUserUseCase } from '../../application/use-cases/users-use-cases/AuthenticateUserUseCase'
import { FindUserTablesUseCase } from '../../application/use-cases/users-use-cases/FindUserTablesUseCase'

export class UserController {
  constructor(
    private useCase: CreateUserUseCase ,
    private findAllUsersUseCase: FindAllUsersUseCase,
    private findUserByIdUseCase: FindUserByIdUseCase,
    private findByStringUserUseCase: FindByStringUserUseCase,
    private editUsersUseCase: EditUsersUseCase,
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private findUserTablesUseCase: FindUserTablesUseCase
  ) {}

  async create(req: Request, res: Response) {
    const user = await this.useCase.execute(req.body)
    return res.json(user)
  }

  async login(req: Request, res: Response) {
    try {
      const user = await this.authenticateUserUseCase.execute(req.body ?? {})
      if (!user) return res.status(401).json({ error: 'Usuário ou senha inválidos.' })
      return res.json(user)
    } catch (error: any) {
      return res.status(500).json({ error: error?.message ?? 'Falha ao autenticar.' })
    }
  }

  async tables(req: Request, res: Response) {
    try {
      const result = await this.findUserTablesUseCase.execute(req.params.id as string)
      if (!result) return res.status(404).json({ error: 'User not found' })
      return res.json(result)
    } catch (error: any) {
      return res.status(500).json({ error: error?.message ?? 'Falha ao carregar as mesas.' })
    }
  }

  async findAll(req: Request, res: Response) {
    const users = await this.findAllUsersUseCase.execute()
    return res.json(users)
  }

  async findById(req: Request, res: Response) {
    const user = await this.findUserByIdUseCase.execute(req.params.id as string)
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.json(user)
  }

  async findByString(req: Request, res: Response) {
    const { searchTerm } = req.params  
    const user = await this.findByStringUserUseCase.execute({ searchTerm })
    return res.json(user)
  }

  async editUser(req: Request, res: Response) {
    const { id } = req.params
    const user = await this.editUsersUseCase.execute({ ...req.body, id })
    return res.json(user)
  }

}
