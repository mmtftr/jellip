import { ScrollView, XStack } from "tamagui";
import { useRouter } from "expo-router";

import { ListItem, Text } from "tamagui";
import { useRoute } from "@react-navigation/native";
import Details from "../../scripts/data/grammar_details.json";
import { BookKey, ChevronRight } from "@tamagui/lucide-icons";
import { FlatList } from "react-native";

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
