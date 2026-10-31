import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

/** Liga/desliga um modelo de modificação para um personagem só — a instância
    que herda os valores do catálogo e pode ser ajustada sem afetar os outros. */
export class ToggleGameModifierForCharacterUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any): Promise<any> {
    return this.repo.toggleGameModifierForCharacter(data)
  }
}
