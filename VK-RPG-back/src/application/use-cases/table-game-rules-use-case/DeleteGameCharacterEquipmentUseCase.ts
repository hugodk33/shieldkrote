import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class DeleteGameCharacterEquipmentUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any): Promise<any> {
    return this.repo.deleteGameCharacterEquipment(data)
  }
}