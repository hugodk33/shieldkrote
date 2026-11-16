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

  async findByUserId(userId: string): Promise<Narrator | null> {
    const row = db.prepare(`
      SELECT id, user_id, name FROM narrators WHERE user_id = ? LIMIT 1
    `).get(userId) as any

    if (!row) return null

    return new Narrator(row.id, row.user_id, row.name ?? '')
  }
}
