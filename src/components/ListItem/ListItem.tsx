import React from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./ListItem.styles";

export type ListItemBadgeVariant = "success" | "warning" | "danger" | "info";

export interface ListItemProps {
  leading?: React.ReactNode;
  avatarText?: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: ListItemBadgeVariant;
  actionIcon?: React.ReactNode;
  onPress?: () => void;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ListItem({
  leading,
  avatarText,
  title,
  subtitle,
  badgeText,
  badgeVariant = "info",
  actionIcon,
  onPress,
  onActionPress,
  style,
}: ListItemProps) {
  const content = (
    <>
      {leading ? (
        <View style={styles.leadingWrapper}>{leading}</View>
      ) : avatarText ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarText}</Text>
        </View>
      ) : null}

      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {badgeText ? (
        <View style={[styles.badge, styles[`badge_${badgeVariant}`]]}>
          <Text style={[styles.badgeText, styles[`badgeText_${badgeVariant}`]]}>
            {badgeText}
          </Text>
        </View>
      ) : null}

      {actionIcon ? (
        <Pressable onPress={onActionPress} style={styles.actionButton}>
          {actionIcon}
        </Pressable>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.container, pressed && styles.pressed, style]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.container, style]}>{content}</View>;
}
