function getQuestionsFromLines(lines) {
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
        category: "vocabulary",
        level: "N1",
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

async function main() {
  const csv = await require("fs/promises").readFile(
    "./data/mondai.csv",
    "utf8"
  );
  const csv2 = await require("fs/promises").readFile(
    "./data/mondai2.csv",
    "utf8"
  );

  const questions = getQuestionsFromLines(csv.split("\n"));
  const questions2 = getQuestionsFromLines(csv2.split("\n"));

  console.log(questions.length, questions2.length);
  await require("fs/promises").writeFile(
    "../constants/seed.json",
    JSON.stringify(
      {
        questions: new Array()
          .concat(questions, questions2)
          .map((q, id) => ({ ...q, id })),
      },
      0,
      2
    ),
    "utf8"
  );
}
main();
setTimeout(() => {
  process.exit(0);
}, 1000);
