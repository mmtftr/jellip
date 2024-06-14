import {
  getQuestionSeenStats,
  Question,
  QuestionAnswer,
  QuestionWithAnswers,
} from "@/services/questions";
import { router } from "expo-router";
import React from "react";
import { PieChart } from "@/components/PieChart";
import {
  YStack,
  Text,
  useTheme,
  Button,
  Paragraph,
  View,
  XStack,
} from "tamagui";

type StatisticsProps = {
  numberOfQuestionsSolvedToday: number;
  answers: QuestionAnswer[];
  seenStats: Awaited<ReturnType<typeof getQuestionSeenStats>> | null;
};

export const Statistics: React.FC<StatisticsProps> = ({
  numberOfQuestionsSolvedToday,
  answers,
  seenStats,
}) => {
  const theme = useTheme();
  const correctCount = answers.filter(
    (s) => s.questions.correctAnswer === s.answers.answer
  ).length;
  const incorrectCount = answers.length - correctCount;

  return (
    <>
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
          {seenStats && (
            <>
              <Text>
                Number of questions you've seen in this category:{" "}
                {seenStats.seen}
              </Text>
              <XStack gap="$4">
                <View w="50%" aspectRatio={1}>
                  <PieChart
                    data={[
                      {
                        value: seenStats.seen,
                        color: theme.blue11.get(),
                      },
                      {
                        value: seenStats.total - seenStats.seen,
                        color: theme.gray10.get(),
                      },
                    ]}
                  />
                </View>
                <YStack gap="$2">
                  <Paragraph>
                    Seen: {seenStats.seen} (
                    {((seenStats.seen / (seenStats.total || 1)) * 100).toFixed(
                      2
                    )}
                    %)
                  </Paragraph>
                  <Paragraph>
                    Not yet seen: {seenStats.total - seenStats.seen} (
                    {(
                      ((seenStats.total - seenStats.seen) /
                        (seenStats.total || 1)) *
                      100
                    ).toFixed(2)}
                    %)
                  </Paragraph>
                </YStack>
              </XStack>
            </>
          )}
          <Button onPress={() => router.push("/review")}>Review</Button>
        </YStack>
      )}
    </>
  );
};
