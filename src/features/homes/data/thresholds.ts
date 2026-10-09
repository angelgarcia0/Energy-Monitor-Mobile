/**
 * Forma de la pantalla, no del backend. `useThresholdsState` traduce esto a
 * `dailyLimit` / `monthlyLimit` / `useSystemDefault` y al revés.
 */
export interface Thresholds {
  daily: number;
  monthly: number;
  useDefaults: boolean;
}

/** El backend deriva un límite del otro con 30 días (`HomeThresholds.DAYS_PER_MONTH`). */
export const DAYS_PER_MONTH = 30;

/**
 * Única fuente de verdad de los límites del sistema. El mock de consumo ya no
 * define límites: solo consumo usado.
 */
export const DEFAULT_THRESHOLDS = {
  daily: 10,
  monthly: 300,
};
