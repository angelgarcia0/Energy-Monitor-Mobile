import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./Alert.styles";

export type AlertVariant = "success" | "warning" | "danger" | "info";

export interface AlertProps {
  variant: AlertVariant;
  title: string;
  message?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Alert({ variant, title, message, icon, right, style }: AlertProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconCircle, styles[`icon_${variant}`]]}>{icon}</View>

      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {message ? (
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        ) : null}
      </View>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}
