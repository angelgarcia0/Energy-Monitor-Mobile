import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { SelectField } from "@/components/SelectField/SelectField";
import { Theme } from "@/constants/theme";
import { errorMessage } from "@/services/http";
import type { ApplianceType } from "../../../data/deviceChartColors";
import {
  APPLIANCE_ICON,
  APPLIANCE_TYPE_IDS,
  applianceTypeIdFor,
  getApplianceLabel,
  getRoomLabel,
  ROOM_KEYS,
  type Device,
} from "../../../data/deviceTypes";
import type { DevicesState } from "../../../hooks/useDevicesState";
// Mismo aspecto que el asistente de vinculación (la Web reutiliza su CSS).
import { styles } from "../LinkDeviceModal/LinkDeviceModal.styles";
import { stepStyles } from "../LinkDeviceModal/steps.styles";

export interface EditDeviceModalProps {
  visible: boolean;
  state: DevicesState;
  device: Device;
  onClose: () => void;
  onSaved: () => void;
}

/**
 * Edita qué electrodoméstico mide un módulo ya vinculado, su nombre y su
 * ubicación. No toca el módulo: la key y la red siguen igual, así que no pasa
 * por Bluetooth.
 *
 * Una ubicación escrita a mano (que no es de las claves de `ROOM_KEYS`) se
 * conserva como opción del selector, igual que en la Web.
 */
export function EditDeviceModal({
  visible,
  state,
  device,
  onClose,
  onSaved,
}: EditDeviceModalProps) {
  const { t } = useTranslation("linkDeviceModal");
  const { height } = useWindowDimensions();
  const { catalog, updateDevice } = state;

  const [appliance, setAppliance] = useState<ApplianceType>(device.applianceType);
  const [name, setName] = useState(device.name ?? "");
  const customRoom =
    device.roomKey === null && device.location ? device.location : null;
  const [room, setRoom] = useState<string>(
    device.roomKey ?? (device.location || ROOM_KEYS[0]),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roomOptions = [
    ...(customRoom ? [{ value: customRoom, label: customRoom }] : []),
    ...ROOM_KEYS.map((key) => ({ value: key, label: getRoomLabel(t, key) })),
  ];

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    const err = await updateDevice(device.id, {
      name: name.trim(),
      applianceTypeId: applianceTypeIdFor(appliance, catalog),
      location: room,
    });
    setSaving(false);
    if (err) {
      setError(errorMessage(t, err, "deviceEdit"));
      return;
    }
    onSaved();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      title={t("edit.title")}
      footer={
        <>
          <Button variant="secondary" onPress={onClose} disabled={saving} style={styles.footerButton}>
            {t("buttons.cancel")}
          </Button>
          <Button
            onPress={() => void handleSave()}
            disabled={saving || !name.trim()}
            style={styles.footerButton}
          >
            {saving ? t("buttons.saving") : t("edit.save")}
          </Button>
        </>
      }
    >
      <ScrollView
        style={{ maxHeight: height * 0.55 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={stepStyles.block}>
          <Text style={stepStyles.stepTitle}>{t("appliance.title")}</Text>
          <Text style={styles.hint}>{t("edit.hint")}</Text>

          <View style={styles.applianceGrid}>
            {APPLIANCE_TYPE_IDS.map((type) => {
              const selected = type === appliance;
              return (
                <Pressable
                  key={type}
                  onPress={() => setAppliance(type)}
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
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={Theme.typography.size.md}
                      color={Theme.colors.primary}
                      style={styles.applianceCheck}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <Input
            label={t("done.nameLabel")}
            value={name}
            onChangeText={setName}
            placeholder={t("done.nameLabel")}
            maxLength={50}
            autoCapitalize="sentences"
            accessibilityLabel={t("done.nameLabel")}
          />

          <SelectField
            label={t("done.roomLabel")}
            value={room}
            options={roomOptions}
            onChange={setRoom}
          />
        </View>

        {error ? (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}
      </ScrollView>
    </Modal>
  );
}
