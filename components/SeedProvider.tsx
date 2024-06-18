import { db } from "@/services/db"; // drizzle
import { answers, questionSets, questions } from "../db/schema";
import seedVals from "@/constants/seed.json";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
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
      .onConflictDoNothing()
      .execute();

    const allValues = seedVals.questions.filter(
      (question) => !availableQuestionSetIds.has(question.questionSet)
    );

    // insert 1K questions at a time.
    for (let i = 0; i < allValues.length / 1000; i++) {
      await db
        .insert(questions)
        .values(allValues.slice(i * 1000, (i + 1) * 1000) as unknown as any)
        .onConflictDoNothing()
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
  } catch (e) {}
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
  const toast = useToastController();

  useEffect(() => {
    checkShouldSeed()
      .then((isSeedingRequired) => {
        setShouldSeed(isSeedingRequired);
      })
      .catch((err) => {
        toast.show("Database Error", {
          type: "error",
          message: "Failed to detect if database is complete: " + String(err),
        });
      });
  }, []);

  useEffect(() => {
    if (shouldSeed === true) {
      seedNecessarySets()
        .then(() => {
          setShouldSeed(false);
        })
        .catch((err) => {
          setShouldSeed(false);
          toast.show("Database Error", {
            type: "error",
            message:
              "Failed to add missing questions to the database: " + String(err),
          });
        });
    }
  }, [shouldSeed]);

  if (shouldSeed !== false) {
    return <ActivityIndicator />;
  }

  return children;
}
