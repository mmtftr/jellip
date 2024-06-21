import { JotobaAPI, JotobaFuriganaService } from "../../ext/jotoba";

describe("JotobaAPI", () => {
  let api: typeof JotobaAPI;

  beforeEach(() => {
    api = JotobaAPI;
  });

  describe("searchWord", () => {
    it("should make a POST request to the correct URL", async () => {
      const mockFetch = jest.fn().mockResolvedValue({ ok: true, json() {} });
      global.fetch = mockFetch;

      await api.searchWord("test query", {});

      expect(mockFetch).toHaveBeenCalledWith(
        (api as any).baseUrl,
        expect.any(Object)
      );
    });

    it("should throw an error if the response is not ok", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });
      global.fetch = mockFetch;

      await expect(api.searchWord("test query", {})).rejects.toThrowError(
        "HTTP error! status: 404"
      );
    });

    it("should return the parsed JSON response", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          test: "response",
        }),
      });
      global.fetch = mockFetch;

      const response = await api.searchWord("test query", {});

      expect(response).toEqual({
        test: "response",
      });
    });
  });
});

describe("JotobaFuriganaService", () => {
  let service: JotobaFuriganaService;

  beforeEach(() => {
    jest.spyOn(JotobaAPI, "searchWord");
    service = new JotobaFuriganaService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getFurigana", () => {
    it("should call JotobaAPI.searchWord with the provided sentence", async () => {
      const sentence = "test sentence";
      const mockResponse = {
        content: {
          sentence: {
            parts: [
              { inflected: "test", furigana: "テスト" },
              { inflected: "sentence", furigana: "センテンス" },
            ],
          },
        },
      };
      (JotobaAPI.searchWord as jest.Mock).mockResolvedValue(mockResponse);

      await service.getFurigana(sentence);

      expect(JotobaAPI.searchWord).toHaveBeenCalledWith(sentence);
    });

    it("should return the parsed response from JotobaAPI.searchWord", async () => {
      const sentence = "test sentence";
      const mockResponse = {
        content: {
          words: [
            {
              sequence: 1582920,
              is_common: true,
              reading: "[此|こ]の",
              alt_readings: ["[斯|こ]の", "こん"],
              senses: [
                {
                  misc: "UsuallyWrittenInKana",
                  glosses: ["this"],
                  xref: "どの",
                  xref2: {
                    word: "どの",
                  },
                  information:
                    "something or someone close to the speaker (including the speaker), or ideas expressed by the speaker",
                  part_of_speech: [
                    {
                      Adjective: "PreNoun",
                    },
                  ],
                  language: "English",
                  example_sentence: [
                    "このコップをミルクで[満|み]たした。",
                    "I filled this glass with milk.",
                  ],
                },
                {
                  misc: "UsuallyWrittenInKana",
                  glosses: [
                    "last (couple of years, etc.)",
                    "these",
                    "past",
                    "this",
                  ],
                  information: "in ref. to a stretch of time or date",
                  part_of_speech: [
                    {
                      Adjective: "PreNoun",
                    },
                  ],
                  language: "English",
                  example_sentence: [
                    "この[数年間|すう|ねん|かん]に[彼|かれ]は[不朽|ふ|きゅう]の[名詩|めい|し]を[書|か]いた。",
                    "During these years he wrote immortal poems.",
                  ],
                },
                {
                  misc: "UsuallyWrittenInKana",
                  glosses: ['you (as in "you liar")'],
                  information: "emphatic, accusatory, insulting",
                  part_of_speech: [
                    {
                      Adjective: "PreNoun",
                    },
                  ],
                  language: "English",
                },
              ],
              accents: [
                {
                  parts: [
                    {
                      part: "こ",
                      high: false,
                    },
                    {
                      part: "の",
                      high: true,
                    },
                  ],
                  pos: [],
                },
              ],
              furigana: "[此|こ]の",
              jlpt_lvl: 5,
              sentences_available: 1,
              kanji: [
                {
                  literal: "此",
                  stroke_count: 6,
                  grade: 9,
                  frequency: 2078,
                  onyomi: [
                    {
                      reading: "シ",
                      has_words: true,
                    },
                  ],
                  kunyomi: [
                    {
                      reading: "これ",
                      has_words: true,
                    },
                    {
                      reading: "この",
                      has_words: true,
                    },
                    {
                      reading: "ここ",
                      has_words: true,
                    },
                  ],
                  chinese: ["ci3"],
                  korean_romaji: ["cha"],
                  korean_hangul: ["차"],
                  similar_kanji: ["雌", "匕", "眦"],
                  meanings: [
                    "this",
                    "current",
                    "next",
                    "coming",
                    "last",
                    "past",
                  ],
                  parts: ["止", "匕"],
                  vietnamese: ["Thử"],
                  has_compounds: true,
                  has_frames: true,
                  has_animation: true,
                  radical: {
                    id: 77,
                    literal: "止",
                    alternative: null,
                    stroke_count: 0,
                    readings: [],
                    translations: ["stop"],
                  },
                  is_kokuji: false,
                },
              ],
            },
            {
              sequence: 1578150,
              is_common: true,
              reading: "[九|きゅう]",
              alt_readings: [
                "[９|きゅう]",
                "[玖|きゅう]",
                "[九|く]",
                "[九|ここの]",
                "[九|この]",
                "[九|ここ]",
              ],
              senses: [
                {
                  glosses: ["nine", "9"],
                  information: "玖 is used in legal documents",
                  part_of_speech: ["Numeric"],
                  language: "English",
                  example_sentence: [
                    "[彼|かれ]は「[九時|く|じ]だ」と[言|い]った。",
                    "He said, \"It's nine o'clock.\"",
                  ],
                },
              ],
              audio: {
                tofugu: 1578150,
              },
              accents: [
                {
                  parts: [
                    {
                      part: "きゅ",
                      high: true,
                    },
                    {
                      part: "う",
                      high: false,
                    },
                  ],
                  pos: [],
                },
              ],
              furigana: "[九|きゅう]",
              jlpt_lvl: 5,
              sentences_available: 1,
              kanji: [
                {
                  literal: "九",
                  stroke_count: 2,
                  grade: 1,
                  frequency: 55,
                  jlpt: 5,
                  onyomi: [
                    {
                      reading: "キュウ",
                      has_words: true,
                    },
                    {
                      reading: "ク",
                      has_words: true,
                    },
                  ],
                  kunyomi: [
                    {
                      reading: "ここの",
                      has_words: true,
                    },
                    {
                      reading: "ここの.つ",
                      has_words: true,
                    },
                  ],
                  chinese: ["jiu3"],
                  korean_romaji: ["gu", "gyu"],
                  korean_hangul: ["구", "규"],
                  nanori: ["いちじく", "いちのく", "この", "ひさし"],
                  similar_kanji: ["旭", "仇"],
                  meanings: ["nine"],
                  parts: ["九"],
                  vietnamese: ["Cửu", "Cưu"],
                  has_compounds: true,
                  has_frames: true,
                  has_animation: true,
                  radical: {
                    id: 5,
                    literal: "乙",
                    alternative: null,
                    stroke_count: 0,
                    readings: [],
                    translations: null,
                  },
                  is_kokuji: false,
                },
              ],
            },
          ],
          sentence: {
            curr_index: 0,
            parts: [
              {
                inflected: "この",
                position: 0,
                word_class: "PreNoun",
              },
              {
                inflected: "アプリ",
                position: 1,
              },
              {
                inflected: "の",
                position: 2,
                word_class: "Particle",
              },
              {
                inflected: "機能",
                furigana: "[機能|き|のう]",
                position: 3,
                word_class: "Noun",
              },
              {
                inflected: "は",
                position: 4,
                word_class: "Particle",
              },
              {
                inflected: "なんと",
                position: 5,
                word_class: "Adverb",
              },
              {
                inflected: "便利",
                furigana: "[便利|べん|り]",
                position: 6,
                word_class: "Adjective",
              },
            ],
            splits: "adi",
          },
          original_query: "この",
        },
        pages: 1,
        current_page: 1,
      };

      (JotobaAPI.searchWord as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getFurigana(sentence);

      expect(result).toEqual({
        parts: [
          {
            text: "この",
            furi: undefined,
          },
          {
            text: "アプリ",
            furi: undefined,
          },
          {
            text: "の",
            furi: undefined,
          },
          {
            text: "機",
            furi: "き",
          },
          {
            text: "能",
            furi: "のう",
          },
          {
            text: "は",
            furi: undefined,
          },
          {
            text: "なんと",
            furi: undefined,
          },
          {
            text: "便",
            furi: "べん",
          },
          {
            text: "利",
            furi: "り",
          },
        ],
      });
    });
  });
});
