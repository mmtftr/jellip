// import { tokenize } from "react-native-japanese-text-analyzer";
import Details from "../scripts/data/grammar_details.json";
import { Question } from "./questions";

// if (__DEV__)
//   Promise.resolve(true)
//     .then(async () => {
//       const result = await tokenize("にすぎない");
//       console.log(result);
//     })
//     .catch(console.error);

const space = new RegExp("[（(]\\s+[)）]");
const parenExpr = new RegExp("[（(].+[)）]");

type Grammar = typeof Details extends (infer T)[] ? T : never;

function processGrammar(text: Grammar): string[] {
  return text.main_grammar
    .split(",")
    .map((s) => s.trim().replace("〜", "").replace(parenExpr, ""));
}

const DetailsSearchIndex: Record<string, number> = Details.reduce(
  (acc, item) => ({
    ...acc,
    ...Object.fromEntries(processGrammar(item).map((s) => [s, item.id])),
  }),
  {}
);

export const findRelatedGrammarPoints = async (question: Question) => {
  let questionText = question.question;

  if (space.test(questionText)) {
    questionText = questionText.replace(
      space,
      question.answers[question.correctAnswer]
    );
  }

  return Object.keys(DetailsSearchIndex)
    .filter(
      (key) =>
        questionText.includes(key) ||
        question.answers.some((ans) => ans.includes(key))
    )
    .map((key) => DetailsSearchIndex[key])
    .filter(Boolean);
};
