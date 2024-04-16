import { Button, YStack, Paragraph, XStack } from "tamagui";
import { useCallback, useEffect, useState } from "react";
import { getRandomQuestion, submitAnswer } from "../../services/questions";
import { questions } from "../../db/schema";
import { useToastController } from "@tamagui/toast";
import * as zod from "zod";

const questionSchema = zod.object({
  id: zod.number(),
  question: zod.string().min(1),
  answers: zod.array(zod.string()).length(4),
  correctAnswer: zod.number().lte(3).gte(0),
});

export default function TabOneScreen() {
  const [answer, setAnswer] = useState<null | number>(null);
  const [question, setQuestion] = useState<
    typeof questions.$inferSelect | null
  >(null);

  const toast = useToastController();

  const fetchQuestion = useCallback(
    async function () {
      const question = await getRandomQuestion();

      if (!question) {
        toast.show("No Question Found", {
          type: "error",
          message: "No question found. Please try again.",
        });
      }
      const result = questionSchema.safeParse(question);
      if (!result.success) {
        toast.show("Invalid Question", {
          type: "error",
          message:
            "Invalid question received. Errors: " + result.error.toString(),
        });
        return;
      }

      setQuestion(question);
    },
    [setQuestion],
  );

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleAnswer = async (answerId: number) => {
    if (answer !== null) {
      setAnswer(null);
      setQuestion(null);
      fetchQuestion();
      return;
    }
    if (!question) return;

    await submitAnswer(question?.id, answerId);
    setAnswer(answerId);
  };

  return (
    <YStack
      flex={1}
      paddingHorizontal="$8"
      alignItems="center"
      justifyContent="center"
      gap="$4"
    >
      <Paragraph size="$6">{question?.question}</Paragraph>
      <XStack gap="$2" flexWrap="wrap">
        {question?.answers.map((answerText, idx) => (
          <AnswerButton
            key={answerText}
            answerText={answerText}
            isCorrect={idx === question!.correctAnswer}
            selected={answer === null ? answer : idx === answer}
            onPress={() => handleAnswer(idx)}
          />
        ))}
      </XStack>
    </YStack>
  );
}

const AnswerButton = ({
  answerText,
  isCorrect,
  selected,
  onPress,
}: {
  answerText: string;
  isCorrect: boolean;
  // null means nothing has been selected
  selected: boolean | null;
  onPress: () => {};
}) => {
  if (selected !== null && (isCorrect || selected)) {
    return (
      <Button
        minWidth="40%"
        flex={1}
        theme={isCorrect ? "green_active" : "red_active"}
        onPress={onPress}
      >
        {answerText}
      </Button>
    );
  }
  return (
    <Button minWidth="40%" flex={1} theme="active" onPress={onPress}>
      {answerText}
    </Button>
  );
};
