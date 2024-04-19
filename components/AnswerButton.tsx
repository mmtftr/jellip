import { Button, Theme, ThemeName } from "tamagui";

export const AnswerButton = ({
  answerText,
  isCorrect,
  selected,
  onPress,
}: {
  answerText: string;
  isCorrect: boolean;
  // null means nothing has been selected
  selected: boolean | null;
  onPress: () => {};
}) => {
  let theme: ThemeName | undefined = "active";
  if (selected !== null) {
    if (selected || isCorrect) {
      theme = isCorrect ? "green_active" : "red_active";
    } else {
      theme = undefined;
    }
  }
  return (
    <Theme name="blue">
      <Button
        animation={{ theme: "fast" }}
        minWidth="40%"
        pressStyle={{ scale: 0.95 }}
        flex={1}
        theme={theme}
        size={"$5"}
        noTextWrap={false}
        textProps={{ adjustsFontSizeToFit: true }}
        onPress={onPress}
      >
        {answerText}
      </Button>
    </Theme>
  );
};
