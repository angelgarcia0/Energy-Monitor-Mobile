import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import type { UiAlert } from "../../data/alertTypes";
import type { RecommendationItem } from "../../data/notificationsMock";
import { styles } from "./NotificationRow.styles";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function getAlertIcon(type: UiAlert["type"], severity: UiAlert["severity"]): IoniconName {
  if (type === "connectivity") return "cloud-offline-outline";
  if (type === "device") return "hardware-chip-outline";
  if (type === "limit") return "speedometer-outline";
  return severity === "critical" ? "flash-outline" : "warning-outline";
}

export interface AlertRowProps {
  alert: UiAlert;
  formatDate: (isoDate: string) => string;
  /** Avisos informativos: el backend los deja marcar como leídos. */
  onMarkRead?: (id: string) => void;
  onRemove?: (id: string) => void;
  busy?: boolean;
}

export function AlertRow({
  alert,
  formatDate,
  onMarkRead,
  onRemove,
  busy = false,
}: AlertRowProps) {
  const { t } = useTranslation("notifications");
  const critical = alert.severity === "critical";
  const title = t(`${alert.key}.title`, { home: alert.home });
  const message = t(`${alert.key}.message`, { home: alert.home });

  const iconColor = critical
    ? Theme.colors.danger
    : alert.severity === "info"
      ? Theme.colors.infoText
      : Theme.colors.warningText;

  return (
    <View style={[styles.row, alert.resolved && styles.rowMuted]}>
      <View
        style={[
          styles.icon,
          critical
            ? styles.iconCritical
            : alert.severity === "info"
              ? styles.iconInfo
              : styles.iconWarning,
        ]}
      >
        <Ionicons
          name={getAlertIcon(alert.type, alert.severity)}
          size={Theme.typography.size.lg}
          color={iconColor}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.top}>
          <Text style={styles.title}>{title}</Text>
          <Text
            style={[
              styles.badge,
              alert.resolved ? styles.badgeResolved : styles.badgeActive,
            ]}
          >
            {alert.resolved ? t("status.resolved") : t("status.active")}
          </Text>
        </View>

        <Text style={styles.message}>{message}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>{alert.home}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaText}>{formatDate(alert.date)}</Text>
        </View>

        {alert.resolved && alert.autoResolved ? (
          <Text style={styles.hint}>{t(`autoResolveHint.${alert.type}`)}</Text>
        ) : null}

        <View style={styles.actions}>
          {/* Los que el sistema cierra solo no se pueden marcar a mano: el
              backend solo acepta marcar leídas las informativas (`DEVICE`). */}
          {!alert.resolved && !alert.autoResolved && onMarkRead ? (
            <Pressable
              onPress={() => onMarkRead(alert.id)}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={t("markReadLabel", { title })}
              style={styles.markReadButton}
            >
              <Ionicons
                name="checkmark"
                size={Theme.typography.size.sm}
                color={Theme.colors.primary}
              />
              <Text style={styles.markReadLabel}>{t("actions.markRead")}</Text>
            </Pressable>
          ) : null}

          {alert.resolved && onRemove ? (
            <Pressable
              onPress={() => onRemove(alert.id)}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={t("deleteLabel", { title })}
              style={styles.markReadButton}
            >
              <Ionicons
                name="trash-outline"
                size={Theme.typography.size.sm}
                color={Theme.colors.danger}
              />
              <Text style={styles.markReadLabel}>{t("actions.delete")}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export interface RecommendationRowProps {
  recommendation: RecommendationItem;
  formatDate: (isoDate: string) => string;
  onMarkRead: (id: string) => void;
}

export function RecommendationRow({
  recommendation,
  formatDate,
  onMarkRead,
}: RecommendationRowProps) {
  const { t } = useTranslation("notifications");
  const title = t(recommendation.titleKey, { home: recommendation.home });
  const message = t(recommendation.messageKey, { home: recommendation.home });

  return (
    <View style={[styles.row, recommendation.read && styles.rowMuted]}>
      <View style={[styles.icon, styles.iconInfo]}>
        <Ionicons
          name="bulb-outline"
          size={Theme.typography.size.lg}
          color={Theme.colors.infoText}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.top}>
          <Text style={styles.title}>{title}</Text>
          <Text
            style={[
              styles.badge,
              recommendation.read ? styles.badgeRead : styles.badgeNew,
            ]}
          >
            {recommendation.read ? t("status.read") : t("status.new")}
          </Text>
        </View>

        <Text style={styles.message}>{message}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>{recommendation.home}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaText}>{formatDate(recommendation.date)}</Text>
        </View>

        {!recommendation.read ? (
          <Pressable
            onPress={() => onMarkRead(recommendation.id)}
            accessibilityRole="button"
            accessibilityLabel={t("markReadLabel", { title })}
            style={styles.markReadButton}
          >
            <Ionicons
              name="checkmark"
              size={Theme.typography.size.sm}
              color={Theme.colors.primary}
            />
            <Text style={styles.markReadLabel}>{t("actions.markRead")}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}