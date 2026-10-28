import { db } from '../../infra/database/database'
import type { IUserRepository } from '../irepositories/IUserRepository'
import { User } from '../entities/User'

// export class SqliteUserRepository implements any {
//   async create(user: User): Promise<void> {
//     db.prepare(`
//       INSERT INTO users (id, type, username, password, phone, email)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `).run(
//       user.id,
//       user.type,
//       user.username,
//       user.password,
//       user.phone,
//       user.email
//     )
//   }

//   async findAll(): Promise<User[]> {
//     const rows = db.prepare(`SELECT * FROM users`).all() as any[]

//     return rows.map((row) =>
//       new User(row.id, row.type, row.username, row.password, row.phone, row.email)
//     )
//   }

//   async findByEmail(email: string): Promise<User | null> {
//     const row = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) as any

//     if (!row) return null

//     return new User(
//       row.id,
//       row.type,
//       row.username,
//       row.password,
//       row.phone,
//       row.email
//     )
//   }
// }