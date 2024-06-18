import { QuestionView } from "@/components/QuestionView";
import {
  getRandomQuestion,
  QuestionWithAnswers,
  submitAnswer,
} from "@/services/questions";
import { settingsStore } from "@/services/store";
import { useToastController } from "@tamagui/toast";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, Heading, Paragraph, View, YStack } from "tamagui";
import * as zod from "zod";
import { usePermuteAnswers } from "../../components/usePermuteAnswers";

const questionSchema = zod.object({
  id: zod.number(),
  question: zod.string().min(1),
  category: zod.enum(["grammar", "vocabulary", "kanji", "unknown"]),
  level: zod.enum(["N5", "N4", "N3", "N2", "N1"]),
  answers: zod.array(zod.string()).length(4),
  correctAnswer: zod.number().lte(3).gte(0),
});

function QuestionManager() {
  const [solvedId, setSolvedId] = useState(0);
  const [answer, setAnswer] = useState<null | number>(null);
  const [questionBase, setQuestion] = useState<QuestionWithAnswers | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const toast = useToastController();

  const [categoryFilter, levelFilter] = settingsStore((state) => [
    state.data.categoryFilter,
    state.data.questionLevelFilter,
  ]);

  const fetchQuestion = useCallback(
    async function () {
      setLoading(true);
      try {
        const { categoryFilter, questionLevelFilter: levelFilter } =
          settingsStore.getState().data;
        const question = await getRandomQuestion({
          categoryFilter: categoryFilter.length ? categoryFilter : undefined,
          levelFilter: levelFilter.length ? levelFilter : undefined,
        });

        if (!question) {
          toast.show("No Question Found", {
            type: "error",
            message: "No question found. Please change your filters.",
          });
          setQuestion(null);
          return;
        }
        const result = questionSchema.safeParse(question);
        if (!result.success) {
          toast.show("Invalid Question", {
            type: "error",
            message: "Invalid question received.",
          });
          return;
        }

        setSolvedId((id) => id + 1);
        setQuestion(question);
      } finally {
        setLoading(false);
      }
    },
    [setQuestion]
  );

  useEffect(() => {
    setAnswer(null);
    fetchQuestion();
  }, [categoryFilter, levelFilter]);

  const handleAnswerBase = async (answerId: number) => {
    if (answer !== null) {
      setAnswer(null);
      fetchQuestion();
      return;
    }
    if (!questionBase) return;

    await submitAnswer(questionBase?.id, answerId);
    setAnswer(answerId);
  };

  const {
    question,
    handleAnswer,
    answer: permutedAnswer,
  } = usePermuteAnswers(questionBase, handleAnswerBase, answer);

  return (
    <AnimatePresence>
      {questionBase && (
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          animation="fast"
          paddingHorizontal="$8"
          key={solvedId}
          exitStyle={{ transform: [{ translateX: 200 }], opacity: 0 }}
          enterStyle={{ transform: [{ translateX: -200 }], opacity: 0 }}
          transform={[{ translateX: 0 }]}
        >
          <QuestionView
            question={question}
            answer={permutedAnswer}
            handleAnswer={handleAnswer}
          />
        </View>
      )}
      {!questionBase && !loading && (
        <YStack
          f={1}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          animation="fast"
          jc="center"
          ai="center"
          gap="$2"
        >
          <Heading>No question found.</Heading>
          <Paragraph>Try changing the filters to get a question.</Paragraph>
        </YStack>
      )}
    </AnimatePresence>
  );
}

export default function TabOneScreen() {
  return <QuestionManager />;
}
