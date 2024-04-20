import { db } from "@/services/db";
import { answers, questions } from "@/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { openBrowserAsync } from "expo-web-browser";
import { canOpenURL, openURL } from "expo-linking";
import { answersTodayStore } from "./store";

export type Question = typeof questions.$inferSelect;
export type QuestionWithAnswers = typeof questions.$inferSelect & {
  userAnswers: (typeof answers.$inferSelect)[];
};
const getRandomQuestion = async ({
  categoryFilter,
  levelFilter,
}: {
  categoryFilter?: QuestionWithAnswers["category"][];
  levelFilter?: QuestionWithAnswers["level"][];
} = {}): Promise<QuestionWithAnswers | null> => {
  const question =
    (
      await db
        .select()
        .from(questions)
        .where(
          and(
            categoryFilter && inArray(questions.category, categoryFilter),
            levelFilter && inArray(questions.level, levelFilter)
          )
        )
        .orderBy(sql`random()`)
        .limit(1)
    )[0] || null;

  if (!question) return null;

  const answers = await getAnswers(question.id);

  return { ...question, userAnswers: answers };
};

const getAnswersToday = async () => {
  return db
    .select()
    .from(answers)
    .innerJoin(questions, eq(answers.questionId, questions.id))
    .where(eq(sql`date(${answers.timestamp})`, sql`date(current_timestamp)`));
};

const getAnswers = async (questionId: number) => {
  return db.select().from(answers).where(eq(answers.questionId, questionId));
};

const submitAnswer = async (questionId: number, answerIdx: number) => {
  answersTodayStore.getState().update((state) => state.val++);

  return db.insert(answers).values({ questionId, answer: answerIdx });
};

const lookupQuestion = async (question: Question) => {
  const lookupStr =
    (question?.question || "") + (question?.answers.join(" ") || "");

  if (__DEV__ || (await canOpenURL("shirabelookup://search")))
    return await openURL(
      `shirabelookup://search?w=${encodeURIComponent(lookupStr)}`
    );

  // fallback to Jisho
  openBrowserAsync(`https://jisho.org/search/${encodeURIComponent(lookupStr)}`);
};

const lookupAnswer = async (answer: string) => {
  openBrowserAsync(
    `https://www.google.com/search?q=${encodeURIComponent(
      (answer || "") + " 文法"
    )}`
  );
};

export {
  getRandomQuestion,
  getAnswersToday,
  getAnswers,
  submitAnswer,
  lookupAnswer,
  lookupQuestion,
};
