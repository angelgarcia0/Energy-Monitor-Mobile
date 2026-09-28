import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import { styles } from "./AvatarSection.styles";

const AVATAR_SIZE = Theme.spacing.xl * 4;

export interface AvatarSectionProps {
  avatarUri: string | null;
  onPickAvatar: (uri: string) => void;
  onRemoveAvatar: () => void;
  onPermissionDenied: () => void;
}

export function AvatarSection({
  avatarUri,
  onPickAvatar,
  onRemoveAvatar,
  onPermissionDenied,
}: AvatarSectionProps) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const closeOptions = () => setOptionsOpen(false);

  const handlePick = async () => {
    closeOptions();

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      onPermissionDenied();
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      onPickAvatar(result.assets[0].uri);
    }
  };

  const handleView = () => {
    closeOptions();
    setViewerOpen(true);
  };

  const handleRemove = () => {
    closeOptions();
    onRemoveAvatar();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setOptionsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Cambiar foto de perfil"
        style={({ pressed }) => [styles.avatar, pressed && styles.avatarPressed]}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <Ionicons
            name="person-outline"
            size={Theme.typography.size.xxxl}
            color={Theme.colors.textSecondary}
          />
        )}
        <View style={styles.avatarBadge}>
          <Ionicons
            name="camera"
            size={Theme.typography.size.sm}
            color={Theme.colors.surface}
          />
        </View>
      </Pressable>

      <Text style={styles.hint}>Toca la foto para ver las opciones</Text>

      <Modal
        visible={optionsOpen}
        transparent
        animationType="fade"
        onRequestClose={closeOptions}
      >
        <Pressable style={styles.backdrop} onPress={closeOptions}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />

            <OptionRow
              icon="image-outline"
              label="Agregar foto"
              onPress={handlePick}
            />
            <OptionRow
              icon="eye-outline"
              label="Ver foto"
              onPress={handleView}
              disabled={!avatarUri}
            />
            <OptionRow
              icon="trash-outline"
              label="Eliminar"
              onPress={handleRemove}
              disabled={!avatarUri}
              danger
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={viewerOpen}
        animationType="fade"
        onRequestClose={() => setViewerOpen(false)}
      >
        <View style={styles.viewer}>
          <Pressable
            onPress={() => setViewerOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Cerrar foto"
            style={styles.viewerClose}
          >
            <Ionicons
              name="close"
              size={Theme.typography.size.xl}
              color={Theme.colors.surface}
            />
          </Pressable>

          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.viewerImage}
              resizeMode="contain"
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

interface OptionRowProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
}

function OptionRow({ icon, label, onPress, disabled, danger }: OptionRowProps) {
  const color = danger ? Theme.colors.danger : Theme.colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.option,
        pressed && !disabled && styles.optionPressed,
        disabled && styles.optionDisabled,
      ]}
    >
      <Ionicons
        name={icon}
        size={Theme.typography.size.lg}
        color={disabled ? Theme.colors.textSecondary : color}
      />
      <Text
        style={[
          styles.optionText,
          danger && styles.optionTextDanger,
          disabled && styles.optionTextDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export { AVATAR_SIZE };
