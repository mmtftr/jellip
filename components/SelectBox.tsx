import React, { useMemo } from "react";
import { YStack, Select, Adapt, Sheet } from "tamagui";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";

export function SelectBox({
  val,
  setVal,
  name,
  items,
  placeholder,
  triggerProps = {},
}: {
  val: string;
  setVal: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  items: { name: string }[];
  placeholder: string | undefined;
  triggerProps?: React.ComponentProps<typeof Select.Trigger>;
}) {
  return (
    <Select value={val} onValueChange={setVal} disablePreventBodyScroll>
      <Select.Trigger iconAfter={ChevronDown} {...triggerProps}>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>

      <Adapt platform="touch">
        <Sheet
          snapPoints={[85, 35]}
          modal
          defaultPosition={1}
          dismissOnSnapToBottom
          animationConfig={{
            type: "spring",
            damping: 40,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="fast"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "transparent"]}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          animation="fast"
          animateOnly={["transform", "opacity"]}
          enterStyle={{ o: 0, y: -10 }}
          exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            <Select.Label>{name}</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      value={item.name}
                      onPress={() => setVal(item.name)}
                    >
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [items]
            )}
          </Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["transparent", "$background"]}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}
