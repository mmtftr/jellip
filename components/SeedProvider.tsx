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

const seed = async () => {
  try {
    const allValues = seedVals.questions.map(
      ({
        id,
        questionText: question,
        answers,
        correctAnswer,
        level,
        category,
        questionSet,
      }) => ({
        id,
        question,
        answers,
        category: categories.includes(category as any)
          ? (category as any)
          : "unknown",
        level: levels.includes(level as any) ? (level as any) : "N5",
        correctAnswer,
        questionSet,
      }),
    );
    console.log("Seeding database...");
    await db.insert(questionSets).values(seedVals.questionSets).execute();

    // insert 1K questions at a time.
    for (let i = 0; i < allValues.length / 1000; i++) {
      await db
        .insert(questions)
        .values(allValues.slice(i * 1000, (i + 1) * 1000))
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
    await seed();

    // try to restore answers
    await db.insert(answers).values(answerObjects).execute();
  } catch (e) {
    console.error(e);
  }
};

export default function SeedProvider({ children }: React.PropsWithChildren) {
  const [shouldSeed, setShouldSeed] = useState<boolean | null>(null);
  const seeded = useAsyncStorage("seeded");

  useEffect(() => {
    Promise.all([getRandomQuestion(), seeded.getItem()]).then(([q, val]) => {
      if (!q) return setShouldSeed(true);

      setShouldSeed(val === "true" ? false : true);
    });
  }, []);

  useEffect(() => {
    if (shouldSeed === true) {
      seed().then(() => {
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
