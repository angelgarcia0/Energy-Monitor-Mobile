/**
 * Contrato de preferencias de canales y de la instalación de este teléfono.
 *
 * Fuentes de verdad: `notification/adapter/in/web/dto/NotificationPreferencesDto`
 * y `notification/adapter/in/web/dto/PushDeviceRequest` del backend.
 *
 * Ojo con el nombre: esto no es la bandeja de notificaciones, que vive en
 * `services/alerts` y `services/recommendations`. Aquí solo son los canales por
 * los que el usuario quiere recibirlas, y el token con el que este teléfono
 * puede recibirlas.
 */

/** Lo que devuelve `GET /notifications/preferences`. */
export interface NotificationPreferences {
  /** El correo lo envía el servidor. */
  emailEnabled: boolean;
  /**
   * Preferencia de push del usuario. Es un solo interruptor para los dos
   * transportes: lo que decide es si el servidor manda o no manda push.
   */
  pushEnabled: boolean;
  /**
   * Si el servidor tiene algún transporte de push configurado (clave VAPID o
   * credencial del relay). Es `false` cuando no hay ninguno, y entonces no
   * tiene sentido encender el interruptor.
   */
  pushAvailable: boolean;
  /**
   * Navegadores con push suscrito. Es un contador del servidor y `0` no
   * significa "sin push": significa que nadie se ha suscrito todavía.
   *
   * No cuenta los teléfonos: cada uno registra su token aparte.
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

/**
 * Token que el relay de push devuelve para esta instalación.
 *
 * El prefijo `ExponentPushToken[...]` lo pone el relay, no la app; se conserva
 * entero porque es lo que espera el endpoint de envío.
 */
export type PushDeviceToken = string;

/** `ANDROID` | `IOS`. El backend no acepta otros valores: es un enum cerrado. */
export type PushDevicePlatform = "ANDROID" | "IOS";

/**
 * `null` mientras no se ha preguntado si esta instalación es alcanzable.
 *
 * No es lo mismo que `false`: `false` es una respuesta del backend —no hay
 * credencial del relay configurada—, mientras que `null` es que todavía no se
 * sabe. La UI usa la diferencia para no afirmar nada que no se haya comprobado.
 */
export type PushDeviceAvailability = boolean | null;

/** Lo que acepta `POST /notifications/push/devices`. */
export interface RegisterPushDevice {
  token: PushDeviceToken;
  platform: PushDevicePlatform;
}

/** Lo que devuelve `GET /notifications/push/devices/available`. */
export interface PushDeviceAvailabilityResponse {
  available: boolean;
}