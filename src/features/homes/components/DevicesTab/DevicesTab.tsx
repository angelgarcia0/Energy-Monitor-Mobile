import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Loader } from "@/components/Loader/Loader";
import { Theme } from "@/constants/theme";
import { errorMessage } from "@/services/http";
import {
  APPLIANCE_ICON,
  getApplianceLabel,
  getLocationLabel,
  type Device,
} from "../../data/deviceTypes";
import type { DevicesState } from "../../hooks/useDevicesState";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { LinkDeviceModal } from "./LinkDeviceModal";
import { styles } from "./DevicesTab.styles";

export interface DevicesTabProps {
  state: DevicesState;
  isOwner: boolean;
}

function getSignalColor(signal: number) {
  if (signal >= 70) return Theme.colors.success;
  if (signal >= 35) return Theme.colors.warningText;
  return Theme.colors.danger;
}

interface DeviceRowProps {
  device: Device;
  isOwner: boolean;
  removing: boolean;
  onRequestRemove: (device: Device) => void;
}

function DeviceRow({ device, isOwner, removing, onRequestRemove }: DeviceRowProps) {
  const { t } = useTranslation("devices");
  const isOnline = device.status === "online";
  const isChecking = device.status === "checking";
  const deviceName = device.name.trim() || getApplianceLabel(t, device.applianceType);
  const signalColor = isOnline ? getSignalColor(device.signal) : Theme.colors.textSecondary;

  return (
    <View style={styles.deviceRow}>
      <View
        style={[
          styles.deviceIcon,
          isOnline ? styles.deviceIconOnline : styles.deviceIconOffline,
        ]}
      >
        <MaterialCommunityIcons
          name={APPLIANCE_ICON[device.applianceType]}
          size={Theme.typography.size.size22}
          color={isOnline ? Theme.colors.primary : Theme.colors.textSecondary}
        />
      </View>

      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName} numberOfLines={1}>
          {deviceName}
        </Text>
        <Text style={styles.deviceRoom} numberOfLines={1}>
          {getLocationLabel(t, device)}
        </Text>
      </View>

      <View style={styles.deviceMeta}>
        <View
          style={[
            styles.statusBadge,
            isOnline
              ? styles.statusBadgeOnline
              : isChecking
                ? styles.statusBadgeOffline
                : styles.statusBadgeOffline,
          ]}
        >
          <Ionicons
            name={isOnline ? "wifi" : "cloud-offline-outline"}
            size={Theme.typography.size.xs}
            color={isOnline ? signalColor : Theme.colors.danger}
          />
          <Text
            style={[
              styles.statusText,
              isOnline ? styles.statusTextOnline : styles.statusTextOffline,
            ]}
          >
            {isOnline
              ? t("status.online")
              : isChecking
                ? t("status.checking")
                : t("status.offline")}
          </Text>
        </View>

        {device.consumption != null ? (
          <Text style={styles.consumption}>{device.consumption.toFixed(2)} kW</Text>
        ) : null}
      </View>

      {isOwner ? (
        <PressableDelete
          deviceName={deviceName}
          disabled={removing}
          onPress={() => onRequestRemove(device)}
        />
      ) : null}
    </View>
  );
}

interface PressableDeleteProps {
  deviceName: string;
  disabled: boolean;
  onPress: () => void;
}

function PressableDelete({ deviceName, disabled, onPress }: PressableDeleteProps) {
  const { t } = useTranslation("devices");

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={t("deleteLabel", { name: deviceName })}
      style={({ pressed }) => [
        styles.deleteButton,
        pressed && styles.deleteButtonPressed,
      ]}
    >
      <Ionicons
        name="trash-outline"
        size={Theme.typography.size.md}
        color={Theme.colors.danger}
      />
    </Pressable>
  );
}

export function DevicesTab({ state, isOwner }: DevicesTabProps) {
  const { t } = useTranslation("devices");
  const { devices, loading, error, reload, unlinkDevice } = state;
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const onlineCount = devices.filter((device) => device.status === "online").length;

  const handleConfirmDelete = async () => {
    if (!deviceToDelete) return;
    setRemoving(true);
    setRemoveError(null);
    try {
      const err = await unlinkDevice(deviceToDelete.id);
      if (err) {
        setRemoveError(errorMessage(t, err));
        return;
      }
      setDeviceToDelete(null);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{t("header.title")}</Text>
            <Text style={styles.subtitle}>
              {t("header.subtitle", { online: onlineCount, total: devices.length })}
            </Text>
          </View>

          {isOwner ? (
            <Button
              size="small"
              onPress={() => setLinkModalOpen(true)}
              icon={
                <Ionicons
                  name="add"
                  size={Theme.typography.size.md}
                  color={Theme.colors.onBrand}
                />
              }
            >
              {t("actions.link")}
            </Button>
          ) : null}
        </View>

        {loading ? <Loader text={t("state.loading")} /> : null}

        {error ? (
          <View style={styles.emptyState}>
            <Text style={styles.removeError} accessibilityRole="alert">
              {errorMessage(t, error)}
            </Text>
            <Button variant="secondary" onPress={() => void reload()}>
              {t("state.retry")}
            </Button>
          </View>
        ) : null}

        {!loading && !error ? (
          <Card padding="none" style={styles.card}>
            {devices.length === 0 ? (
              <EmptyState
                icon={
                  <Ionicons
                    name="cloud-offline-outline"
                    size={Theme.typography.size.xxl}
                    color={Theme.colors.border}
                  />
                }
                title={t("empty.title")}
                description={
                  isOwner ? t("empty.subtitle") : t("empty.subtitleReadOnly")
                }
                actions={
                  isOwner ? (
                    <Button size="small" onPress={() => setLinkModalOpen(true)}>
                      {t("empty.cta")}
                    </Button>
                  ) : undefined
                }
                style={styles.emptyState}
              />
            ) : (
              devices.map((device, index) => (
                <View key={device.id}>
                  <DeviceRow
                    device={device}
                    isOwner={isOwner}
                    removing={removing}
                    onRequestRemove={setDeviceToDelete}
                  />
                  {index < devices.length - 1 ? <View style={styles.divider} /> : null}
                </View>
              ))
            )}
          </Card>
        ) : null}

        {removeError ? (
          <Text style={styles.removeError} accessibilityRole="alert">
            {removeError}
          </Text>
        ) : null}
      </ScrollView>

      {linkModalOpen && isOwner ? (
        <LinkDeviceModal
          visible
          state={state}
          onClose={() => setLinkModalOpen(false)}
          onLinked={() => setLinkModalOpen(false)}
        />
      ) : null}

      {deviceToDelete ? (
        <ConfirmDeleteModal
          visible
          device={deviceToDelete}
          removing={removing}
          onCancel={() => setDeviceToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </>
  );
}