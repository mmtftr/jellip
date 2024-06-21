import { settingsStore } from "@/services/store";
import { Button, ThemeName } from "tamagui";
import { JapaneseText } from "./JapaneseText";

export const AnswerButton = ({
  answerText,
  isCorrect,
  selected,
  wide,
  onPress,
}: {
  answerText: string;
  isCorrect: boolean;
  wide?: boolean;
  // null means nothing has been selected
  selected: boolean | null;
  onPress: () => void;
}) => {
  let theme: ThemeName | undefined = "blue_active";
  if (selected !== null) {
    if (selected || isCorrect) {
      theme = isCorrect ? "green_active" : "red_active";
    } else {
      theme = "blue";
    }
  }

  const furiEnabled = settingsStore((s) => s.data.furiEnabled);
  return (
    <Button
      animation="superfastTransform"
      minWidth={wide ? "90%" : "40%"}
      pressStyle={{ scale: 0.9 }}
      flex={1}
      theme={theme}
      size={"$5"}
      noTextWrap={false}
      onPress={onPress}
    >
      {furiEnabled ? (
        <JapaneseText
          textProps={{ adjustsFontSizeToFit: true }}
          size="$5"
          text={answerText}
        />
      ) : (
        answerText
      )}
    </Button>
  );
};
