import { QuestionContent } from "@/components/QuestionContent";
import { QuestionView } from "@/components/QuestionView";
import { getAnswersToday } from "@/services/questions";
import {
  ArrowBigLeftDash,
  ChevronsLeft,
  ChevronsRight,
  MoveLeft,
  MoveRight,
} from "@tamagui/lucide-icons";
import React, { useState, useEffect } from "react";
import { YStack, Heading, Paragraph, Button, XStack } from "tamagui";

export default function Review() {
  const [answers, setAnswers] = useState<
    Awaited<ReturnType<typeof getAnswersToday>>
  >([]);

  useEffect(() => {
    getAnswersToday().then((answers) => {
      setAnswers(answers);
    });
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const setCurrentIndexBounded = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(answers.length - 1, index)));
  };

  return (
    <YStack padding="$8" gap="$4" f={1}>
      <Heading>Review</Heading>
      <Paragraph>Number of questions solved today: {answers.length}</Paragraph>
      <YStack flex={1}>
        <QuestionView
          question={answers[currentIndex]?.questions}
          answer={answers[currentIndex]?.answers.answer}
          handleAnswer={async () => {}}
          noMargin
          noNext
        />
        <YStack f={1} gap="$2">
          <XStack gap="$2" als="center">
            <Button
              animation="medium"
              icon={ChevronsLeft}
              disabledStyle={{ opacity: 0.6 }}
              disabled={currentIndex === 0}
              onPress={() => setCurrentIndexBounded(0)}
            />
            <Button
              animation="medium"
              icon={MoveLeft}
              disabled={currentIndex === 0}
              disabledStyle={{ opacity: 0.6 }}
              onPress={() => setCurrentIndexBounded(currentIndex - 1)}
            />
            <Button
              animation="medium"
              icon={MoveRight}
              disabledStyle={{ opacity: 0.6 }}
              disabled={currentIndex === answers.length - 1}
              onPress={() => setCurrentIndexBounded(currentIndex + 1)}
            />
            <Button
              animation="medium"
              icon={ChevronsRight}
              disabledStyle={{ opacity: 0.6 }}
              disabled={currentIndex === answers.length - 1}
              onPress={() => setCurrentIndexBounded(answers.length - 1)}
            />
          </XStack>
          <Paragraph textAlign="center" opacity={0.6} color="$accentColor">
            {currentIndex + 1}/{answers.length}
          </Paragraph>
        </YStack>
      </YStack>
    </YStack>
  );
}
