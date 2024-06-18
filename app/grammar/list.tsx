import { useLocalSearchParams, useRouter } from "expo-router";
import { Input, XStack } from "tamagui";

import { settingsStore } from "@/services/store";
import { toHiragana } from "@koozaki/romaji-conv";
import { BookA, ChevronRight, Search } from "@tamagui/lucide-icons";
import { useMemo, useState } from "react";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItem, Text } from "tamagui";
import Details from "../../scripts/data/grammar_details.json";

const LevelComp = ({ level }: { level: string }) => {
  return (
    <XStack gap="$2" ai="center">
      <XStack px="$2" py="$1" br="$4" bg={"$gray4"}>
        <Text color="$gray9">{level}</Text>
      </XStack>
      <ChevronRight />
    </XStack>
  );
};
export default function () {
  const r = useRouter();
  const [search, setSearch] = useState("");
  const levelFilter = settingsStore((state) => state.data.grammarLevelFilter);

  const params = useLocalSearchParams();

  const grammarsFiltered = useMemo(() => {
    if (params.grammars) {
      const grammars = params.grammars.split(",").map(Number);
      return Details.filter((d) => grammars?.includes(d.id));
    }

    return Details;
  }, [params.grammars]);

  const levelFiltered = useMemo(
    () =>
      levelFilter.length
        ? grammarsFiltered.filter((d) =>
            (levelFilter as string[]).includes(d.jlpt_level.slice(-2))
          )
        : grammarsFiltered,
    [levelFilter, grammarsFiltered]
  );

  const searchFiltered = useMemo(() => {
    if (search === "") {
      return levelFiltered;
    }

    const hiragana = toHiragana(search);
    return levelFiltered.filter(
      (d) => matches(d, hiragana) || matches(d, search)
    );
  }, [search, levelFiltered]);

  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <XStack ai="center" px="$3" gap="$2" py="$2">
        <Search />
        <Input flex={1} onChangeText={(r) => setSearch(r.toLowerCase())} />
      </XStack>
      <FlatList
        data={searchFiltered}
        getItemLayout={(data, index) => ({
          length: 65,
          offset: 65 * index,
          index,
        })}
        contentContainerStyle={{ paddingBottom: bottom }}
        renderItem={({ item }) => (
          <ListItem
            hoverTheme
            pressTheme
            title={item.main_grammar}
            subTitle={item.meaning.actual}
            icon={BookA}
            iconAfter={
              item.jlpt_level ? <LevelComp level={item.jlpt_level} /> : null
            }
            onPress={() => {
              r.push(`/grammar/${item.id}`);
            }}
          />
        )}
      />
    </>
  );
}
function matches(
  d: {
    main_grammar: string;
    jlpt_level: string;
    meaning: { actual: string; context: string };
    reading?: string;
  },
  search: string
): unknown {
  const runCriteria = (search) =>
    d.reading?.includes(search) ||
    d.main_grammar.includes(search) ||
    d.meaning?.actual?.toLowerCase()?.includes(search) ||
    d.jlpt_level?.toLowerCase()?.includes(search);

  return runCriteria(search);
}
