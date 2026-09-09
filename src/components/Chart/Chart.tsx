import React from "react";
import { Dimensions, StyleProp, View, ViewStyle } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Theme } from "../../constants/theme";
import { styles } from "./Chart.styles";

export type ChartType = "area" | "bar" | "pie";

export interface ChartDataset {
  data: number[];
  color?: (opacity: number) => string;
  strokeWidth?: number;
}

export interface ChartSeriesData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartPieSlice {
  name: string;
  value: number;
  color: string;
}

export type ChartProps =
  | {
      type: "area" | "bar";
      data: ChartSeriesData;
      height?: number;
      width?: number;
      style?: StyleProp<ViewStyle>;
    }
  | {
      type: "pie";
      data: ChartPieSlice[];
      height?: number;
      width?: number;
      style?: StyleProp<ViewStyle>;
    };

function hexToRgba(hex: string, opacity: number) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const screenWidth = Dimensions.get("window").width;
const defaultWidth = screenWidth - Theme.spacing.md * 2;

const baseChartConfig = {
  backgroundColor: Theme.colors.surface,
  backgroundGradientFrom: Theme.colors.surface,
  backgroundGradientTo: Theme.colors.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => hexToRgba(Theme.colors.primary, opacity),
  labelColor: (opacity = 1) => hexToRgba(Theme.colors.textSecondary, opacity),
  propsForBackgroundLines: {
    stroke: Theme.colors.border,
    strokeDasharray: "3 3",
  },
  propsForLabels: {
    fontSize: Theme.typography.size.size11,
    fontFamily: Theme.typography.fontPrimary,
  },
};

export function Chart(props: ChartProps) {
  const height = props.height ?? 220;
  const width = props.width ?? defaultWidth;

  return (
    <View style={[styles.container, props.style]}>
      {props.type === "pie" ? (
        <PieChart
          data={props.data.map((slice) => ({
            name: slice.name,
            population: slice.value,
            color: slice.color,
            legendFontColor: Theme.colors.textSecondary,
            legendFontSize: Theme.typography.size.size11,
          }))}
          width={width}
          height={height}
          chartConfig={baseChartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"
        />
      ) : props.type === "bar" ? (
        <BarChart
          data={props.data}
          width={width}
          height={height}
          chartConfig={baseChartConfig}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
        />
      ) : (
        <LineChart
          data={props.data}
          width={width}
          height={height}
          bezier
          chartConfig={{
            ...baseChartConfig,
            fillShadowGradient: Theme.colors.primary,
            fillShadowGradientOpacity: 0.15,
          }}
          withShadow={false}
        />
      )}
    </View>
  );
}
