import { ScrollView } from "tamagui";
import Details from "../../scripts/data/grammar_details.json";
import GrammarDetail from "@/components/GrammarDetail";
import { useLocalSearchParams } from "expo-router";

export default function () {
  const { id } = useLocalSearchParams();

  const detail = Details.find((d) => d.id === Number(id));

  return (
    <ScrollView>
      {detail && <GrammarDetail grammarDetail={detail} />}
    </ScrollView>
  );
}
