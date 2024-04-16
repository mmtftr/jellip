async function main() {
  const csv = await require("fs/promises").readFile(
    "./data/mondai.csv",
    "utf8",
  );

  const lines = csv.split("\n");
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
      return { type: "question", id: Number(sp[0]), questionText: sp[1] };
    })
    .filter(Boolean);

  const questions = mondai.filter((s) => s.type === "question");
  for (const answer of mondai.filter((s) => s.type === "answers")) {
    const q = questions.find((q) => q.id === answer.qId);
    q.answers = answer.answers;
    q.correctAnswer = answer.correctAnswer;
    delete q["type"];
  }
  console.log(questions);
  await require("fs/promises").writeFile(
    "../constants/seed.json",
    JSON.stringify({ questions }, 0, 2),
    "utf8",
  );
}
main();
