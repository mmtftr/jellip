import { YStack, Paragraph, XStack } from "tamagui";
import { Question, QuestionWithAnswers } from "../services/questions";
import { Leaf, StarFull, StarOff } from "@tamagui/lucide-icons";
import React from "react";

export function QuestionContent({
  question,
}: {
  question: Question | QuestionWithAnswers | null;
}) {
  return (
    <YStack gap="$2" flexDirection="column-reverse" minHeight="100%">
      <Paragraph
        size="$8"
        marginBottom="$2"
        letterSpacing={3}
        $theme-dark={{ color: "$colorFocus" }}
        selectable
      >
        {question?.question}
      </Paragraph>
      <XStack opacity={0.6} justifyContent="space-between" marginBottom="$2">
        <Paragraph size="$2">
          {question?.category} - {question?.level}
        </Paragraph>
        <XStack gap="$2">
          {question && "userAnswers" in question && (
            <React.Fragment>
              {!question.userAnswers.length && (
                <Leaf size="$1" color="$green9" />
              )}
              {question.userAnswers.slice(-3).map((answer) => {
                const isCorrect = answer.answer === question.correctAnswer;
                if (isCorrect) {
                  return <StarFull key={answer.id} size="$1" color="green" />;
                } else {
                  return <StarOff key={answer.id} size="$1" color="red" />;
                }
              })}
            </React.Fragment>
          )}
        </XStack>
      </XStack>
    </YStack>
  );
}
