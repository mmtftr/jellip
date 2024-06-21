import { Statistics } from "@/components/Statistics";
import {
  getAnswersToday,
  getQuestionSeenStats,
  Question,
  QuestionAnswer,
  QuestionWithAnswers,
} from "@/services/questions";
import { answersTodayStore, settingsStore } from "@/services/store";
import React, { useEffect } from "react";
import {
  H5,
  Heading,
  Label,
  ScrollView,
  Separator,
  Switch,
  XStack,
  YStack,
} from "tamagui";
import { MultipleSelectBox } from "../../components/SelectBox";

const levelItems: { name: Question["level"] }[] = [
  { name: "N1" },
  { name: "N2" },
  { name: "N3" },
  { name: "N4" },
  { name: "N5" },
];
const LevelFilter = ({
  settingKey: settingsKey,
}: {
  settingKey: "questionLevelFilter" | "grammarLevelFilter";
}) => {
  const filters = settingsStore((state) => state.data[settingsKey]);
  const [val, setVal] = React.useState<QuestionWithAnswers["level"][]>(
    filters || []
  );
  const name = "Level Filter";
  useEffect(() => {
    settingsStore.getState().update((state) => {
      state[settingsKey] = val;
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

  const {
    categoryFilter,
    questionLevelFilter: levelFilter,
    furiEnabled,
  } = settingsStore((state) => state.data);

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
        <H5>Helpers</H5>
        <XStack width={200} alignItems="center" gap="$4">
          <Label paddingRight="$0" justifyContent="flex-end">
            Enable furigana
            {"\n"}
            <Label size="$1">*experimental</Label>
          </Label>
          <Separator minHeight={20} vertical />
          <Switch
            checked={furiEnabled}
            onCheckedChange={(s) =>
              settingsStore
                .getState()
                .update((state) => (state.furiEnabled = s))
            }
          >
            <Switch.Thumb animation="fast" />
          </Switch>
        </XStack>

        <YStack gap="$2">
          <H5>Question Filters</H5>
          <CategoryFilter />
          <LevelFilter settingKey="questionLevelFilter" />
        </YStack>
        <YStack gap="$2">
          <H5>Grammar Filters</H5>
          <LevelFilter settingKey="grammarLevelFilter" />
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
