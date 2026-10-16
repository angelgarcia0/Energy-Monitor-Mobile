import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { Input } from "@/components/Input/Input";
import { Theme } from "@/constants/theme";
import { signalPercent, type ScannedNetwork } from "@/services/devices/ble";
import { LinkButton, SignalBars } from "./DiscoverStep";
import { stepStyles as styles } from "./steps.styles";

export interface NetworkStepProps {
  networks: ScannedNetwork[];
  selected: ScannedNetwork | null;
  scanning: boolean;
  /** Nombre escrito a mano, para redes ocultas. */
  manual: boolean;
  manualSsid: string;
  password: string;
  onSelect: (network: ScannedNetwork | null) => void;
  onToggleManual: () => void;
  onManualSsid: (value: string) => void;
  onPassword: (value: string) => void;
  onRescan: () => void;
}

/**
 * Paso 3: la red que ve el módulo.
 *
 * La lista la produce el ESP32, no el teléfono: el móvil le pide el escaneo por
 * Bluetooth y lo lee. Por eso no hace falta ningún permiso de Wi-Fi.
 */
export function NetworkStep({
  networks,
  selected,
  scanning,
  manual,
  manualSsid,
  password,
  onSelect,
  onToggleManual,
  onManualSsid,
  onPassword,
  onRescan,
}: NetworkStepProps) {
  const { t } = useTranslation("linkDeviceModal");
  const [showPassword, setShowPassword] = useState(false);

  const ssid = manual ? manualSsid.trim() : (selected?.ssid ?? "");
  // Escribirla a mano siempre pide clave: la red puede estar oculta.
  const needsPassword = manual || !!selected?.secured;

  return (
    <View style={styles.block}>
      <Text style={styles.stepTitle}>{t("network.title")}</Text>
      <Text style={styles.stepSubtitle}>{t("network.subtitle")}</Text>

      {scanning ? (
        <View style={styles.scanningBox}>
          <Ionicons
            name="wifi"
            size={Theme.typography.size.xxl + Theme.spacing.xs}
            color={Theme.colors.primary}
            style={styles.scanningIcon}
          />
          <Text style={styles.scanningText}>{t("network.scanning")}</Text>
        </View>
      ) : !manual ? (
        networks.length === 0 ? (
          <View style={styles.scanningBox}>
            <Ionicons
              name="cloud-offline-outline"
              size={Theme.typography.size.xxl + Theme.spacing.xs}
              color={Theme.colors.border}
              style={styles.scanningIcon}
            />
            <Text style={styles.scanningText}>{t("network.empty")}</Text>
          </View>
        ) : (
          <View style={styles.options}>
            {networks.map((network) => {
              const isSelected = selected?.ssid === network.ssid;
              return (
                <Pressable
                  key={network.ssid}
                  onPress={() => onSelect(isSelected ? null : network)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={network.ssid}
                  style={[styles.option, isSelected && styles.optionSelected]}
                >
                  <SignalBars signal={signalPercent(network.rssi)} />
                  <Text style={styles.optionName} numberOfLines={1}>
                    {network.ssid}
                  </Text>
                  {network.secured ? (
                    <Ionicons
                      name="lock-closed-outline"
                      size={Theme.typography.size.sm}
                      color={Theme.colors.textSecondary}
                    />
                  ) : (
                    <Text style={styles.optionTag}>{t("network.open")}</Text>
                  )}
                  {isSelected ? (
                    <Ionicons
                      name="checkmark"
                      size={Theme.typography.size.md}
                      color={Theme.colors.primary}
                      style={styles.optionCheck}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        )
      ) : (
        <Input
          label={t("network.ssidLabel")}
          value={manualSsid}
          onChangeText={onManualSsid}
          placeholder={t("network.ssidPlaceholder")}
          maxLength={32}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={t("network.ssidLabel")}
        />
      )}

      {!scanning ? (
        <View style={styles.linkActions}>
          <LinkButton icon="search" label={t("network.rescan")} onPress={onRescan} />
          <LinkButton
            icon={manual ? "list-outline" : "create-outline"}
            label={manual ? t("network.pickFromList") : t("network.manual")}
            onPress={onToggleManual}
          />
        </View>
      ) : null}

      {needsPassword && ssid ? (
        <Input
          label={t("network.passwordLabel")}
          value={password}
          onChangeText={onPassword}
          placeholder={t("network.passwordPlaceholder")}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={t("network.passwordLabel")}
          icon={
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={Theme.typography.size.md}
              color={Theme.colors.textSecondary}
            />
          }
          onIconPress={() => setShowPassword((value) => !value)}
        />
      ) : null}
    </View>
  );
}