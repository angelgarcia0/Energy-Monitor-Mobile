import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Modal, Pressable, Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import { styles } from "./AvatarSection.styles";

const AVATAR_SIZE = Theme.spacing.xl * 4;

export interface AvatarSectionProps {
  avatarUri: string | null;
  /** Recibe un data-URL, que es lo que guarda `user.profile_image`. */
  onPickAvatar: (dataUrl: string) => void;
  onRemoveAvatar: () => void;
  onPermissionDenied: () => void;
}

export function AvatarSection({
  avatarUri,
  onPickAvatar,
  onRemoveAvatar,
  onPermissionDenied,
}: AvatarSectionProps) {
  const { t } = useTranslation("account");
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

    // El backend guarda el avatar en `user.profile_image` (MEDIUMTEXT), así que
    // viaja como data-URL y no como la URI del archivo del dispositivo: una
    // `file://` no le sirve a nadie más que a esta app. La Web redimensiona antes
    // de convertir; aquí se pide la imagen ya comprimida al picker para no subir
    // el archivo entero.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    const asset = result.canceled ? null : result.assets[0];
    if (asset?.base64) {
      onPickAvatar(`data:image/jpeg;base64,${asset.base64}`);
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
        accessibilityLabel={t("avatarChangeLabel")}
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
            color={Theme.colors.onBrand}
          />
        </View>
      </Pressable>

      <Text style={styles.hint}>{t("avatarHint")}</Text>

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
              label={t("addPhoto")}
              onPress={handlePick}
            />
            <OptionRow
              icon="eye-outline"
              label={t("viewPhoto")}
              onPress={handleView}
              disabled={!avatarUri}
            />
            <OptionRow
              icon="trash-outline"
              label={t("delete")}
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
            accessibilityLabel={t("closePhoto")}
            style={styles.viewerClose}
          >
            <Ionicons
              name="close"
              size={Theme.typography.size.xl}
              color={Theme.colors.onBrand}
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
