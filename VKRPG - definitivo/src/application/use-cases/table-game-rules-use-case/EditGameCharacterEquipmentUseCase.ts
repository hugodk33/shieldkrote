import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class EditGameCharacterEquipmentUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any): Promise<any> {
    return this.repo.editGameCharacterEquipment(data)
  }
}