import { useFurigana } from "@/services/furigana";
import { settingsStore } from "@/services/store";
import Furi, { FuriProps } from "./FuriText";

export function JapaneseText({
  text,
  ...rest
}: { text: string } & Omit<FuriProps, "value">) {
  const furiEnabled = settingsStore((state) => state.data.furiEnabled);

  const { data } = useFurigana({
    sentence: text,
    enabled: furiEnabled,
  });

  if (data) {
    return <Furi value={data.parts} {...rest} />;
  }

  return <Furi value={[{ text, furi: undefined }]} {...rest} />;
}
