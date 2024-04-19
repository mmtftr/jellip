import {
  YStack,
  XStack,
  AnimatePresence,
  View,
  ScrollView,
  Button,
} from "tamagui";
import { useCallback, useEffect, useState } from "react";
import {
  getRandomQuestion,
  QuestionWithAnswers,
  submitAnswer,
} from "../../services/questions";
import { useToastController } from "@tamagui/toast";
import * as zod from "zod";
import { AnswerButton } from "../../components/AnswerButton";
import { QuestionContent } from "../../components/QuestionContent";
import {
  BookOpen,
  JapaneseYen,
  Search,
  SearchCheck,
  SearchCode,
  SearchX,
} from "@tamagui/lucide-icons";
import { Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { SearchBar } from "react-native-screens";

const questionSchema = zod.object({
  id: zod.number(),
  question: zod.string().min(1),
  category: zod.enum(["grammar", "vocabulary", "kanji", "unknown"]),
  level: zod.enum(["N5", "N4", "N3", "N2", "N1"]),
  answers: zod.array(zod.string()).length(4),
  correctAnswer: zod.number().lte(3).gte(0),
});

export default function TabOneScreen() {
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
    [setQuestion]
  );

  useEffect(() => {
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

  const [layout, setLayout] = useState({
    questionY: 0,
    containerY: 0,
    paragraphHeight: 0,
  });

  return (
    <YStack
      onLayout={(e) => {
        const y = e.nativeEvent.layout.y;
        setLayout((l) => ({ ...l, containerY: y }));
      }}
      height="100%"
      paddingHorizontal="$8"
      alignItems="center"
      justifyContent="flex-end"
      gap="$4"
    >
      <AnimatePresence>
        <View
          overflow="visible"
          width="100%"
          animation="fast"
          key={question?.question.toString()}
          exitStyle={{ transform: [{ translateX: 200 }], opacity: 0 }}
          enterStyle={{ transform: [{ translateX: -200 }], opacity: 0 }}
          onLayout={(e) => {
            const y = e.nativeEvent.layout.y;
            setLayout((l) => ({ ...l, questionY: y }));
          }}
          transform={[{ translateX: 0 }]}
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
      </AnimatePresence>
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
            WebBrowser.openBrowserAsync(
              `https://jisho.org/search/${encodeURIComponent(
                (question?.question || "") + (question?.answers.join(" ") || "")
              )}`
            );
          }}
        />
        <Button
          circular
          icon={Search}
          onPress={() => {
            WebBrowser.openBrowserAsync(
              `https://www.google.com/search?q=${encodeURIComponent(
                (question?.answers[question.correctAnswer] || "") + " 文法"
              )}`
            );
          }}
        />
      </XStack>
      <View marginBottom="40%" />
    </YStack>
  );
}
