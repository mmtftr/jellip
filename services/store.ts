import { createStore } from "@colorfy-software/zfy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { QuestionWithAnswers } from "./questions";

export const settingsStore = createStore(
  "settings",
  {
    categoryFilter: [] as QuestionWithAnswers["category"][],
    questionLevelFilter: [] as QuestionWithAnswers["level"][],
    grammarLevelFilter: [] as QuestionWithAnswers["level"][],
    furiEnabled: false,
  },
  {
    persist: {
      getStorage: () => AsyncStorage,
      version: 1,
      migrate(persistedState, _version) {
        persistedState.data.questionLevelFilter ||= [];
        persistedState.data.grammarLevelFilter ||= [];
        persistedState.data.furiEnabled ||= false;

        return persistedState;
      },
    },
  }
);

export const answersTodayStore = createStore(
  "answersTodayStore",
  { val: 0 },
  {}
);

export const stores = [settingsStore];
