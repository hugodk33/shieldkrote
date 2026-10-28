const D = require("better-sqlite3");
const db = new D(process.argv[2]);
const q = process.argv[3];
console.log(JSON.stringify(db.prepare(q).all(), null, 2));
