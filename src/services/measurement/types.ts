/**
 * Contrato de consumo. Fuente de verdad: los DTO de
 * `measurement/adapter/in/web/dto`.
 *
 * Casi todo es nullable a propósito: un hogar sin dispositivos-linked devuelve
 * las potencias en `null` en vez de cero, y `0` significaría "medido: nada".
 * La UI distingue los dos casos.
 */

/** Nivel de riesgo del consumo (`RiskConsumption` del dominio). */
export type RiskConsumption = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/** Periodo del historial. El backend lo pasa a `Period` en mayúsculas. */
export type ConsumptionPeriod = "day" | "week" | "month" | "year";

/** `LimitPeriod` como string; el summary lo devuelve sin tipar. */
export type LimitPeriodName = "DAILY" | "MONTHLY";

export interface HourPower {
  /** ISO-8601. */
  hourStart: string;
  /** Watts. `null` si nadie midió esa hora. */
  averagePower: number | null;
}

export interface DeviceConsumption {
  deviceId: string;
  /** Watts. */
  currentPower: number | null;
  /** kWh de hoy. */
  todayEnergy: number;
}

/** `GET /homes/{id}/consumption/summary` */
export interface HomeConsumptionSummary {
  /** Watts. */
  currentPower: number | null;
  level: RiskConsumption | null;
  /** kWh de hoy. */
  todayEnergy: number;
  /** kWh del mes. */
  monthEnergy: number;
  dailyLimit: number | null;
  monthlyLimit: number | null;
  limitPeriod: LimitPeriodName | null;
  /** Las últimas 24 horas, de la más antigua a la más reciente. */
  lastHours: HourPower[];
  devices: DeviceConsumption[];
}

export interface DeviceEnergy {
  deviceId: string;
  /** kWh. */
  energy: number;
}

export interface HistoryBucket {
  /**
   * Clave neutra, no una fecha: `day` → hora local ("0".."23"),
   * `week`/`month` → "YYYY-MM-DD", `year` → "YYYY-MM".
   */
  key: string;
  /** ISO-8601 del inicio del bucket. */
  start: string;
  devices: DeviceEnergy[];
}

/** `GET /homes/{id}/consumption/history` */
export interface HomeConsumptionHistory {
  period: string;
  /** ISO-8601. */
  from: string;
  /** ISO-8601. */
  to: string;
  buckets: HistoryBucket[];
  /** kWh del periodo anterior completo, para comparar. */
  previousTotal: number;
}