import React from "react";
import { ActivityIndicator, StyleProp, Text, View, ViewStyle } from "react-native";
import { Theme } from "../../constants/theme";
import { styles } from "./Loader.styles";

export type LoaderSize = "small" | "large";

export interface LoaderProps {
  text?: string;
  size?: LoaderSize;
  style?: StyleProp<ViewStyle>;
}

export function Loader({ text, size = "large", style }: LoaderProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={Theme.colors.primary} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
}
