import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
  const critical = alert.severity === "critical";

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
          <Text style={styles.title}>{alert.title}</Text>
          <Text
            style={[
              styles.badge,
              alert.resolved ? styles.badgeResolved : styles.badgeActive,
            ]}
          >
            {alert.resolved ? "Resuelta" : "Activa"}
          </Text>
        </View>

        <Text style={styles.message}>{alert.message}</Text>

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
          <Text style={styles.title}>{recommendation.title}</Text>
          <Text
            style={[
              styles.badge,
              recommendation.read ? styles.badgeRead : styles.badgeNew,
            ]}
          >
            {recommendation.read ? "Leída" : "Nueva"}
          </Text>
        </View>

        <Text style={styles.message}>{recommendation.message}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>{recommendation.home}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaText}>{formatDate(recommendation.date)}</Text>
        </View>

        {!recommendation.read ? (
          <Pressable
            onPress={() => onMarkRead(recommendation.id)}
            accessibilityRole="button"
            accessibilityLabel={`Marcar leída: ${recommendation.title}`}
            style={styles.markReadButton}
          >
            <Ionicons
              name="checkmark"
              size={Theme.typography.size.sm}
              color={Theme.colors.primary}
            />
            <Text style={styles.markReadLabel}>Marcar leída</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
