import { FuriganaPart, FuriganaSentence, FuriganaService } from "../furigana";

interface JotobaRequestSettings {
  jlpt: number;
  user_lang: string;
  show_english: boolean;
  english_on_top: boolean;
  page_size: number;
  show_example_sentences: boolean;
  sentence_furigana: boolean;
}

interface JotobaRequestBody {
  query_str: string;
  settings: JotobaRequestSettings;
  page: number;
  word_index: number;
}

interface JotobaSentencePart {
  inflected: string;
  furigana?: string;
  position: number;
  word_class: string;
}

interface JotobaWordDefinition {
  sequence: number;
  is_common: boolean;
  reading: string;
  senses: Array<{
    glosses: string[];
    part_of_speech: Array<Record<string, any>>;
    language: string;
    example_sentence?: string[];
  }>;
  // ... other fields as needed
}

interface JotobaResponse {
  content: {
    words: JotobaWordDefinition[];
    sentence: {
      curr_index: number;
      parts: JotobaSentencePart[];
      splits: string;
    };
    original_query: string;
  };
  pages: number;
  current_page: number;
}

export class JotobaAPI {
  private static baseUrl: string = "https://jotoba.de/api/app/words";
  static defaultSettings: JotobaRequestSettings = {
    jlpt: 1,
    user_lang: "en-US",
    show_english: true,
    english_on_top: false,
    page_size: 10,
    show_example_sentences: true,
    sentence_furigana: true,
  };

  static async searchWord(
    query: string,
    partialSettings: Partial<JotobaRequestSettings> = {},
    page: number = 1,
    wordIndex: number = 0
  ): Promise<JotobaResponse> {
    const settings = {
      ...JotobaAPI.defaultSettings,
      ...partialSettings,
    };

    const requestBody: JotobaRequestBody = {
      query_str: query,
      settings,
      page,
      word_index: wordIndex,
    };

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/237.84.2.178 Safari/537.36 +https://github.com/mmtftr/jellip",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as JotobaResponse;
  }
}

export class SentenceAnalyzer {
  private parts: JotobaSentencePart[] | null = null;
  private api: typeof JotobaAPI;
  private sentence: string;
  private settings: Partial<JotobaRequestSettings>;

  constructor(sentence: string, settings: Partial<JotobaRequestSettings> = {}) {
    this.api = JotobaAPI;
    this.sentence = sentence;
    this.settings = settings;
  }

  async fetch(): Promise<void> {
    await this.fetchParts();
  }

  getParts(): JotobaSentencePart[] | null {
    return this.parts;
  }

  async fetchParts(): Promise<JotobaSentencePart[]> {
    if (this.parts) return this.parts;
    const response = await this.api.searchWord(this.sentence, this.settings);
    this.parts = response.content.sentence.parts;
    return this.parts;
  }

  async getWordDefinition(
    wordIndex: number
  ): Promise<JotobaWordDefinition | null> {
    if (!this.parts) await this.fetchParts();

    if (wordIndex < 0 || wordIndex >= this.parts!.length) {
      throw new Error("Word index out of bounds");
    }

    const part = this.parts![wordIndex];
    try {
      const response = await this.api.searchWord(
        part.inflected,
        this.settings,
        1,
        wordIndex
      );
      return response.content.words[0] || null;
    } catch (error) {
      console.error(
        `Error fetching definition for word at index ${wordIndex}:`,
        error
      );
      return null;
    }
  }

  async getAllDefinitions(): Promise<(JotobaWordDefinition | null)[]> {
    if (!this.parts) await this.fetchParts();

    const definitions: (JotobaWordDefinition | null)[] = [];
    for (let i = 0; i < this.parts!.length; i++) {
      definitions.push(await this.getWordDefinition(i));
    }
    return definitions;
  }
}
// Receives a string with format "[original|furi1|furi2|furi3]" and returns "furi1furi2furi3"
const extractFurigana = (part: JotobaSentencePart): FuriganaPart[] => {
  const { furigana, inflected } = part;
  if (!furigana) {
    return [{ text: inflected, furi: undefined }];
  }

  return furigana
    .split(/[\[\]]/)
    .flatMap<FuriganaPart>((s, idx) => {
      if (idx % 2 === 0) {
        return { text: s, furi: undefined };
      } else {
        const [inflected, ...furi] = s.split("|");
        return [...inflected].map((char, idx) => ({
          text: char,
          furi: furi[idx],
        }));
      }
    })
    .filter((s) => Boolean(s.text));
};

export class JotobaFuriganaService implements FuriganaService {
  getFurigana(sentence: string): Promise<FuriganaSentence> {
    return JotobaAPI.searchWord(sentence).then((response) => {
      if (!response?.content?.sentence?.parts)
        return {
          parts: [
            {
              text: sentence,
              furi: undefined,
            },
          ],
        };
      return {
        parts: response.content.sentence.parts.flatMap(extractFurigana),
      };
    });
  }
}
