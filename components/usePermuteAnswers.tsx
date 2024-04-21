import { useMemo } from "react";
import { QuestionWithAnswers } from "../services/questions";

export const usePermuteAnswers = (
  questionOriginal: QuestionWithAnswers | null,
  handleAnswerOriginal: (idx: number) => void,
  answerOriginal: number | null,
) => {
  const permutation: number[] = useMemo(() => {
    if (!questionOriginal) return [];
    return new Array(questionOriginal.answers.length)
      .fill(0)
      .map((_, i) => i)
      .sort(() => Math.random() - 0.5);
  }, [questionOriginal]); // regenerate when question changes

  const handleAnswer = (idx: number) => {
    handleAnswerOriginal(permutation[idx]);
  };

  const question = useMemo(() => {
    if (!questionOriginal) return null;

    return {
      ...questionOriginal,
      answers: permutation.map((i) => questionOriginal.answers[i]),
      correctAnswer: permutation.indexOf(questionOriginal.correctAnswer),
      userAnswers: questionOriginal.userAnswers.map((i) => ({
        ...i,
        answer: permutation.indexOf(i.answer),
      })),
    };
  }, [questionOriginal, permutation]);

  const answer =
    answerOriginal !== null ? permutation.indexOf(answerOriginal) : null;

  return { question, handleAnswer, answer };
};
