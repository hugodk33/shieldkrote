import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'
import type { ViewerScope } from '../../../domain/services/CharacterVisibility'

export class FindAllTableLocationsUseCase {
  constructor(private repo: IGameTableRulesRepository) {}

  /**
   * `scope` é a visão já resolvida no servidor (narrador sem filtro, ou o
   * personagem de um jogador). Nunca mais derivado de um `viewer` do cliente.
   */
  async execute(id: any, scope?: ViewerScope) {
    return this.repo.findAllGameLocations(id, scope)
  }
}
