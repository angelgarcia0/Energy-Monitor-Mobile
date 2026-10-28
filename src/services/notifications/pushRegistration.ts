import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { EAS_PROJECT_ID, HAS_EAS_PROJECT_ID } from "@/config/easProjectId";
import { registerDevice, unregisterDevice } from "./pushDeviceApi";
import type { PushDeviceToken } from "./types";

/**
 * Alta de este teléfono como destino de push.
 *
 * Es la contraparte de `push_device` del backend. El registro se repite en cada
 * arranque porque es lo que hace que el sistema se entere solo: si el token
 * rotó, se reinscribe el nuevo, y si la instalación cambió de cuenta, la fila
 * pasa a ser de la nueva.
 */

/**
 * Canal de Android por el que se muestran las alertas.
 *
 * El id tiene que coincidir con el `channelId` que manda el backend
 * (`ExpoPushSender.CHANNEL_ID`). No es cosmético: si el canal no existe en el
 * dispositivo Android **no muestra la notificación**, y desde Android 13 sin un
 * canal tampoco aparece el diálogo de permiso, así que sin crearlo antes no se
 * llega ni a tener token.
 */
export const ALERTS_CHANNEL_ID = "alerts";

/** Crea el canal de Android. No-op en iOS. */
export async function ensureAlertsChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(ALERTS_CHANNEL_ID, {
    name: "Alerts",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#208AEF",
  });
}

/**
 * Qué hacer con una notificación que llega con la app en primer plano.
 *
 * Sin esto `expo-notifications` no muestra nada mientras la app está abierta, y
 * una alerta que el usuario tiene delante se pierde en silencio. Debe
 * instalarse una vez y temprano: si no hay handler, el comportamiento por defecto
 * es no mostrar.
 */
export function installForegroundHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/** `true` si ya se concedió el permiso. No pregunta nada. */
export async function hasPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

/**
 * Pide el permiso y devuelve si se concedió.
 *
 * `false` no es un fallo: el usuario puede decir que no. Se pide desde Ajustes,
 * en el interruptor de push, y no al arrancar —abrir una app y que salte un
 * diálogo del sistema sin contexto es exactamente lo que hace que la gente
 * disable las notificaciones para siempre.
 */
export async function requestPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/**
 * El token con el que el relay enruta a esta instalación.
 *
 * `null` cuando falta `EXPO_PUBLIC_EAS_PROJECT_ID`: no es un problema de red ni
 * de permisos, es que el proyecto no está configurado, y conviene distinguirlos.
 */
export async function fetchPushToken(): Promise<PushDeviceToken | null> {
  if (!HAS_EAS_PROJECT_ID) return null;
  const { data } = await Notifications.getExpoPushTokenAsync({
    projectId: EAS_PROJECT_ID,
  });
  return data;
}

function currentPlatform() {
  return Platform.OS === "ios" ? ("IOS" as const) : ("ANDROID" as const);
}

/**
 * Registra el token de esta instalación, si ya se le pidió permiso.
 *
 * `false` significa que no se registró. **Nunca pregunta nada**: en cada
 * arranque solo se reinscribe lo que ya está autorizado, porque pedir el permiso
 * es una decisión del usuario y se toma en Ajustes.
 *
 * Un fallo aquí no rompe nada: las alertas siguen llegando por correo y en el
 * siguiente arranque se reintenta.
 */
export async function registerThisDevice(): Promise<boolean> {
  await ensureAlertsChannel();
  if (!(await hasPermission())) return false;

  const token = await fetchPushToken();
  if (!token) return false;

  await registerDevice({ token, platform: currentPlatform() });
  return true;
}

/**
 * Pide el permiso y, si se concede, registra el token.
 *
 * Es el camino de "el usuario acaba de encender el push en Ajustes", y el único
 * que abre el diálogo del sistema.
 */
export async function enablePushOnThisDevice(): Promise<boolean> {
  await ensureAlertsChannel();
  if (!(await requestPermission())) return false;
  return registerThisDevice();
}

/**
 * Da de baja el token de esta instalación.
 *
 * Se llama al cerrar sesión: mientras la sesión siga viva, el teléfono puede
 * seguir recibiendo alertas de la cuenta anterior, y al usuario ya no le sirven.
 *
 * Los fallos se ignoran a propósito. El token caduca solo, el backend lo limpia
 * cuando el relay dice que la instalación ya no existe, y nada de eso debe
 * impedir cerrar sesión.
 */
export async function unregisterThisDevice(): Promise<void> {
  try {
    const token = await fetchPushToken();
    if (token) await unregisterDevice(token);
  } catch {
    // sin internet, sin token, o el backend no respondió: se ignora
  }
}

/**
 * Reinscribe el token en cuanto el servicio de push lo rota.
 *
 * El token no solo se pide al arrancar: el servicio puede cambiarlo con la app
 * abierta, y el anterior queda inválido. Sin esto, el backend seguiría teniendo
 * el viejo y las alertas se irían a un teléfono que ya no las recibe.
 *
 * Llamar una vez por sesión iniciada. Devuelve la función para quitar la
 * suscripción.
 */
export function watchPushTokenRotation(): () => void {
  const subscription = Notifications.addPushTokenListener(({ data }) => {
    registerDevice({ token: data, platform: currentPlatform() }).catch(() => {
      // se reintentará en el siguiente arranque
    });
  });
  return () => subscription.remove();
}