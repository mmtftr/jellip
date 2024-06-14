import { getQuestionSeenStats } from "../questions";

const { migrate, reset } = require("@/services/db");
import { db } from "../db";
import { answers, questions, questionSets } from "@/db/schema";

jest.mock("@/services/db");

const insertBaseQuestions = async () => {
  await db.insert(questionSets).values([
    {
      id: 1,
      name: "Test Set",
      description: "Test Set",
    },
  ]);

  await db
    .insert(questions)
    .values([
      {
        id: 1,
        level: "N2",
        category: "vocabulary",
        question: "What is the capital of France?",
        answers: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: 0,
        questionSet: 1,
      },
      {
        id: 2,
        level: "N1",
        category: "vocabulary",
        question: "What is the capital of Germany?",
        answers: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: 2,
        questionSet: 1,
      },
    ])
    .execute();
};
describe("getQuestionSeenStats", () => {
  beforeAll(() => {
    migrate();
  });
  beforeEach(async () => {
    await reset();
  });

  it("should return 0 for empty db", async () => {
    expect(await getQuestionSeenStats()).toEqual({ seen: 0, total: 0 });
  });

  it("should return 0 seen for not answered questions", async () => {
    await insertBaseQuestions();

    expect(await getQuestionSeenStats()).toHaveProperty("seen", 0);
  });

  it("should return seen for answered questions", async () => {
    await insertBaseQuestions();

    await db
      .insert(answers)
      .values([
        {
          id: 1,
          questionId: 1,
          answer: 0,
        },
        {
          id: 2,
          questionId: 2,
          answer: 2,
        },
      ])
      .execute();

    expect(await getQuestionSeenStats()).toEqual({ seen: 2, total: 2 });
  });

  it("should return total for all questions", async () => {
    await insertBaseQuestions();

    expect(await getQuestionSeenStats()).toHaveProperty("total", 2);
  });

  it("should return seen once for multiply answered questions", async () => {
    await insertBaseQuestions();

    await db
      .insert(answers)
      .values([
        {
          id: 1,
          questionId: 1,
          answer: 0,
        },
        {
          id: 2,
          questionId: 2,
          answer: 2,
        },
        {
          id: 3,
          questionId: 1,
          answer: 1,
        },
      ])
      .execute();

    expect(await getQuestionSeenStats()).toEqual({ seen: 2, total: 2 });
  });

  it("respects filters", async () => {
    await insertBaseQuestions();

    await db
      .insert(answers)
      .values([
        {
          id: 1,
          questionId: 1,
          answer: 0,
        },
        {
          id: 2,
          questionId: 2,
          answer: 2,
        },
        {
          id: 3,
          questionId: 1,
          answer: 1,
        },
      ])
      .execute();

    expect(await getQuestionSeenStats({ levelFilter: ["N1"] })).toEqual({
      seen: 1,
      total: 1,
    });
  });
});
