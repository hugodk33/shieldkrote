import { Narrator } from '../../domain/entities/Narrator'

export interface INarratorRepository {
  create(narrator: Narrator): Promise<void>
}
