const db = require("better-sqlite3")("database.sqlite");
const q = (sql) => { try { return db.prepare(sql).all(); } catch (e) { return "ERR: " + e.message; } };
console.log("--- game_table_players ---");
console.log(q("SELECT * FROM game_table_players"));
console.log("--- characters ---");
console.log(q("SELECT c.id, c.user_id, c.table_id, c.is_active, s.name FROM game_table_characters c LEFT JOIN game_table_character_sheets s ON s.character_id = c.id"));
console.log("--- rafael id ---");
const r = db.prepare("SELECT id FROM users WHERE username = 'Rafael Silva'").get();
console.log(r);
