function getQuestionsFromCsv(lines, category = "vocabulary", level = "N1") {
  let qId = null;
  const mondai = lines
    .map((line) => {
      const sp = line.split(",");
      if (sp.length < 2) return null;
      if (!sp[1].length) return null;
      if (!sp[0].length)
        return {
          type: "answers",
          qId,
          answers: sp.slice(1, 5).map((s) => s.trim().slice(2)),
          correctAnswer: Number(sp[5]) - 1,
        };
      qId = Number(sp[0]);
      return {
        id: Number(sp[0]),
        type: "question",
        category,
        level,
        questionText: sp[1],
      };
    })
    .filter(Boolean);

  const questions = mondai.filter((s) => s.type === "question");
  for (const answer of mondai.filter((s) => s.type === "answers")) {
    const q = questions.find((q) => q.id === answer.qId);
    q.answers = answer.answers;
    q.correctAnswer = answer.correctAnswer;
    delete q["type"];
  }

  return questions;
}
function postProcess(question) {
  return {
    ...question,
    questionText: question.questionText.trim(),
    answers: question.answers.map((a) =>
      a.replace("）", "").replace(")", "").trim(),
    ),
  };
}

async function main() {
  console.log(
    postProcess({
      id: 8072,
      category: "vocabulary",
      level: "N5",
      questionText: "（たくしー）を　よんでください。",
      answers: ["）クタシー", "）タクシー", "）クツツー", "）タクツー"],
      correctAnswer: 1,
      questionSet: 2,
    }),
  );
  const csv = await require("fs/promises").readFile(
    "./data/mondai.csv",
    "utf8",
  );
  const csv2 = await require("fs/promises").readFile(
    "./data/mondai2.csv",
    "utf8",
  );

  const csvQuestions1 = getQuestionsFromCsv(csv.split("\n"), "grammar");
  const csvQuestions2 = getQuestionsFromCsv(csv2.split("\n"), "vocabulary");

  const csvQuestions = new Array()
    .concat(csvQuestions1, csvQuestions2)
    .map((q, id) => ({ ...q, id, questionSet: 1 }));

  const jlptQuestionsData = require("./data/jlpt_questions/output.json");

  const questions = csvQuestions
    .concat(
      jlptQuestionsData.questions.map((q, id) => ({
        ...q,
        id: id + csvQuestions.length,
        questionSet: 2,
      })),
    )
    .map(postProcess);

  const questionSets = [
    {
      id: 1,
      name: "default",
      description: "Default question set",
    },
    {
      id: 2,
      name: "External 1",
      description: "Questions from jlpt_questions Github repository.",
    },
  ];

  await require("fs/promises").writeFile(
    "../constants/seed.json",
    JSON.stringify(
      {
        questions,
        questionSets,
      },
      0,
      2,
    ),
    "utf8",
  );
}
main();
setTimeout(() => {
  process.exit(0);
}, 1000);
