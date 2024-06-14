import { BookKey, ChevronRight } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList } from "react-native";
import { ListItem, XStack, Text } from "tamagui";
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
  const params = useLocalSearchParams();
  const filtered = useMemo(() => {
    if (params.grammars && Array.isArray(params.grammars)) {
      return Details.filter((d) => params.grammars?.includes(d.main_grammar));
    }
    return [];
  }, [params.grammars]);
  const r = useRouter();
  return (
    <FlatList
      data={Details}
      getItemLayout={(data, index) => ({
        length: 65,
        offset: 65 * index,
        index,
      })}
      renderItem={({ item }) => (
        <ListItem
          hoverTheme
          pressTheme
          title={item.main_grammar}
          subTitle={item.meaning.actual}
          icon={BookKey}
          iconAfter={<LevelComp level={item.jlpt_level} />}
          onPress={() => {
            r.push(`/grammar/${item.id}`);
          }}
        />
      )}
    />
  );
}
