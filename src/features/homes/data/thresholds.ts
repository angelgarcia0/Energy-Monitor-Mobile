/**
 * El backend guarda un único límite y deriva el otro a 30 días
 * (`HomeThresholds.DAYS_PER_MONTH`), así que el factor se replica aquí para
 * previsualizar el valor guardado antes de enviarlo.
 *
 * El resto de los datos de umbral viven en el servicio `home`; la forma que usa
 * la pantalla la maneja `useThresholdsState`.
 */
export const DAYS_PER_MONTH = 30;