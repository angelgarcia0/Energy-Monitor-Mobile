export type AlertSeverity = "critical" | "warning";
export type AlertType = "threshold" | "connectivity";

export interface AlertItem {
  id: string;
  kind: "alert";
  type: AlertType;
  severity: AlertSeverity;
  titleKey: string;
  messageKey: string;
  home: string;
  date: string;
  resolved: boolean;
}

export interface RecommendationItem {
  id: string;
  kind: "recommendation";
  titleKey: string;
  messageKey: string;
  home: string;
  date: string;
  read: boolean;
}

export type NotificationItem = AlertItem | RecommendationItem;

/**
 * Las alertas y recomendaciones guardan la key del locale en vez del texto ya
 * escrito, para que el contenido se traduzca junto con la pantalla.
 */
export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "a1",
    kind: "alert",
    type: "threshold",
    severity: "critical",
    titleKey: "threshold.dailyExceeded.title",
    messageKey: "threshold.dailyExceeded.message",
    home: "Casa Principal",
    date: "2026-07-07T09:12:00",
    resolved: false,
  },
  {
    id: "a2",
    kind: "alert",
    type: "connectivity",
    severity: "warning",
    titleKey: "connectivity.deviceOffline.title",
    messageKey: "connectivity.deviceOffline.message",
    home: "Casa Principal",
    date: "2026-07-06T22:40:00",
    resolved: false,
  },
  {
    id: "a3",
    kind: "alert",
    type: "threshold",
    severity: "warning",
    titleKey: "threshold.monthlyApproaching.title",
    messageKey: "threshold.monthlyApproaching.message",
    home: "Oficina Norte",
    date: "2026-07-05T18:05:00",
    resolved: true,
  },
];

export const INITIAL_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: "r1",
    kind: "recommendation",
    titleKey: "recommendation.shiftUsageOffPeak.title",
    messageKey: "recommendation.shiftUsageOffPeak.message",
    home: "Casa Principal",
    date: "2026-07-07T08:00:00",
    read: false,
  },
  {
    id: "r2",
    kind: "recommendation",
    titleKey: "recommendation.reduceStandby.title",
    messageKey: "recommendation.reduceStandby.message",
    home: "Oficina Norte",
    date: "2026-07-04T12:00:00",
    read: false,
  },
  {
    id: "r3",
    kind: "recommendation",
    titleKey: "recommendation.scheduleMaintenance.title",
    messageKey: "recommendation.scheduleMaintenance.message",
    home: "Casa Principal",
    date: "2026-07-01T09:00:00",
    read: true,
  },
  {
    id: "r4",
    kind: "recommendation",
    titleKey: "recommendation.upgradeAppliance.title",
    messageKey: "recommendation.upgradeAppliance.message",
    home: "Oficina Norte",
    date: "2026-06-28T10:00:00",
    read: true,
  },
];
