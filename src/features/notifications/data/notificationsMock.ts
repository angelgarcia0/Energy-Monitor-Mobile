/**
 * Las recomendaciones siguen siendo de muestra: es el siguiente módulo. Las
 * alertas ya se leen del backend y no viven aquí.
 *
 * Guardan la clave del locale en vez del texto escrito, para que se traduzcan
 * junto con la pantalla.
 */

export interface RecommendationItem {
  id: string;
  kind: "recommendation";
  titleKey: string;
  messageKey: string;
  home: string;
  date: string;
  read: boolean;
}

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