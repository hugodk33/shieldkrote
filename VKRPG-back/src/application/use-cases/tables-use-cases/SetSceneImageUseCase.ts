import type { IGameTableRepository } from '../../../domain/irepositories/IGameTableRepository'

export class SetSceneImageUseCase {
  constructor(private repo: IGameTableRepository) {}

  /** Define (ou remove, com null) a imagem única de uma cena. Devolve o
      table_id da cena para o realtime invalidar a timeline aberta. */
  async execute(id: string, imageUrl: string | null): Promise<string | null> {
    const url = typeof imageUrl === 'string' && imageUrl.trim() ? imageUrl.trim() : null
    await this.repo.setSceneImage(id, url)
    return this.repo.getSceneTableId(id)
  }
}
