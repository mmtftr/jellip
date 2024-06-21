import { settingsStore } from "@/services/store";
import { Leaf, StarFull, StarOff } from "@tamagui/lucide-icons";
import React from "react";
import { AnimatePresence, Paragraph, View, XStack, YStack } from "tamagui";
import { Question, QuestionWithAnswers } from "../services/questions";
import { JapaneseText } from "./JapaneseText";

const test = false;
export function QuestionContent({
  question,
  answer,
}: {
  question: Question | QuestionWithAnswers | null;
  answer?: number | null;
}) {
  const furi = settingsStore((s) => s.data.furiEnabled);
  return (
    <YStack gap="$2" flexDirection="column-reverse" minHeight="100%">
      {furi ? (
        <JapaneseText
          text={question?.question ?? ""}
          textProps={{
            "$theme-dark": { color: "$colorFocus" },
            letterSpacing: 3,
            selectable: true,
          }}
          containerStyle={{
            rowGap: 3,
          }}
          size="$8"
        />
      ) : (
        <Paragraph
          size="$8"
          marginBottom="$2"
          letterSpacing={3}
          $theme-dark={{ color: "$colorFocus" }}
          selectable
        >
          {question?.question}
        </Paragraph>
      )}
      <XStack opacity={0.6} justifyContent="space-between" marginBottom="$2">
        <Paragraph size="$2">
          {question?.category} - {question?.level}
        </Paragraph>
        <XStack gap="$2">
          {question && "userAnswers" in question && (
            <React.Fragment>
              {!question.userAnswers.length &&
                !(typeof answer === "number") && (
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
              <AnimatePresence>
                {typeof answer === "number" &&
                  answer !== question.correctAnswer && (
                    <View
                      key={question.correctAnswer}
                      enterStyle={{ scale: 0 }}
                    >
                      <StarOff size="$1" color="red" />
                    </View>
                  )}
                {typeof answer === "number" &&
                  answer === question.correctAnswer && (
                    <View
                      key={question.correctAnswer}
                      enterStyle={{ scale: 0 }}
                    >
                      <StarFull size="$1" color="green" />
                    </View>
                  )}
              </AnimatePresence>
            </React.Fragment>
          )}
        </XStack>
      </XStack>
    </YStack>
  );
}
