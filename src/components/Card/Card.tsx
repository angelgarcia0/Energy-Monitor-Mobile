import React from "react";
import { View, Pressable, StyleProp, ViewStyle } from "react-native";
import { styles } from "./Card.styles";

export type CardVariant = "default" | "soft" | "selected";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: CardVariant;
  padding?: CardPadding;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  onPress,
  variant = "default",
  padding = "md",
  style,
}: CardProps) {
  const baseStyles: StyleProp<ViewStyle> = [
    styles.base,
    styles[`padding_${padding}`],
    styles[`variant_${variant}`],
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [baseStyles, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={baseStyles}>{children}</View>;
}