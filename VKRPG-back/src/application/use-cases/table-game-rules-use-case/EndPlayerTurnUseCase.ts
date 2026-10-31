import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EndPlayerTurnUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any) {
    return await this.repo.endPlayerTurn(data)
  }
}