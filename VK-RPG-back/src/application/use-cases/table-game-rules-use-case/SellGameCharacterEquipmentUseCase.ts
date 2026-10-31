import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class SellGameCharacterEquipmentUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any): Promise<any> {
    return this.repo.sellGameCharacterEquipment(data)
  }
}