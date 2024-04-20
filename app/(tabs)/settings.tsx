import { getAnswersToday, QuestionWithAnswers } from "@/services/questions";
import React, { useEffect, useMemo } from "react";
import {
  YStack,
  Heading,
  Text,
  XStack,
  Label,
  useTheme,
  View,
  useMedia,
  Paragraph,
  Button,
} from "tamagui";
import { answersTodayStore, settingsStore } from "@/services/store";
import { SelectBox } from "../../components/SelectBox";
import { PieChart } from "@/components/PieChart";
import { useRouter } from "expo-router";

const LevelFilter = () => {
  const filters = settingsStore((state) => state.data.levelFilter);
  const [val, setVal] = React.useState<QuestionWithAnswers["level"] | "all">(
    filters.length === 0 ? "all" : filters[0]
  );
  const items = [
    { name: "all" },
    { name: "N1" },
    { name: "N2" },
    { name: "N3" },
    { name: "N4" },
    { name: "N5" },
  ];
  const name = "Level Filter";
  useEffect(() => {
    settingsStore.getState().update((state) => {
      if (val === "all") {
        state.levelFilter = [];
        return;
      }
      state.levelFilter = [val];
    });
  }, [val]);

  return (
    <XStack jc="space-between">
      <Label>{name}</Label>
      <SelectBox
        val={val}
        // @ts-ignore
        setVal={setVal}
        name={name}
        items={items}
        placeholder="Level filter..."
        triggerProps={{ width: "50%" }}
      />
    </XStack>
  );
};

const CategoryFilter = () => {
  const filters = settingsStore((state) => state.data.categoryFilter);
  const [val, setVal] = React.useState<QuestionWithAnswers["category"] | "all">(
    filters.length === 0 ? "all" : filters[0]
  );
  const items = [
    { name: "all" },
    { name: "vocabulary" },
    { name: "grammar" },
    { name: "kanji" },
  ];
  const name = "Category Filter";
  useEffect(() => {
    settingsStore.getState().update((state) => {
      if (val === "all") {
        state.categoryFilter = [];
        return;
      }
      state.categoryFilter = [val];
    });
  }, [val]);

  return (
    <XStack jc="space-between">
      <Label>{name}</Label>
      <SelectBox
        val={val}
        // @ts-ignore
        setVal={setVal}
        name={name}
        items={items}
        placeholder="Category filter..."
        triggerProps={{ width: "50%" }}
      />
    </XStack>
  );
};

const SettingsTab: React.FC = () => {
  const theme = useTheme();
  const numberOfQuestionsSolvedToday = answersTodayStore((s) => s.data.val);
  const [answers, setAnswers] = React.useState<
    Awaited<ReturnType<typeof getAnswersToday>>
  >([]);
  useEffect(() => {
    getAnswersToday().then((answers) => {
      answersTodayStore.getState().update((state) => {
        state.val = answers.length;
      });
      setAnswers(answers);
    });
  }, [numberOfQuestionsSolvedToday]);

  const correctCount = useMemo(
    () =>
      answers.filter((s) => s.questions.correctAnswer === s.answers.answer)
        .length,
    [answers]
  );
  const incorrectCount = answers.length - correctCount;
  const router = useRouter();
  return (
    <YStack padding="$8" gap="$4">
      <Heading>Settings</Heading>
      <Text>
        Number of questions solved today: {numberOfQuestionsSolvedToday}
      </Text>
      <CategoryFilter />
      <LevelFilter />
      <Heading>Correct to Incorrect Ratio</Heading>
      <XStack gap="$4">
        <View w="50%" aspectRatio={1}>
          <PieChart
            data={[
              {
                value: correctCount,
                color: theme.green11.get(),
              },
              {
                value: incorrectCount,
                color: theme.red11.get(),
              },
            ]}
          />
        </View>
        <YStack gap="$2">
          <Paragraph>
            Correct: {correctCount} (
            {((correctCount / (answers.length || 1)) * 100).toFixed(2)}%)
          </Paragraph>
          <Paragraph>
            Incorrect: {incorrectCount} (
            {((incorrectCount / (answers.length || 1)) * 100).toFixed(2)}%)
          </Paragraph>
        </YStack>
      </XStack>
      <Button onPress={() => router.push("/review")}>Review</Button>
    </YStack>
  );
};

export default SettingsTab;
