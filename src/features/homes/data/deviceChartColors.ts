export type ApplianceType =
  | "fridge"
  | "washer"
  | "tv"
  | "microwave"
  | "ac"
  | "pc"
  | "waterHeater"
  | "lighting"
  | "other";

// Paleta fija por tipo de electrodoméstico (dato de dominio, no token de UI).
// Solo la variante "light": mobile no tiene theming dinámico todavía.
export const DEVICE_CHART_COLORS: Record<ApplianceType, string> = {
  fridge: "#2563EB",
  washer: "#7C3AED",
  tv: "#DB2777",
  microwave: "#EA580C",
  ac: "#0D9488",
  pc: "#CA8A04",
  waterHeater: "#DC2626",
  lighting: "#65A30D",
  other: "#64748B",
};

export const getDeviceColor = (applianceType: ApplianceType) =>
  DEVICE_CHART_COLORS[applianceType] ?? DEVICE_CHART_COLORS.other;
