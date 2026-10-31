import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class AwardGameCharacterPointsUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any): Promise<any> {
    return this.repo.awardGameCharacterPoints(data)
  }
}