import {
  getAnswersToday,
  getQuestionSeenStats,
  Question,
  QuestionAnswer,
  QuestionWithAnswers,
} from "@/services/questions";
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
  ScrollView,
} from "tamagui";
import { answersTodayStore, settingsStore } from "@/services/store";
import { MultipleSelectBox, SelectBox } from "../../components/SelectBox";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { resetAndReseed } from "../../components/SeedProvider";
import { Delete } from "@tamagui/lucide-icons";
import { Statistics } from "@/components/Statistics";

const levelItems: { name: Question["level"] }[] = [
  { name: "N1" },
  { name: "N2" },
  { name: "N3" },
  { name: "N4" },
  { name: "N5" },
];
const LevelFilter = () => {
  const filters = settingsStore((state) => state.data.levelFilter);
  const [val, setVal] = React.useState<QuestionWithAnswers["level"][]>(filters);
  const name = "Level Filter";
  useEffect(() => {
    settingsStore.getState().update((state) => {
      state.levelFilter = val;
    });
  }, [val]);

  return (
    <XStack ai="center" jc="space-between">
      <Label>{name}</Label>
      <MultipleSelectBox
        val={val}
        setVal={setVal}
        name={name}
        items={levelItems}
        placeholder="All levels"
        triggerProps={{ width: "50%" }}
      />
    </XStack>
  );
};

const categoryItems: { name: Question["category"] }[] = [
  { name: "vocabulary" },
  { name: "grammar" },
  { name: "kanji" },
];
const CategoryFilter = () => {
  const filters = settingsStore((state) => state.data.categoryFilter);
  const [val, setVal] =
    React.useState<QuestionWithAnswers["category"][]>(filters);
  const name = "Category Filter";
  useEffect(() => {
    settingsStore.getState().update((state) => {
      state.categoryFilter = val;
    });
  }, [val]);

  return (
    <XStack ai="center" jc="space-between">
      <Label>{name}</Label>
      <MultipleSelectBox
        val={val}
        setVal={setVal}
        name={name}
        items={categoryItems}
        placeholder="All categories"
        triggerProps={{ width: "50%" }}
      />
    </XStack>
  );
};

const SettingsTab: React.FC = () => {
  const numberOfAnswersToday = answersTodayStore((s) => s.data.val);
  const [answers, setAnswers] = React.useState<QuestionAnswer[]>([]);
  useEffect(() => {
    getAnswersToday().then((answers) => {
      answersTodayStore.getState().update((state) => {
        state.val = answers.length;
      });
      setAnswers(answers);
    });
  }, [numberOfAnswersToday]);

  const [seenStats, setSeenStats] =
    React.useState<Awaited<ReturnType<typeof getQuestionSeenStats> | null>>(
      null
    );

  const { categoryFilter, levelFilter } = settingsStore((state) => state.data);

  useEffect(() => {
    getQuestionSeenStats({
      categoryFilter: categoryFilter.length ? categoryFilter : undefined,
      levelFilter: levelFilter.length ? levelFilter : undefined,
    }).then((seenStats) => {
      setSeenStats(seenStats);
    });
  }, [numberOfAnswersToday, categoryFilter, levelFilter]);

  return (
    <ScrollView>
      <YStack padding="$8" gap="$4">
        <Heading>Settings</Heading>
        <YStack gap="$2">
          <CategoryFilter />
          <LevelFilter />
        </YStack>
        <Heading>Statistics</Heading>
        <Statistics
          numberOfQuestionsSolvedToday={numberOfAnswersToday}
          answers={answers}
          seenStats={seenStats}
        />
      </YStack>
    </ScrollView>
  );
};

export default SettingsTab;
