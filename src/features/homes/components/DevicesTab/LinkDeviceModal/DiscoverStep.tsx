import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import type { DiscoveredModule } from "@/services/devices/ble";
import { signalPercent } from "@/services/devices/ble";
import { stepStyles as styles } from "./steps.styles";

/** Tres barras encendidas según el porcentaje de señal. */
export function SignalBars({ signal }: { signal: number }) {
  const bars = signal >= 75 ? 3 : signal >= 45 ? 2 : 1;
  const heights = [styles.signalBarLow, styles.signalBarMid, styles.signalBarHigh];

  return (
    <View style={styles.signalBars} accessibilityElementsHidden>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.signalBar,
            heights[i],
            i < bars && styles.signalBarActive,
          ]}
        />
      ))}
    </View>
  );
}

/** Enlace secundario, como el de la Web: buscar y volver a buscar. */
function LinkButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        pressed && styles.linkButtonPressed,
        disabled && styles.linkButtonDisabled,
      ]}
    >
      <View style={styles.linkButtonRow}>
        <Ionicons name={icon} size={Theme.typography.size.sm} color={Theme.colors.primary} />
        <Text style={styles.linkButtonLabel}>{label}</Text>
      </View>
    </Pressable>
  );
}

export interface DiscoverStepProps {
  modules: DiscoveredModule[];
  selectedId: string | null;
  scanning: boolean;
  /** Lo que impide seguir: permiso, Bluetooth apagado o un fallo del escaneo. */
  blocked: string | null;
  onSearch: () => void;
  onSelect: (id: string) => void;
}

/**
 * Paso 1: encontrar el módulo por Bluetooth.
 *
 * La Web abre el selector de dispositivos del navegador. Aquí no existe tal
 * selector: el móvil escanea y muestra lo que encuentra, así que la lista es
 * parte de este paso en lugar de un diálogo aparte.
 */
export function DiscoverStep({
  modules,
  selectedId,
  scanning,
  blocked,
  onSearch,
  onSelect,
}: DiscoverStepProps) {
  const { t } = useTranslation("linkDeviceModal");

  if (blocked) {
    return (
      <View style={styles.block}>
        <Text style={styles.stepTitle}>{t("discover.title")}</Text>
        <View style={styles.notice}>
          <Ionicons
            name="warning-outline"
            size={Theme.typography.size.md}
            color={Theme.colors.warningText}
            style={styles.noticeIcon}
          />
          <Text style={styles.noticeText}>{blocked}</Text>
        </View>
        <Text style={styles.stepSubtitle}>{t("discover.portalFallback")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.stepTitle}>{t("discover.title")}</Text>
      <Text style={styles.stepSubtitle}>{t("discover.hint")}</Text>

      {modules.length === 0 ? (
        <View style={styles.scanningBox}>
          <Ionicons
            name={scanning ? "bluetooth" : "search-outline"}
            size={Theme.typography.size.xxl + Theme.spacing.xs}
            color={Theme.colors.primary}
            style={styles.scanningIcon}
          />
          <Text style={styles.scanningText}>
            {scanning ? t("discover.scanning") : t("discover.empty")}
          </Text>
        </View>
      ) : (
        <View style={styles.options}>
          {modules.map((module) => {
            const selected = module.id === selectedId;
            return (
              <Pressable
                key={module.id}
                onPress={() => onSelect(module.id)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={module.name ?? module.id}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <Ionicons
                  name="hardware-chip-outline"
                  size={Theme.typography.size.md}
                  color={Theme.colors.primary}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionName} numberOfLines={1}>
                  {module.name ?? module.id}
                </Text>
                <SignalBars signal={signalPercent(module.rssi)} />
                {selected ? (
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
      )}

      <LinkButton
        icon="search"
        label={modules.length > 0 ? t("discover.rescan") : t("discover.search")}
        onPress={onSearch}
        disabled={scanning}
      />
    </View>
  );
}

/** Barra de progreso de la cabecera, como los `StepDots` de la Web. */
export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.stepDots} accessibilityElementsHidden>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.stepDot, current >= i && styles.stepDotActive]} />
      ))}
    </View>
  );
}

export { LinkButton };