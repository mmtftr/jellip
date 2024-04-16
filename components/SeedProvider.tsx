import { db } from "@/services/db"; // drizzle
import { answers, questions } from "../db/schema";
import seedVals from "@/constants/seed.json";
import { useEffect, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";

const seed = async () => {
  try {
    await db
      .insert(questions)
      .values(
        seedVals.questions.map(
          ({ questionText: question, answers, correctAnswer }) => ({
            question,
            answers,
            correctAnswer,
          }),
        ),
      )
      .execute();
  } catch (e) {
    console.error(e);
  }
};
export const resetAndReseed = async () => {
  try {
    await db.delete(answers).execute();
    await db.delete(questions).execute();
    await seed();
  } catch (e) {
    console.error(e);
  }
};

export default function SeedProvider({ children }: React.PropsWithChildren) {
  const [shouldSeed, setShouldSeed] = useState<boolean | null>(null);
  const seeded = useAsyncStorage("seeded");

  useEffect(() => {
    seeded.getItem().then((val) => {
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
