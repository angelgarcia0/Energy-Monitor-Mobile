export type AlertSeverity = "critical" | "warning";
export type AlertType = "threshold" | "connectivity";

export interface AlertItem {
  id: string;
  kind: "alert";
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  home: string;
  date: string;
  resolved: boolean;
}

export interface RecommendationItem {
  id: string;
  kind: "recommendation";
  title: string;
  message: string;
  home: string;
  date: string;
  read: boolean;
}

export type NotificationItem = AlertItem | RecommendationItem;

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "a1",
    kind: "alert",
    type: "threshold",
    severity: "critical",
    title: "Límite diario superado",
    message:
      'El hogar "Casa Principal" superó el límite diario de consumo configurado.',
    home: "Casa Principal",
    date: "2026-07-07T09:12:00",
    resolved: false,
  },
  {
    id: "a2",
    kind: "alert",
    type: "connectivity",
    severity: "warning",
    title: "Dispositivo desconectado",
    message:
      'Un dispositivo de "Casa Principal" dejó de reportar datos de consumo. Verifica su conexión WiFi.',
    home: "Casa Principal",
    date: "2026-07-06T22:40:00",
    resolved: false,
  },
  {
    id: "a3",
    kind: "alert",
    type: "threshold",
    severity: "warning",
    title: "Cerca del límite mensual",
    message:
      'El hogar "Oficina Norte" está cerca de alcanzar el límite mensual de consumo configurado.',
    home: "Oficina Norte",
    date: "2026-07-05T18:05:00",
    resolved: true,
  },
];

export const INITIAL_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: "r1",
    kind: "recommendation",
    title: "Mueve consumo fuera de horas pico",
    message:
      'Traslada el uso de tus equipos en "Casa Principal" a horas de menor demanda para ahorrar energía y reducir tu factura.',
    home: "Casa Principal",
    date: "2026-07-07T08:00:00",
    read: false,
  },
  {
    id: "r2",
    kind: "recommendation",
    title: "Reduce el consumo en standby",
    message:
      'Desconecta en "Oficina Norte" los dispositivos que no uses; el consumo en standby se acumula.',
    home: "Oficina Norte",
    date: "2026-07-04T12:00:00",
    read: false,
  },
  {
    id: "r3",
    kind: "recommendation",
    title: "Programa un mantenimiento",
    message:
      'Algunos equipos de "Casa Principal" muestran un consumo superior al habitual. Un mantenimiento puede mejorar su eficiencia.',
    home: "Casa Principal",
    date: "2026-07-01T09:00:00",
    read: true,
  },
  {
    id: "r4",
    kind: "recommendation",
    title: "Considera renovar un electrodoméstico",
    message:
      'Un electrodoméstico de "Oficina Norte" consume mucho más que un modelo eficiente actual. Renovarlo podría reducir tu factura.',
    home: "Oficina Norte",
    date: "2026-06-28T10:00:00",
    read: true,
  },
];
