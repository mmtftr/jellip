import { db } from "@/services/db"; // drizzle
import {
  answers,
  categories,
  levels,
  questionSets,
  questions,
} from "../db/schema";
import seedVals from "@/constants/seed.json";
import { useEffect, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { getRandomQuestion } from "../services/questions";
import { useToastController } from "@tamagui/toast";

const seedNecessarySets = async () => {
  try {
    const availableQuestionSetIds = new Set(
      (
        await db
          .selectDistinct({ id: questions.questionSet })
          .from(questions)
          .execute()
      ).map((set) => set.id)
    );

    await db
      .insert(questionSets)
      .values(
        seedVals.questionSets.filter(
          (set) => !availableQuestionSetIds.has(set.id)
        )
      )
      .execute();

    const allValues = seedVals.questions.filter(
      (question) => !availableQuestionSetIds.has(question.questionSet)
    );

    // insert 1K questions at a time.
    for (let i = 0; i < allValues.length / 1000; i++) {
      await db
        .insert(questions)
        .values(allValues.slice(i * 1000, (i + 1) * 1000) as unknown as any)
        .execute();
    }
  } catch (e) {
    console.error(e);
  }
};

export const resetAndReseed = async () => {
  try {
    const answerObjects = await db.delete(answers).returning().execute();
    await db.delete(questions).execute();
    await db.delete(questionSets).execute();
    await seedNecessarySets();

    // try to restore answers
    await db.insert(answers).values(answerObjects).execute();
  } catch (e) {
    console.error(e);
  }
};

export const checkShouldSeed = async () => {
  const availableQuestionSetIds = new Set(
    (
      await db
        .selectDistinct({ id: questions.questionSet })
        .from(questions)
        .execute()
    ).map((set) => set.id)
  );

  if (
    seedVals.questionSets.some((set) => !availableQuestionSetIds.has(set.id))
  ) {
    return true;
  }
  return false;
};

export default function SeedProvider({ children }: React.PropsWithChildren) {
  const [shouldSeed, setShouldSeed] = useState<boolean | null>(null);
  const seeded = useAsyncStorage("seeded");

  useEffect(() => {
    checkShouldSeed().then((isSeedingRequired) => {
      setShouldSeed(isSeedingRequired);
    });
  }, []);

  useEffect(() => {
    if (shouldSeed === true) {
      seedNecessarySets().then(() => {
        seeded.setItem("true");
        setShouldSeed(false);
      });
    }
  }, [shouldSeed]);
  if (shouldSeed !== false) {
    return <ActivityIndicator />;
  }

  return children;
}
