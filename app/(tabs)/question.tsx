import { AnimatePresence, View } from "tamagui";
import { useCallback, useEffect, useState } from "react";
import {
  getRandomQuestion,
  QuestionWithAnswers,
  submitAnswer,
} from "@/services/questions";
import { useToastController } from "@tamagui/toast";
import * as zod from "zod";
import { QuestionView } from "@/components/QuestionView";

const questionSchema = zod.object({
  id: zod.number(),
  question: zod.string().min(1),
  category: zod.enum(["grammar", "vocabulary", "kanji", "unknown"]),
  level: zod.enum(["N5", "N4", "N3", "N2", "N1"]),
  answers: zod.array(zod.string()).length(4),
  correctAnswer: zod.number().lte(3).gte(0),
});

function QuestionManager() {
  const [answer, setAnswer] = useState<null | number>(null);
  const [question, setQuestion] = useState<QuestionWithAnswers | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToastController();

  const fetchQuestion = useCallback(
    async function () {
      setLoading(true);
      try {
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
      } finally {
        setLoading(false);
      }
    },
    [setQuestion],
  );

  useEffect(() => {
    if (question) return;
    setAnswer(null);
    fetchQuestion();
  }, []);

  const handleAnswer = async (answerId: number) => {
    if (answer !== null) {
      setAnswer(null);
      fetchQuestion();
      return;
    }
    if (!question) return;

    await submitAnswer(question?.id, answerId);
    setAnswer(answerId);
  };

  return (
    <AnimatePresence>
      <View
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        animation="fast"
        key={question?.question.toString()}
        exitStyle={{ transform: [{ translateX: 200 }], opacity: 0 }}
        enterStyle={{ transform: [{ translateX: -200 }], opacity: 0 }}
        transform={[{ translateX: 0 }]}
      >
        <QuestionView
          question={question}
          answer={answer}
          handleAnswer={handleAnswer}
        />
      </View>
    </AnimatePresence>
  );
}

export default function TabOneScreen() {
  return <QuestionManager />;
}
