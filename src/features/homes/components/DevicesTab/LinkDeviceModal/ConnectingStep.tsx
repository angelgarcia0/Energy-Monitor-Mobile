import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import { stepStyles as styles } from "./steps.styles";

/**
 * Fases de la conexión. Cada estado del módulo cierra las anteriores, igual que
 * en la Web: el progreso no es inventado, viene de las notificaciones `STATUS`.
 */
export const PROGRESS = {
  registering: 0,
  sending: 1,
  wifi_connecting: 1,
  wifi_ok: 2,
  mqtt_connecting: 2,
  mqtt_ok: 3,
} as const;

export type ProgressKey = keyof typeof PROGRESS;

/** Un fallo del módulo: se vuelve a la red o se reintenta. */
export function isFailureStatus(status: string): boolean {
  return (
    status.startsWith("wifi_failed") ||
    status.startsWith("mqtt_failed") ||
    status === "bad_config"
  );
}

export interface ConnectingStepProps {
  progress: number;
  failed: boolean;
  ssid: string;
}

/** Paso 4: el módulo se conecta al Wi-Fi y al broker. */
export function ConnectingStep({ progress, failed, ssid }: ConnectingStepProps) {
  const { t } = useTranslation("linkDeviceModal");

  const items = [
    t("connecting.step0"),
    t("connecting.step1", { ssid }),
    t("connecting.step2"),
    t("connecting.step3"),
  ];

  return (
    <View style={styles.block}>
      <View style={styles.connectingBox}>
        {failed ? (
          <Ionicons
            name="warning-outline"
            size={Theme.typography.size.xxl + Theme.spacing.lg}
            color={Theme.colors.danger}
            style={styles.connectingFailedIcon}
          />
        ) : (
          <Ionicons
            name="sync-outline"
            size={Theme.typography.size.xxl + Theme.spacing.lg}
            color={Theme.colors.primary}
            style={styles.connectingSpinner}
          />
        )}

        <Text style={styles.stepTitle}>{t("connecting.title")}</Text>

        <View style={styles.connectingList}>
          {items.map((label, i) => {
            const done = progress > i;
            const active = progress === i;
            return (
              <View key={label} style={styles.connectingItem}>
                <View style={[styles.connectingDot, active && styles.connectingDotDone]}>
                  {done ? (
                    <Ionicons
                      name="checkmark"
                      size={Theme.typography.size.size11}
                      color={Theme.colors.primary}
                      style={styles.connectingDotIcon}
                    />
                  ) : null}
                </View>
                <Text
                  style={
                    done || active ? styles.connectingLabelDone : styles.connectingLabelPending
                  }
                  numberOfLines={2}
                >
                  {label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

/** Paso 5: listo. */
export function DoneStep({ deviceName }: { deviceName: string }) {
  const { t } = useTranslation("linkDeviceModal");

  return (
    <View style={styles.block}>
      <View style={styles.doneBox}>
        <Ionicons
          name="checkmark-circle"
          size={Theme.typography.size.xxl * 2}
          color={Theme.colors.success}
          style={styles.doneIcon}
        />
        <Text style={styles.stepTitle}>{t("done.title")}</Text>
        <Text style={styles.stepSubtitle}>{t("done.subtitle", { name: deviceName })}</Text>
      </View>
    </View>
  );
}