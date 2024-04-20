import { db } from "@/services/db";
import { answers, questions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { openBrowserAsync } from "expo-web-browser";
import { canOpenURL, openURL } from "expo-linking";

export type QuestionWithAnswers = typeof questions.$inferSelect & {
  userAnswers: (typeof answers.$inferSelect)[];
};
const getRandomQuestion = async (): Promise<QuestionWithAnswers | null> => {
  const question =
    (
      await db
        .select()
        .from(questions)
        .orderBy(sql`random()`)
        .limit(1)
    )[0] || null;

  if (!question) return null;

  const answers = await getAnswers(question.id);

  return { ...question, userAnswers: answers };
};

const getAnswers = async (questionId: number) => {
  return db.select().from(answers).where(eq(answers.questionId, questionId));
};

const submitAnswer = async (questionId: number, answerIdx: number) => {
  return db.insert(answers).values({ questionId, answer: answerIdx });
};

const lookupQuestion = async (question: QuestionWithAnswers) => {
  const lookupStr =
    (question?.question || "") + (question?.answers.join(" ") || "");

  if (__DEV__ || (await canOpenURL("shirabelookup://search")))
    return await openURL(
      `shirabelookup://search?w=${encodeURIComponent(lookupStr)}`,
    );

  // fallback to Jisho
  openBrowserAsync(`https://jisho.org/search/${encodeURIComponent(lookupStr)}`);
};

const lookupAnswer = async (answer: string) => {
  openBrowserAsync(
    `https://www.google.com/search?q=${encodeURIComponent(
      (answer || "") + " 文法",
    )}`,
  );
};

export {
  getRandomQuestion,
  getAnswers,
  submitAnswer,
  lookupAnswer,
  lookupQuestion,
};
