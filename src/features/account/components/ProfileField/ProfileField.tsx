import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import { styles } from "./ProfileField.styles";

export interface ProfileFieldProps {
  label: string;
  value: string;
  /** Texto ya traducido para el accessibilityLabel del botón de edición. */
  editAccessibilityLabel: string;
  onEdit: () => void;
}

export function ProfileField({
  label,
  value,
  editAccessibilityLabel,
  onEdit,
}: ProfileFieldProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      </View>

      <Pressable
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel={editAccessibilityLabel}
        style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
      >
        <Ionicons
          name="create-outline"
          size={Theme.typography.size.md}
          color={Theme.colors.primary}
        />
      </Pressable>
    </View>
  );
}
