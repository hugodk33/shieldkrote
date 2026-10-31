import { db } from '../../infra/database/database'
import type { INarratorRepository } from '../irepositories/INarratorRepository'
import { Narrator } from '../entities/Narrator'

export class NarratorRepository implements INarratorRepository {
  async create(narrator: Narrator): Promise<void> {
    db.prepare(`
      INSERT INTO narrators (id, user_id, name)
      VALUES (?, ?, ?)
    `).run(narrator.id, narrator.userId, narrator.name)
  }
}
