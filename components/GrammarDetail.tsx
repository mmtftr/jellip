import React, { useMemo } from "react";
import { View, Text, Separator, Stack, XStack, ScrollView } from "tamagui";
import Details from "../scripts/data/grammar_details.json";
import { Link } from "expo-router";

interface Props {
  grammarDetail: {
    id: number;
    reading?: string;
    main_grammar: string;
    jlpt_level: string;
    meaning: {
      actual: string;
      context: string;
    };
    formation: string[];
    see_also?: number[];
    phrases: {
      japanese: string;
      english?: string;
    }[];
  };
}
export default function ({
  grammarDetail: {
    main_grammar,
    reading,
    jlpt_level,
    meaning: { actual, context },
    formation,
    see_also,
    phrases,
  },
}: Props) {
  const see_also_items = useMemo(
    () => see_also?.map((id) => Details.find((a) => a.id === id)),
    [see_also]
  );
  return (
    <Stack gap="$4" padding="$4">
      <Stack gap="$2">
        <Text fontSize="$9" fontWeight="bold">
          {main_grammar}
        </Text>
        {reading && (
          <Text fontSize="$5" color="$gray10">
            {reading}
          </Text>
        )}
        <Text fontSize="$5" color="$gray10">
          {jlpt_level}
        </Text>
      </Stack>
      <Stack gap="$5">
        <Separator borderColor="$gray6" />
        <Stack gap="$2">
          <Text fontSize="$7" fontWeight="bold">
            Meaning
          </Text>
          <Stack gap="$1.5">
            <Text fontSize="$5" color="$gray11">
              {actual}
            </Text>
            <Text fontSize="$5" color="$gray9">
              {context}
            </Text>
          </Stack>
        </Stack>
        {formation.length > 0 && (
          <Stack gap="$4">
            <Separator borderColor="$gray6" />
            <Text fontSize="$7" fontWeight="bold">
              Formation
            </Text>
            <ScrollView horizontal>
              <XStack gap="$2" ai="center">
                {formation.map((f, idx) => (
                  <React.Fragment key={idx}>
                    <View
                      borderWidth={1}
                      borderColor="$blue8"
                      borderRadius={9999}
                      overflow="hidden"
                      bg="$accentBackground"
                      py="$2"
                      px="$4"
                    >
                      <Text fontSize="$5" color="$gray11">
                        {f}
                      </Text>
                    </View>
                    {idx !== formation.length - 1 && (
                      <Text fontSize="$5" color="$gray11">
                        +
                      </Text>
                    )}
                  </React.Fragment>
                ))}
              </XStack>
            </ScrollView>
          </Stack>
        )}
        {see_also && see_also.length > 0 && (
          <>
            <Stack gap="$2">
              <Separator borderColor="$gray6" />
              <Text fontSize="$7" fontWeight="bold" color="$white">
                See also
              </Text>
              {see_also.map(
                (s, idx) =>
                  see_also_items?.[idx] && (
                    <Link
                      push
                      href={`/grammar/${see_also_items[idx]!.id}`}
                      key={idx}
                    >
                      <Text
                        fontSize="$5"
                        color="$blue10"
                        textDecorationLine="underline"
                      >
                        {see_also_items![idx]!.main_grammar} {">"}
                      </Text>
                    </Link>
                  )
              )}
            </Stack>
          </>
        )}
        {phrases.length > 0 && (
          <>
            <Stack gap="$4">
              <Separator borderColor="$gray6" />
              <Text fontSize="$7" fontWeight="bold">
                Phrases
              </Text>
              {phrases.map((p, idx) => (
                <Stack gap="$1.5" key={idx}>
                  <Text fontSize="$5" color="$gray11">
                    {p.japanese.split("***").map((s, i) => (
                      <Text
                        key={i}
                        fontSize="$5"
                        letterSpacing={4}
                        lineHeight="$5"
                        fontWeight={i % 2 === 0 ? "500" : "700"}
                        textDecorationStyle="dotted"
                        color={i % 2 === 0 ? "$gray11" : "$gray12"}
                      >
                        {s}
                      </Text>
                    ))}
                  </Text>
                  {p.english && (
                    <Text fontSize="$5" color="$gray9">
                      {p.english.split("***").map((s, i) => (
                        <Text
                          key={i}
                          fontSize="$5"
                          fontWeight={i % 2 === 0 ? "500" : "700"}
                          textDecorationStyle="dotted"
                          color={i % 2 === 0 ? "$gray9" : "$gray10"}
                        >
                          {s}
                        </Text>
                      ))}
                    </Text>
                  )}
                </Stack>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  );
}
