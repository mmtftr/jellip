import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, blob } from "drizzle-orm/sqlite-core";

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answers: blob("answers").$type<string[]>().notNull(),
});

export const answers = sqliteTable("answers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  questionId: text("questionId")
    .notNull()
    .references(() => questions.id),
  answer: integer("answer").notNull(),
});
