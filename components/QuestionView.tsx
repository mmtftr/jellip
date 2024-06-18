import { AnswerButton } from "@/components/AnswerButton";
import { QuestionContent } from "@/components/QuestionContent";
import {
  Question,
  QuestionWithAnswers,
  lookupQuestion,
} from "@/services/questions";
import { ArrowRight, BookOpen, Search } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Button, ScrollView, View, XStack, YStack } from "tamagui";
// import { findRelatedGrammarPoints } from "@/services/grammar";
import { findRelatedGrammarPoints } from "@/services/grammar";
import { useRouter } from "expo-router";

export function QuestionView({
  question,
  answer,
  handleAnswer,
  noMargin = false,
  noNext = false,
}: {
  question: Question | QuestionWithAnswers | null;
  answer: number | null;
  handleAnswer: (answerId: number) => void;
  noMargin?: boolean;
  noNext?: boolean;
}) {
  const [layout, setLayout] = useState({
    questionY: 500, // give an initial height to avoid flashing
    containerY: 0,
    paragraphHeight: 0,
  });
  const wide = question?.answers.some((a) => a.length > 10);

  const router = useRouter();

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
          showsVerticalScrollIndicator={
            layout.paragraphHeight > layout.questionY
          }
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
            wide={wide}
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
        {!noNext && (
          <Button
            circular
            icon={ArrowRight}
            onPress={() => {
              if (question && answer) handleAnswer(-1); // goes to the next question
            }}
          />
        )}
        <Button
          circular
          icon={Search}
          onPress={() => {
            if (question)
              findRelatedGrammarPoints(question).then((grammars) => {
                router.push("/grammar/list?grammars=" + grammars.join(","));
              });
          }}
        />
      </XStack>
      {!noMargin && <View marginBottom="40%" />}
    </YStack>
  );
}
