import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const levels = ["N5", "N4", "N3", "N2", "N1"] as const;
export const categories = [
  "grammar",
  "vocabulary",
  "kanji",
  "unknown",
] as const;
export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  category: text("category", {
    enum: categories,
  })
    .notNull()
    .default("unknown"),
  level: text("level", { enum: levels }).notNull().default("N5"),
  answers: text("answers", { mode: "json" }).$type<string[]>().notNull(),
  correctAnswer: integer("correctAnswer").notNull(),
});

export const answers = sqliteTable("answers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  questionId: integer("questionId")
    .notNull()
    .references(() => questions.id),
  answer: integer("answer").notNull(),
  timestamp: text("date")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
