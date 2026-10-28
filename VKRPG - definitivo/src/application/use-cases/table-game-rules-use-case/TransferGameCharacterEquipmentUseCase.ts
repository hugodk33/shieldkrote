import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class TransferGameCharacterEquipmentUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any): Promise<any> {
    return this.repo.transferGameCharacterEquipment(data)
  }
}