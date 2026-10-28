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
      {/* La imagen manda en la variante completa; sin ella se usa el ícono en cualquier variante
          (antes un ícono con `variant="full"` no se mostraba). */}
      {isFull && image ? (
        <View style={styles.image}>{image}</View>
      ) : icon ? (
        <View style={styles.icon}>{icon}</View>
      ) : null}

      <Text style={[styles.title, isFull && styles.titleFull]} accessibilityRole="header">
        {title}
      </Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}
