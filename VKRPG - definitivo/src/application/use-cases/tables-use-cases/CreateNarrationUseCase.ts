import crypto from 'crypto'
import type { IGameTableRepository } from '../../../domain/irepositories/IGameTableRepository'

export class CreateNarrationUseCase {
  constructor(private repo: IGameTableRepository) {}

  async execute(data: any) {
    const narration = {
      id: crypto.randomUUID(),
      table_id: data.table_id,
      scene_id: data.scene_id,
      title: data.title || '',
      narration: data.narration,
      moment: data.moment ?? 0,
      location_id: data.location_id ?? null,
      present: Array.isArray(data.present) ? data.present : undefined,
      present_npcs: Array.isArray(data.present_npcs) ? data.present_npcs : undefined
    }
    await this.repo.createNarration(narration)
    return narration
  }
}
