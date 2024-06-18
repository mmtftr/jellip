import { answers, questions } from "@/db/schema";
import { db } from "@/services/db";
import { and, countDistinct, eq, exists, inArray, sql } from "drizzle-orm";
import { canOpenURL, openURL } from "expo-linking";
import { openBrowserAsync } from "expo-web-browser";
import { answersTodayStore } from "./store";

export type Question = typeof questions.$inferSelect;
export type QuestionWithAnswers = typeof questions.$inferSelect & {
  userAnswers: (typeof answers.$inferSelect)[];
};
export type QuestionAnswer = Awaited<ReturnType<typeof getAnswersToday>>[0];

const cache: Record<string, QuestionWithAnswers | null> = {};

const generateKey = ({
  categoryFilter,
  levelFilter,
}: {
  categoryFilter?: QuestionWithAnswers["category"][];
  levelFilter?: QuestionWithAnswers["level"][];
}) => {
  return JSON.stringify({ categoryFilter, levelFilter });
};

const doGetRandomQuestion = async ({
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

const getRandomQuestion = async ({
  categoryFilter,
  levelFilter,
}: {
  categoryFilter?: QuestionWithAnswers["category"][];
  levelFilter?: QuestionWithAnswers["level"][];
} = {}) => {
  setTimeout(() => {
    requestIdleCallback(async () => {
      cache[generateKey({ categoryFilter, levelFilter })] =
        await doGetRandomQuestion({ categoryFilter, levelFilter });
    });
  }, 1000);

  const cachedItem = cache[generateKey({ categoryFilter, levelFilter })];

  if (cachedItem) {
    delete cache[generateKey({ categoryFilter, levelFilter })];
    return cachedItem;
  }

  return doGetRandomQuestion({ categoryFilter, levelFilter });
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

  if (await canOpenURL("shirabelookup://search"))
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

/**
 * Return the statistics of how many questions has been seen at least once
 * in the filtered question list.
 *
 * @param filters { categoryFilter?: QuestionWithAnswers["category"][]; levelFilter?: QuestionWithAnswers["level"][]; } - optional
 */
const getQuestionSeenStats = async ({
  categoryFilter,
  levelFilter,
}: {
  categoryFilter?: QuestionWithAnswers["category"][];
  levelFilter?: QuestionWithAnswers["level"][];
} = {}): Promise<{ seen: number; total: number }> => {
  const [{ seen }] = await db
    .select({
      seen: countDistinct(questions.id),
    })
    .from(questions)
    .where(
      and(
        categoryFilter && inArray(questions.category, categoryFilter),
        levelFilter && inArray(questions.level, levelFilter),
        exists(
          db.select().from(answers).where(eq(answers.questionId, questions.id))
        )
      )
    );

  const [{ total }] = await db
    .select({ total: countDistinct(questions.id) })
    .from(questions)
    .where(
      and(
        categoryFilter && inArray(questions.category, categoryFilter),
        levelFilter && inArray(questions.level, levelFilter)
      )
    );

  return { seen, total };
};

export {
  getAnswers,
  getAnswersToday,
  getQuestionSeenStats,
  getRandomQuestion,
  lookupAnswer,
  lookupQuestion,
  submitAnswer,
};
