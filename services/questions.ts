import { db } from "@/services/db";
import { answers, questions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const getRandomQuestion = async () => {
  return (
    (
      await db
        .select()
        .from(questions)
        .orderBy(sql`random()`)
        .limit(1)
    )[0] || null
  );
};

const getAnswers = async (questionId: number) => {
  return db.select().from(answers).where(eq(answers.questionId, questionId));
};

const submitAnswer = async (questionId: number, answerIdx: number) => {
  return db.insert(answers).values({ questionId, answer: answerIdx });
};

export { getRandomQuestion, getAnswers, submitAnswer };
