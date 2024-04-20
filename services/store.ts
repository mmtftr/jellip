import { createStore } from "@colorfy-software/zfy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { QuestionWithAnswers } from "./questions";

export const settingsStore = createStore(
  "settings",
  {
    categoryFilter: [] as QuestionWithAnswers["category"][],
    levelFilter: [] as QuestionWithAnswers["level"][],
  },
  { persist: { getStorage: () => AsyncStorage } }
);

export const answersTodayStore = createStore(
  "answersTodayStore",
  { val: 0 },
  {}
);

export const stores = [settingsStore];
