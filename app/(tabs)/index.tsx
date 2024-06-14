import { Link, useRouter } from "expo-router";
import { useEffect } from "react";
import { Heading, Paragraph, YStack } from "tamagui";

export default function Home() {
  return (
    <YStack gap="$4" padding="$8">
      <Heading>Welcome</Heading>
      <Paragraph>
        Welcome to Jellip - a JLPT practice tool. Start grinding away by going
        to the
        <Link href="/question"> question tab</Link>.
      </Paragraph>
    </YStack>
  );
}
