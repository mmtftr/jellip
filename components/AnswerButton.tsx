import { Button, ThemeName } from "tamagui";

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
  return (
    <Button
      animation="superfastTransform"
      minWidth={wide ? "90%" : "40%"}
      pressStyle={{ scale: 0.9 }}
      flex={1}
      theme={theme}
      size={"$5"}
      noTextWrap={false}
      textProps={{ adjustsFontSizeToFit: true }}
      onPress={onPress}
    >
      {answerText}
    </Button>
  );
};
