import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

/** Registra um traço (vantagem/desvantagem) numa ficha que já existe. Como a
    modificação padrão é resolvida na leitura, não há nada a materializar aqui:
    o efeito entra na ficha no mesmo instante em que o traço é gravado. */
export class GrantGameTraitToCharacterUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any): Promise<any> {
    return this.repo.grantGameTraitToCharacter(data)
  }
}
