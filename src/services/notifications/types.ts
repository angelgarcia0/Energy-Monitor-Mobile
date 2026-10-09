/**
 * Contrato de preferencias de canales.
 * Fuente de verdad: `notification/adapter/in/web/dto/NotificationPreferencesDto`.
 *
 * Ojo con el nombre: esto no es la bandeja de notificaciones, que vive en
 * `services/alerts` y `services/recommendations`. Aquí solo son los canales por
 * los que el usuario quiere recibirlas.
 */

/** Lo que devuelve `GET /notifications/preferences`. */
export interface NotificationPreferences {
  /** El correo lo envía el servidor. */
  emailEnabled: boolean;
  /**
   * Preferencia de push del usuario. El push llega a los navegadores
   * suscritos, no a este teléfono: ver `pushBrowsers`.
   */
  pushEnabled: boolean;
  /**
   * Si el servidor tiene push configurado. Es `false` cuando no hay clave
   * VAPID, y entonces `/notifications/push/public-key` responde 404.
   */
  pushAvailable: boolean;
  /**
   * Navegadores con push suscrito. Es un contador del servidor y `0` no
   * significa "sin push": significa que nadie se ha suscrito todavía.
   */
  pushBrowsers: number;
}

/**
 * Lo que acepta `PUT /notifications/preferences`.
 *
 * El backend usa el mismo record para leer y para escribir, pero solo
 * `emailEnabled` y `pushEnabled` se guardan: los otros dos son de solo lectura
 * y se ignoran aunque se envíen. Enviar solo estos dos evita dar la impresión
 * de que se está configurando algo que en realidad no cambia.
 */
export type UpdateNotificationPreferences = Pick<
  NotificationPreferences,
  "emailEnabled" | "pushEnabled"
>;