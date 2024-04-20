import { YStack, XStack, View, ScrollView, Button } from "tamagui";
import { useState } from "react";
import {
  Question,
  QuestionWithAnswers,
  lookupAnswer,
  lookupQuestion,
} from "@/services/questions";
import { AnswerButton } from "@/components/AnswerButton";
import { QuestionContent } from "@/components/QuestionContent";
import { BookOpen, Search } from "@tamagui/lucide-icons";
import * as WebBrowser from "expo-web-browser";

export function QuestionView({
  question,
  answer,
  handleAnswer,
  noMargin = false,
}: {
  question: Question | QuestionWithAnswers | null;
  answer: number | null;
  handleAnswer: (answerId: number) => Promise<void>;
  noMargin?: boolean;
}) {
  const [layout, setLayout] = useState({
    questionY: 500, // give an initial height to avoid flashing
    containerY: 0,
    paragraphHeight: 0,
  });

  return (
    <YStack
      onLayout={(e) => {
        const y = e.nativeEvent.layout.y;
        setLayout((l) => ({ ...l, containerY: y }));
      }}
      flexGrow={1}
      justifyContent="flex-end"
      gap="$4"
    >
      <View
        overflow="visible"
        width="100%"
        onLayout={(e) => {
          const y = e.nativeEvent.layout.y;
          setLayout((l) => ({ ...l, questionY: y }));
        }}
      >
        <ScrollView
          bottom={0}
          left={0}
          right={0}
          position="absolute"
          width="100%"
          onContentSizeChange={(_, h) => {
            setLayout((l) => ({ ...l, paragraphHeight: h }));
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          height={layout.questionY - layout.containerY}
          scrollEnabled={layout.paragraphHeight > layout.questionY}
        >
          <QuestionContent question={question} />
        </ScrollView>
      </View>
      <XStack gap="$2" flexWrap="wrap">
        {question?.answers.map((answerText, idx) => (
          <AnswerButton
            key={idx}
            answerText={answerText}
            isCorrect={idx === question!.correctAnswer}
            selected={answer === null ? answer : idx === answer}
            onPress={() => handleAnswer(idx)}
          />
        ))}
      </XStack>
      <XStack
        justifyContent="space-between"
        width="100%"
        marginTop="$-2"
        gap="$2"
        pointerEvents={answer !== null ? "auto" : "none"}
        opacity={answer !== null ? 1 : 0}
        animation="medium"
        theme="alt2"
      >
        <Button
          circular
          icon={BookOpen}
          onPress={() => {
            if (question) lookupQuestion(question);
          }}
        />
        <Button
          circular
          icon={Search}
          onPress={() => {
            if (question)
              lookupAnswer(question?.answers[question.correctAnswer]);
          }}
        />
      </XStack>
      {!noMargin && <View marginBottom="40%" />}
    </YStack>
  );
}
