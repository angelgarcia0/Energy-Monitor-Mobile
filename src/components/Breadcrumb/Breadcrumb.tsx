import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import { styles } from "./Breadcrumb.styles";

export interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items.length) return null;

  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View key={`${item.label}-${index}`} style={styles.item}>
            {item.onPress && !isLast ? (
              <Pressable
                onPress={item.onPress}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.link,
                  pressed && styles.linkPressed,
                ]}
              >
                <Text style={styles.linkText} numberOfLines={1}>
                  {item.label}
                </Text>
              </Pressable>
            ) : (
              <Text style={styles.current} numberOfLines={1}>
                {item.label}
              </Text>
            )}

            {!isLast && (
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Theme.colors.textSecondary}
                style={styles.separator}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
