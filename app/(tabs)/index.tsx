import { Linking } from "react-native";
import { Paragraph, View } from "tamagui";

export default function Home() {
  return (
    <View>
      <Paragraph>Home</Paragraph>
      <Paragraph onPress={() => Linking.openURL("https://expo.dev")}>
        Learn more about Expo
      </Paragraph>
      <Paragraph onPress={() => Linking.openURL("https://reactnavigation.org")}>
        Learn more about React Navigation
      </Paragraph>
    </View>
  );
}
