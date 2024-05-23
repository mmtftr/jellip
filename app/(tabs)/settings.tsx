import {
  getAnswersToday,
  Question,
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
} from "tamagui";
import { answersTodayStore, settingsStore } from "@/services/store";
import { MultipleSelectBox, SelectBox } from "../../components/SelectBox";
import { PieChart } from "@/components/PieChart";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { resetAndReseed } from "../../components/SeedProvider";
import { Delete } from "@tamagui/lucide-icons";

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
    [answers],
  );
  const incorrectCount = answers.length - correctCount;
  const router = useRouter();
  return (
    <YStack padding="$8" gap="$4">
      <Heading>Settings</Heading>
      <YStack gap="$2">
        <CategoryFilter />
        <LevelFilter />
      </YStack>
      <Heading>Statistics</Heading>
      <Text>
        Number of questions solved today: {numberOfQuestionsSolvedToday}
      </Text>
      {numberOfQuestionsSolvedToday > 0 && (
        <YStack gap="$4">
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
      )}
      <Button
        marginEnd="$2"
        icon={Delete}
        variant="outlined"
        color="red"
        theme="red_active"
        size="$2"
        onPress={() => {
          Alert.alert("Are You Sure?", "This may delete some questions", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Reset",
              onPress: () => {
                resetAndReseed();
              },
            },
          ]);
        }}
      >
        Reset Questions
      </Button>
    </YStack>
  );
};

export default SettingsTab;
