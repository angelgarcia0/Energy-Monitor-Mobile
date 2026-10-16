import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, useWindowDimensions, View, Pressable } from "react-native";
import { z } from "zod";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { errorMessage } from "@/services/http";
import type { ApplianceType } from "../../data/deviceChartColors";
import {
  APPLIANCE_ICON,
  APPLIANCE_TYPE_IDS,
  applianceTypeIdFor,
  getApplianceLabel,
  getRoomLabel,
  ROOM_KEYS,
  type RoomKey,
} from "../../data/deviceTypes";
import type { DevicesState } from "../../hooks/useDevicesState";
import { styles } from "./LinkDeviceModal.styles";

export interface LinkDeviceModalProps {
  visible: boolean;
  state: DevicesState;
  onClose: () => void;
  /** Se llama solo cuando el módulo quedó registrado. */
  onLinked: () => void;
}

/** `LinkDeviceRequest.deviceCode` es `[A-Za-z0-9]{1,6}`. */
const DEVICE_CODE_MAX = 6;

const linkSchema = z.object({
  deviceCode: z
    .string()
    .trim()
    .min(1, "codeRequired")
    .max(DEVICE_CODE_MAX, "codeMax")
    .regex(/^[A-Za-z0-9]+$/, "codeInvalid"),
});

export function LinkDeviceModal({
  visible,
  state,
  onClose,
  onLinked,
}: LinkDeviceModalProps) {
  const { t } = useTranslation("linkDeviceModal");
  const { height } = useWindowDimensions();
  const { catalog, linkDevice } = state;

  const [deviceCode, setDeviceCode] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [roomKey, setRoomKey] = useState<RoomKey>("livingRoom");
  const [applianceType, setApplianceType] = useState<ApplianceType | null>(null);
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // El formulario manda el `idApplianceType` del catálogo, que es lo que espera
  // `POST /homes/{id}/devices` como clave foránea.
  const applianceTypeId = applianceType
    ? applianceTypeIdFor(applianceType, catalog)
    : undefined;

  const handleClose = () => {
    setDeviceCode("");
    setDeviceName("");
    setRoomKey("livingRoom");
    setApplianceType(null);
    setFieldError("");
    setServerError("");
    onClose();
  };

  const handleSubmit = async () => {
    const parsed = linkSchema.safeParse({ deviceCode });
    if (!parsed.success) {
      setFieldError(t(`errors.${parsed.error.issues[0]?.message ?? "codeRequired"}`));
      return;
    }
    if (!applianceTypeId) {
      setFieldError(t("errors.applianceRequired"));
      return;
    }

    setFieldError("");
    setServerError(null);
    setSubmitting(true);
    try {
      const err = await linkDevice({
        deviceCode: parsed.data.deviceCode.toUpperCase(),
        name:
          deviceName.trim() ||
          getApplianceLabel(t, applianceType ?? "other"),
        applianceTypeId,
        location: roomKey,
      });

      if (err) {
        setServerError(errorMessage(t, err));
        return;
      }
      onLinked();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      title={t("title")}
      footer={
        <>
          <Button variant="secondary" onPress={handleClose} disabled={submitting} style={styles.footerButton}>
            {t("buttons.cancel")}
          </Button>
          <Button
            onPress={handleSubmit}
            disabled={submitting || !applianceType}
            style={styles.footerButton}
          >
            {submitting ? t("buttons.linking") : t("buttons.link")}
          </Button>
        </>
      }
    >
      <ScrollView
        style={[styles.scroll, { maxHeight: height * 0.62 }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={Theme.typography.size.size13}
            color={Theme.colors.warningText}
            style={styles.noticeIcon}
          />
          <Text style={styles.noticeText}>{t("bluetooth.unavailable")}</Text>
        </View>

        <View style={styles.field}>
          <Input
            label={t("code.label")}
            value={deviceCode}
            onChangeText={(text) => {
              setDeviceCode(text.toUpperCase());
              setFieldError("");
            }}
            placeholder={t("code.placeholder")}
            maxLength={DEVICE_CODE_MAX}
            autoCapitalize="characters"
            autoCorrect={false}
            accessibilityLabel={t("code.label")}
          />
          {fieldError ? (
            <Text style={styles.error} accessibilityRole="alert">
              {fieldError}
            </Text>
          ) : (
            // Reserva la línea del error para que el scroll no salte al validar.
            <Text style={styles.errorSlot} />
          )}
          <Text style={styles.hint}>{t("code.hint")}</Text>
        </View>

        <Text style={styles.blockLabel}>{t("appliance.title")}</Text>
        <View style={styles.applianceGrid}>
          {APPLIANCE_TYPE_IDS.map((type) => {
            const selected = type === applianceType;

            return (
              <Pressable
                key={type}
                onPress={() => setApplianceType(type)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={getApplianceLabel(t, type)}
                style={({ pressed }) => [
                  styles.applianceOption,
                  selected && styles.applianceOptionSelected,
                  pressed && styles.applianceOptionPressed,
                ]}
              >
                <View style={styles.applianceIcon}>
                  <MaterialCommunityIcons
                    name={APPLIANCE_ICON[type]}
                    size={Theme.typography.size.size22}
                    color={Theme.colors.primary}
                  />
                </View>
                <Text style={styles.applianceLabel} numberOfLines={2}>
                  {getApplianceLabel(t, type)}
                </Text>
                {selected ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={Theme.typography.size.md}
                    color={Theme.colors.primary}
                    style={styles.applianceCheck}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.field}>
          <Input
            label={`${t("done.nameLabel")} ${t("done.optional")}`}
            value={deviceName}
            onChangeText={setDeviceName}
            placeholder={getApplianceLabel(t, applianceType ?? "other")}
            maxLength={50}
            autoCapitalize="sentences"
            accessibilityLabel={t("done.nameLabel")}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t("done.roomLabel")}</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={roomKey}
              onValueChange={(value) => setRoomKey(String(value) as RoomKey)}
              mode="dropdown"
              enabled={!submitting}
              style={styles.picker}
              dropdownIconColor={Theme.colors.textSecondary}
            >
              {ROOM_KEYS.map((room) => (
                <Picker.Item
                  key={room}
                  label={getRoomLabel(t, room)}
                  value={room}
                  color={Theme.colors.textPrimary}
                />
              ))}
            </Picker>
          </View>
        </View>

        {serverError ? (
          <Text style={styles.error} accessibilityRole="alert">
            {serverError}
          </Text>
        ) : null}
      </ScrollView>
    </Modal>
  );
}