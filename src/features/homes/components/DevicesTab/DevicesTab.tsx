import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Theme } from "@/constants/theme";
import {
  APPLIANCE_ICON,
  getApplianceLabel,
  getRoomLabel,
  type Device,
} from "../../data/deviceMocks";
import type { NewDeviceInput } from "../../hooks/useDevicesState";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { LinkDeviceModal } from "./LinkDeviceModal";
import { styles } from "./DevicesTab.styles";

export interface DevicesTabProps {
  devices: Device[];
  onAddDevice: (device: NewDeviceInput) => void;
  onRemoveDevice: (deviceId: number) => void;
  isOwner: boolean;
}

interface DeviceRowProps {
  device: Device;
  isOwner: boolean;
  onRequestRemove: (device: Device) => void;
}

function getSignalColor(signal: number) {
  if (signal >= 70) return Theme.colors.success;
  if (signal >= 35) return Theme.colors.warningText;
  return Theme.colors.danger;
}

function DeviceRow({ device, isOwner, onRequestRemove }: DeviceRowProps) {
  const { t } = useTranslation("devices");
  const isOnline = device.status === "online";
  const deviceName =
    device.name?.trim() || getApplianceLabel(t, device.applianceType);
  const signalColor = isOnline ? getSignalColor(device.signal) : Theme.colors.textSecondary;

  return (
    <View style={styles.deviceRow}>
      <View style={[styles.deviceIcon, isOnline ? styles.deviceIconOnline : styles.deviceIconOffline]}>
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
        <Text style={styles.deviceRoom}>{getRoomLabel(t, device.roomKey)}</Text>
      </View>

      <View style={styles.deviceMeta}>
        <View
          style={[
            styles.statusBadge,
            isOnline ? styles.statusBadgeOnline : styles.statusBadgeOffline,
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
            {isOnline ? t("status.online") : t("status.offline")}
          </Text>
        </View>

        {device.consumption != null ? (
          <Text style={styles.consumption}>{device.consumption.toFixed(2)} kW</Text>
        ) : null}
      </View>

      {isOwner ? (
        <PressableDelete
          deviceName={deviceName}
          onPress={() => onRequestRemove(device)}
        />
      ) : null}
    </View>
  );
}

interface PressableDeleteProps {
  deviceName: string;
  onPress: () => void;
}

function PressableDelete({ deviceName, onPress }: PressableDeleteProps) {
  const { t } = useTranslation("devices");

  return (
    <Pressable
      onPress={onPress}
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

export function DevicesTab({
  devices,
  onAddDevice,
  onRemoveDevice,
  isOwner,
}: DevicesTabProps) {
  const { t } = useTranslation("devices");
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  const onlineCount = devices.filter((device) => device.status === "online").length;

  const openLinkModal = () => setLinkModalOpen(true);

  const handleConfirmDelete = () => {
    if (deviceToDelete) onRemoveDevice(deviceToDelete.id);
    setDeviceToDelete(null);
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
              onPress={openLinkModal}
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
                  <Button size="small" onPress={openLinkModal}>
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
                  onRequestRemove={setDeviceToDelete}
                />
                {index < devices.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))
          )}
        </Card>
      </ScrollView>

      {linkModalOpen && isOwner ? (
        <LinkDeviceModal
          visible
          onClose={() => setLinkModalOpen(false)}
          onAddDevice={(device) => {
            onAddDevice(device);
            setLinkModalOpen(false);
          }}
        />
      ) : null}

      {deviceToDelete ? (
        <ConfirmDeleteModal
          visible
          device={deviceToDelete}
          onCancel={() => setDeviceToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </>
  );
}
