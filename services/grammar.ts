// import { Question, QuestionWithAnswers } from "./questions";
// import Details from "../scripts/data/grammar_details.json";
// import Kuromoji from "@charlescoeder/react-native-kuromoji";
// import * as FileSystem from "expo-file-system";
// import { Asset } from "expo-asset";

// const kuromoji = Kuromoji.builder({
//   assets: {
//     "base.dat.gz": Asset.fromModule(
//       require("../assets/kuromoji/dict/base.dat.gz")
//     ),
//     "cc.dat.gz": Asset.fromModule(require("../assets/kuromoji/dict/cc.dat.gz")),
//     "check.dat.gz": Asset.fromModule(
//       require("../assets/kuromoji/dict/check.dat.gz")
//     ),
//     "tid_map.dat.gz": Asset.fromModule(
//       require("../assets/kuromoji/dict/tid_map.dat.gz")
//     ),
//     "tid_pos.dat.gz": Asset.fromModule(
//       require("../assets/kuromoji/dict/tid_pos.dat.gz")
//     ),
//     "tid.dat.gz": Asset.fromModule(
//       require("../assets/kuromoji/dict/tid.dat.gz")
//     ),
//     "unk_char.dat.gz": Asset.fromModule(
//       require("../assets/kuromoji/dict/unk_char.dat.gz")
//     ),
//     "unk_compat.dat.gz": Asset.fromModule(
//       require("../assets/kuromoji/dict/unk_compat.dat.gz")
//     ),
//     "unk_invoke.dat.gz": Asset.fromModule(
//       require("../assets/kuromoji/dict/unk_invoke.dat.gz")
//     ),
//     "unk_map.dat.gz": Asset.fromModule(
//       require("../assets/kuromoji/dict/unk_map.dat.gz")
//     ),
//     "unk_pos.dat.gz": Asset.fromModule(
//       require("../assets/kuromoji/dict/unk_pos.dat.gz")
//     ),
//     "unk.dat.gz": Asset.fromModule(
//       require("../assets/kuromoji/dict/unk.dat.gz")
//     ),
//   },
// }).build();

// const space = new RegExp("[（(]\\s+[)）]");
// const parenExpr = new RegExp("[（(].+[)）]");

// function processGrammar(text: string) {
//   return text
//     .split(",")
//     .map((s) => s.trim().replace("〜", "").replace(parenExpr, ""));
// }

// const DetailsSearchIndex: Record<string, number> = Details.reduce(
//   (acc, item) => ({
//     ...acc,
//     ...Object.fromEntries(
//       processGrammar(item.main_grammar).map((s) => [s, item.id])
//     ),
//   }),
//   {}
// );

// export const findRelatedGrammarPoints = async (question: Question) => {
//   const tok = await kuromoji;
//   let questionText = question.question;

//   if (space.test(questionText)) {
//     questionText = questionText.replace(
//       space,
//       question.answers[question.correctAnswer]
//     );
//   }

//   const grammars = new Set();

//   tok.tokenize(questionText).forEach((token: { surface_form: string }) => {
//     if (DetailsSearchIndex[token.surface_form]) {
//       grammars.add(DetailsSearchIndex[token.surface_form]);
//     }
//   });

//   return Array.from(grammars);
// };
