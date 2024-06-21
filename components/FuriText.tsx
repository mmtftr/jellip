// Modified from: https://github.com/eseom/react-native-furi/
// Used under the MIT License

import React from "react";
import {
  FontSizeTokens,
  getFontSize,
  SizeTokens,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from "tamagui";

type FuriWordState = {};

interface FuriWordProps {
  text?: string;
  furi?: string;
  textProps?: TextProps;
  furiStyle?: TextStyle;
  showFuri?: boolean;
}

class FuriWord extends React.Component<FuriWordProps, FuriWordState> {
  render() {
    const value = this.props.text ? this.props.text : "";
    return !this.props.furi ? (
      <View jc="flex-end">
        <Text {...this.props.textProps}>{this.props.text}</Text>
      </View>
    ) : (
      <View jc="flex-end">
        <Text
          style={[
            { textAlign: "center" },
            this.props.showFuri === false ? { opacity: 0 } : {},
          ]}
          {...this.props.furiStyle}
        >
          {this.props.furi ? this.props.furi : " "}
        </Text>
        <View
          style={{
            borderColor: "red",
            borderWidth: 0,
            flexDirection: "row",
            justifyContent: value.length > 1 ? "space-between" : "center",
          }}
        >
          {[...value].map((item, index) => (
            <Text {...this.props.textProps} key={index}>
              {item}
            </Text>
          ))}
        </View>
      </View>
    );
  }
}

type Value = {
  text: string;
  furi?: string;
  showFuri?: boolean;
};

export interface FuriProps {
  value: Value[];
  containerStyle?: ViewStyle;
  textProps?: TextProps;
  furiStyle?: TextStyle;
  size?: number | SizeTokens;
  showFuri?: boolean;
  mode?: string;
}

interface FuriState {}

export default class Furi extends React.Component<FuriProps, FuriState> {
  render() {
    const value = [...this.props.value];
    // const nv = value
    const nv: Value[] = [];
    value.forEach((item) => {
      if (item.furi) nv.push(item);
      else
        [...item.text].forEach((item2) => {
          nv.push({ text: item2, furi: "" });
        });
    });

    const size =
      typeof this.props.size === "number"
        ? this.props.size
        : typeof this.props.size === "string"
        ? getFontSize(this.props.size as FontSizeTokens) ?? 12
        : 12;

    const furiSize = size * 0.6;

    const array =
      this.props.mode === "right"
        ? nv.map((item: Value, index) =>
            item.furi && this.props.showFuri ? (
              <Text key={index}>
                <Text {...this.props.textProps}>{item.text}</Text>
                <Text style={{ fontSize: furiSize }} {...this.props.furiStyle}>
                  {item.furi}
                </Text>
              </Text>
            ) : (
              <Text key={index} {...this.props.textProps}>
                {item.text}
              </Text>
            )
          )
        : nv.map((item: Value, index) =>
            item.text === "\n" ? (
              <View key={index} style={{ width: "100%", height: 10 }} />
            ) : (
              <FuriWord
                key={index}
                text={item.text}
                furi={item.furi}
                textProps={{ fontSize: size, ...this.props.textProps }}
                furiStyle={{ fontSize: furiSize, ...this.props.furiStyle }}
                showFuri={this.props.showFuri}
              />
            )
          );

    return (
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          flexWrap: "wrap",
        }}
        {...this.props.containerStyle}
      >
        {array}
      </View>
    );
  }
}
