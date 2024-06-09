import { drizzle } from "drizzle-orm/better-sqlite3";
const Database = require("better-sqlite3");

const dir = require("os").tmpdir();
const dbName = dir + `/test-db${Math.floor(Math.random() * 10000)}.sqlite`;
const sqlite = new Database(dbName);

export const db = drizzle(sqlite);

console.log(dbName);
