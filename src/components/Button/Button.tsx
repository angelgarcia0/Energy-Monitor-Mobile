import React from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./Button.styles";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Nombre accesible cuando el texto visible no basta (p. ej. "Eliminar Casa 1"). */
  accessibilityLabel?: string;
}

/** Los tamaños pequeño y mediano quedan por debajo de 44 pt: el toque se amplía sin cambiar el diseño. */
const HIT_SLOP: Record<ButtonSize, number> = { small: 10, medium: 6, large: 0 };

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  icon,
  style,
  accessibilityLabel,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={HIT_SLOP[size]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`]]}>
        {children}
      </Text>
    </Pressable>
  );
}
