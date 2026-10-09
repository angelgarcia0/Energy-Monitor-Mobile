import type { Alert } from "@/services/alerts";

/**
 * Alerta en la forma que pinta la UI. Traduce el contrato del backend a las
 * claves del locale `notifications`, igual que hace la Web.
 */

export type AlertSeverity = "critical" | "warning" | "info";

/** Subtipo que decide el ícono, el color y la frase. */
export type AlertKind = "threshold" | "connectivity" | "device" | "limit";

export interface UiAlert {
  id: string;
  type: AlertKind;
  severity: AlertSeverity;
  /** Clave bajo `notifications:` para título y mensaje. */
  key: string;
  home: string;
  homeId: string;
  deviceId: string | null;
  /**
   * `true` en los problemas que el sistema cierra solo (consumo normalizado,
   * dispositivo reconectado, nuevo día o mes) frente a los avisos informativos
   * que la persona marca como leídos. Solo los informativos se pueden tocar.
   */
  autoResolved: boolean;
  /** ISO-8601. */
  date: string;
  resolved: boolean;
}

/** El backend marca lo crítico terminando el `messageKey` en `critical`. */
const isCritical = (messageKey: string | null) => !!messageKey?.endsWith("critical");

function toKind(type: Alert["type"]): AlertKind {
  switch (type) {
    case "CONNECTIVITY":
      return "connectivity";
    case "DEVICE":
      return "device";
    case "LIMIT":
      return "limit";
    default:
      return "threshold";
  }
}

/**
 * Backend → UI.
 *
 * `messageKey` se traduce a la clave equivalente del cliente, que no es la misma:
 * el servidor dice `alert.limit.monthly` y la fila lee `limit.monthly`.
 *
 * @param homeName nombre del hogar, que aparece en el mensaje
 */
export function toUiAlert(alert: Alert, homeName: string): UiAlert {
  const type = toKind(alert.type);
  const critical = isCritical(alert.messageKey);

  const key =
    type === "connectivity"
      ? "connectivity.deviceOffline"
      : type === "device"
        ? "device.linked"
        : type === "limit"
          ? alert.messageKey === "alert.limit.monthly"
            ? "limit.monthly"
            : "limit.daily"
          : critical
            ? "threshold.critical"
            : "threshold.high";

  return {
    id: alert.idAlert,
    type,
    severity: type === "device" ? "info" : critical || type === "limit" ? "critical" : "warning",
    key,
    home: homeName,
    homeId: alert.homeId,
    deviceId: alert.deviceId,
    autoResolved: type !== "device",
    date: alert.dateTime,
    resolved: alert.alertStatus === "RESOLVED",
  };
}