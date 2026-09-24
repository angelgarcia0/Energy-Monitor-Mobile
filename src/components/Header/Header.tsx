import React from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";

import { Breadcrumb, type BreadcrumbItem } from "../Breadcrumb/Breadcrumb";
import { styles } from "./Header.styles";

export interface HeaderProps {
  title?: string;
  breadcrumbItems?: BreadcrumbItem[];
  onActionPress?: () => void;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Header({
  title,
  breadcrumbItems,
  onActionPress,
  actionLabel = "Añadir",
  actionIcon,
  children,
  style,
}: HeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.titleWrapper}>
        {breadcrumbItems && breadcrumbItems.length > 0 ? (
          <Breadcrumb items={breadcrumbItems} />
        ) : (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      <View style={styles.actionsWrapper}>
        {children ? (
          children
        ) : onActionPress ? (
          <Pressable
            onPress={onActionPress}
            accessibilityLabel={actionLabel}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
          >
            {actionIcon}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
