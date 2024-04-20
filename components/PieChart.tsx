import React from "react";
import { PieChart as SVGPieChart } from "react-native-svg-charts";
import { View, styled } from "tamagui";

const SPieChart = styled(SVGPieChart);
export const PieChart = ({
  data,
}: {
  data: { value: number; color: string }[];
}) => {
  const pieData = data
    .filter(({ value }) => value > 0)
    .map(({ value, color }, index) => ({
      value,
      svg: {
        fill: color,
        onPress: () => {},
      },
      key: `pie-${index}`,
    }));
  return (
    <SVGPieChart
      padAngle={0}
      data={pieData}
      innerRadius={0}
      style={{ flex: 1 }}
    />
  );
};
