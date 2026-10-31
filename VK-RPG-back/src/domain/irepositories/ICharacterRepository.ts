import { Character } from '../../domain/entities/Character'

export interface ICharacterRepository {
  create(character: Character): Promise<void>
}