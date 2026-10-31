import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'
import type { ViewerScope } from '../../../domain/services/CharacterVisibility'

export class FindTableLocationUseCase {
  constructor(private repo: IGameTableRulesRepository) {}

  /** `scope` é a visão já resolvida no servidor (ver FindAllTableLocationsUseCase). */
  async execute(id: any, scope?: ViewerScope) {
    return this.repo.findGameLocation(id, scope)
  }
}
