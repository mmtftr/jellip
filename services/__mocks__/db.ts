import { answers, questions, questionSets } from "@/db/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
const Database = require("better-sqlite3");

const dir = require("os").tmpdir();
const dbName = dir + `/test-db${Math.floor(Math.random() * 10000)}.sqlite`;
const sqlite = new Database(dbName);

export const db = drizzle(sqlite);
import { migrate as migrateDb } from "drizzle-orm/better-sqlite3/migrator";
export const migrate = () => {
  migrateDb(db, { migrationsFolder: "./drizzle/" });
};
export const reset = async () => {
  await db.delete(answers).execute();
  await db.delete(questions).execute();
  await db.delete(questionSets).execute();
};
