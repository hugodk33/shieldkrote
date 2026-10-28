import crypto from 'crypto'
import type { IGameTableRepository } from '../../../domain/irepositories/IGameTableRepository'

export class CreateNarrationActionUseCase {
  constructor(private repo: IGameTableRepository) {}

  async execute(data: any) {
    const action = {
      id: crypto.randomUUID(),
      narrations_id: data.narrations_id,
      queue: data.queue ?? 0,
      moment: data.moment ?? null,
      result: data.result ?? null,
      dice_roll: data.dice_roll ?? null,
      modificator: data.modificator ?? null,
      target: data.target ?? null,
      multitarget: data.multitarget ?? false,
      description: data.description ?? null,
      character_id: data.character_id ?? null,
      location_id: data.location_id ?? null,
      q: data.q ?? null,
      r: data.r ?? null,
      facing: data.facing ?? 0
    }
    await this.repo.createNarrationAction(action)
    return action
  }
}
