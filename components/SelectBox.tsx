import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  YStack,
  Select,
  Adapt,
  Sheet,
  SelectItemParentProvider,
  useSelectItemParentContext,
  useSelectContext,
  SelectProvider,
  Paragraph,
  SizableText,
} from "tamagui";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { bottom } = useSafeAreaInsets();
  return (
    <Select value={val} onValueChange={setVal} disablePreventBodyScroll>
      <Select.Trigger iconAfter={ChevronDown} {...triggerProps}>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>

      <Adapt platform="touch">
        <Sheet
          snapPoints={["fit"]}
          snapPointsMode="mixed"
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
          <Select.Group pb={bottom}>
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
              [items],
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

export function MultipleSelectBox<T extends string>({
  val,
  setVal,
  name,
  items,
  placeholder,
  triggerProps = {},
}: {
  val: T[];
  setVal: React.Dispatch<React.SetStateAction<T[]>>;
  name: string;
  items: { name: T }[];
  placeholder: string | undefined;
  triggerProps?: React.ComponentProps<typeof Select.Trigger>;
}) {
  const { bottom } = useSafeAreaInsets();

  const label = useMemo(() => {
    return val.slice().sort().join(", ") || placeholder || "Select an item";
  }, [val, placeholder]);

  const valueListenersRef = useRef<Set<(val: string) => void>>(new Set());

  useEffect(() => {
    setTimeout(() => {
      // need to notify the select items
      // whose values have changed
      valueListenersRef.current.forEach((listener) => listener("selected"));
    }, 0);
  }, [val]);

  return (
    <Select
      value={"selected"}
      onValueChange={() => {}}
      disablePreventBodyScroll
    >
      <OverrideSelectContext selectedItem={label}>
        <Select.Trigger
          // noTextWrap="all"
          // title={<Paragraph>{label}</Paragraph>}
          iconAfter={ChevronDown}
          {...triggerProps}
        >
          <Paragraph flexShrink={1} numberOfLines={1} size="$4">
            {label}
          </Paragraph>
        </Select.Trigger>
      </OverrideSelectContext>

      <Adapt platform="touch">
        <Sheet
          snapPoints={["fit"]}
          snapPointsMode="mixed"
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
          <Select.Group pb={bottom}>
            <Select.Label>{name}</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <OverrideSelectParentContext
                      key={item.name}
                      setOpen={() => {}}
                      onChange={() =>
                        setVal((val) =>
                          val.includes(item.name)
                            ? val.filter((v) => v !== item.name)
                            : [...val, item.name],
                        )
                      }
                      valueSubscribe={(listener) => {
                        valueListenersRef.current.add(listener);
                        return () => {
                          valueListenersRef.current.delete(listener);
                        };
                      }}
                    >
                      <Select.Item
                        index={i}
                        value={
                          val.includes(item.name) ? "selected" : "unselected"
                        }
                      >
                        <Select.ItemText>{item.name}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    </OverrideSelectParentContext>
                  );
                }),
              [items, val],
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

const OverrideSelectParentContext = ({
  children,
  ...overrides
}: Partial<ReturnType<typeof useSelectItemParentContext>> & {
  children: React.ReactNode;
}) => {
  const ctx = useSelectItemParentContext(
    "OverrideSelectParentContext",
    undefined,
  );
  const keys = useMemo(() => Object.keys(overrides).sort(), [overrides]);
  const overriddenCtx = useMemo(
    () => ({ ...ctx, ...overrides }),
    [ctx, ...keys.map((k) => overrides[k as keyof typeof overrides])],
  );

  return (
    <SelectItemParentProvider scope={undefined} {...overriddenCtx}>
      {children}
    </SelectItemParentProvider>
  );
};

const OverrideSelectContext = ({
  children,
  ...overrides
}: Partial<ReturnType<typeof useSelectContext>> & {
  children: React.ReactNode;
}) => {
  const ctx = useSelectContext("OverrideSelectContext", undefined);
  const keys = useMemo(() => Object.keys(overrides).sort(), [overrides]);
  const overriddenCtx = useMemo(
    () => ({ ...ctx, ...overrides }),
    [ctx, ...keys.map((k) => overrides[k as keyof typeof overrides])],
  );

  return (
    <SelectProvider scope={undefined} {...overriddenCtx}>
      {children}
    </SelectProvider>
  );
};
