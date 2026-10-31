import crypto from 'crypto'
import type { IGameTableRepository } from '../../../domain/irepositories/IGameTableRepository'

export class CreateSceneUseCase {
  constructor(private repo: IGameTableRepository) {}

  async execute(data: any) {
    const scene = {
      id: crypto.randomUUID(),
      table_id: data.table_id,
      title: data.title,
      chapter: data.chapter ?? 1,
      moment: data.moment ?? 0,
      image_url: data.imageUrl ?? data.image_url ?? null
    }
    await this.repo.createScene(scene)
    return scene
  }
}
