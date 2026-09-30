import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import type {
  AlertItem,
  RecommendationItem,
} from "../../data/notificationsMock";
import { styles } from "./NotificationRow.styles";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function getAlertIcon(alert: AlertItem): IoniconName {
  if (alert.type === "connectivity") return "cloud-offline-outline";
  return alert.severity === "critical" ? "flash-outline" : "warning-outline";
}

export interface AlertRowProps {
  alert: AlertItem;
  formatDate: (isoDate: string) => string;
}

export function AlertRow({ alert, formatDate }: AlertRowProps) {
  const { t } = useTranslation("notifications");
  const critical = alert.severity === "critical";
  const title = t(`${alert.titleKey}`, { home: alert.home });
  const message = t(`${alert.messageKey}`, { home: alert.home });

  return (
    <View style={[styles.row, alert.resolved && styles.rowMuted]}>
      <View
        style={[
          styles.icon,
          critical ? styles.iconCritical : styles.iconWarning,
        ]}
      >
        <Ionicons
          name={getAlertIcon(alert)}
          size={Theme.typography.size.lg}
          color={critical ? Theme.colors.danger : Theme.colors.warningText}
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
