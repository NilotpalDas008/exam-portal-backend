const Database = require("better-sqlite3");
const path = require("path");

const dbPath = process.env.DB_PATH
	? path.resolve(process.env.DB_PATH)
	: path.join(__dirname, "../../db/exam_portal.db");

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

module.exports = db;
