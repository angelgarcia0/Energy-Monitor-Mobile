import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./EmptyState.styles";

export type EmptyStateVariant = "full" | "compact";

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  image?: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  variant = "compact",
  image,
  icon,
  title,
  description,
  actions,
  style,
}: EmptyStateProps) {
  const isFull = variant === "full";

  return (
    <View style={[styles.container, isFull && styles.containerFull, style]}>
      {isFull && image ? <View style={styles.image}>{image}</View> : null}
      {!isFull && icon ? <View style={styles.icon}>{icon}</View> : null}

      <Text style={[styles.title, isFull && styles.titleFull]}>{title}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}
