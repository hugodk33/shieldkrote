import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

/** Tira o traço da ficha. A modificação padrão que ele trazia deixa de valer
    junto, porque a resolução é feita contra o que o personagem possui. */
export class RemoveGameTraitFromCharacterUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(data: any): Promise<any> {
    return this.repo.removeGameTraitFromCharacter(data)
  }
}
