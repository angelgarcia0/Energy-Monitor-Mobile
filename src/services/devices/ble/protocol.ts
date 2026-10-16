/**
 * Protocolo de vinculación Bluetooth de un módulo EnergyMonitor.
 *
 * Debe coincidir con `esp32-pzem-monitor/config.h` y con el bloque de comentario
 * del protocolo en `esp32-pzem-monitor.ino`:
 *
 *   INFO      read    {"code","id","fw","cfg"}
 *   NETWORKS  read    [{"s": ssid, "r": rssi, "e": 0|1}]; write = volver a escanear
 *   CONFIG    write   JSON en trozos: "+" trozo, "=" último trozo, "!" reinicia
 *   STATUS    notify  idle | scan_done | wifi_connecting | wifi_ok |
 *                     wifi_failed[:auth|:notfound] | mqtt_connecting | mqtt_ok |
 *                     mqtt_failed:<rc> | bad_config
 *
 * Este archivo no importa nada nativo a propósito: son datos puros, para que se
 * puedan comprobar sin un teléfono delante.
 */

/** Servicio GATT del módulo. */
export const SERVICE_UUID = "8f2a0001-5e8c-4a7b-9c3d-2f1e0b7a6c51";
/** Lectura: identidad del módulo. */
export const INFO_UUID = "8f2a0002-5e8c-4a7b-9c3d-2f1e0b7a6c51";
/** Lectura: redes que ve el módulo. Escritura: reescanear. */
export const NETWORKS_UUID = "8f2a0003-5e8c-4a7b-9c3d-2f1e0b7a6c51";
/** Escritura: configuración, en trozos. */
export const CONFIG_UUID = "8f2a0004-5e8c-4a7b-9c3d-2f1e0b7a6c51";
/** Notificación: progreso. */
export const STATUS_UUID = "8f2a0005-5e8c-4a7b-9c3d-2f1e0b7a6c51";

/**
 * El módulo anuncia MTU 247 (`NimBLEDevice::setMTU(247)`), así que caben 244
 * bytes por escritura. El cliente web trocea en 150; aquí se mantiene el mismo
 * tamaño para no tener dos protocolos.
 *
 * Sin negociar MTU, Android escribe como mucho 20 bytes y cada trozo revienta.
 */
export const CHUNK = 150;

/**
 * El firmware descarta el buffer si pasa de 1024 caracteres acumulados
 * (`bleConfigBuffer.length() > 1024`). Escribir más de eso se pierde en
 * silencio, así que se avisa antes de intentarlo.
 */
export const MAX_CONFIG_LENGTH = 1024;

/** Prefijo del nombre BLE del módulo: `EnergyMonitor-<código>`. */
export const BLE_NAME_PREFIX = "EnergyMonitor-";

/** Identidad que devuelve `INFO`. */
export interface ModuleIdentity {
  /** Código corto, el mismo que pide `POST /homes/{id}/devices`. */
  code: string;
  /** Id del dispositivo que espera el backend. */
  id: string;
  /** Versión de firmware, informative. */
  fw: string;
  /** `1` si el módulo ya tiene configuración guardada. */
  cfg: number;
}

/** Una red vista por el módulo. */
export interface ScannedNetwork {
  ssid: string;
  rssi: number;
  /** `true` si necesita contraseña. */
  secured: boolean;
}

/** Lo que se le manda al módulo por `CONFIG`. */
export interface ModuleConfig {
  ssid: string;
  pass: string;
  /** Direccion del broker. La da el backend, no se deduce aquí. */
  host: string;
  port: number;
  id: string;
  /** `apiKey` del backend, usada como contraseña MQTT. */
  key: string;
}

/** Estados que notifica `STATUS`. Se comparan como cadenas. */
export type ModuleStatus =
  | "idle"
  | "scan_done"
  | "wifi_connecting"
  | "wifi_ok"
  | "wifi_failed"
  | "wifi_failed:auth"
  | "wifi_failed:notfound"
  | "mqtt_connecting"
  | "mqtt_ok"
  | "mqtt_failed"
  | "bad_config";

/** dBm → porcentaje aproximado de señal (−100 dBm = 0 %, −50 dBm = 100 %). */
export function signalPercent(dbm: number | null | undefined): number {
  if (dbm == null) return 0;
  return Math.max(0, Math.min(100, 2 * (dbm + 100)));
}

/**
 * Lee `INFO`. El módulo siempre devuelve JSON, pero un firmware ajeno podría no
 * cumplir el contrato, así que se valida en vez de asumir.
 */
export function parseIdentity(raw: string): ModuleIdentity {
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("respuesta de INFO no es un objeto");
  }
  const value = parsed as Partial<ModuleIdentity>;
  if (typeof value.code !== "string" || typeof value.id !== "string") {
    throw new Error("INFO sin code o sin id");
  }
  return {
    code: value.code,
    id: value.id,
    fw: typeof value.fw === "string" ? value.fw : "",
    cfg: typeof value.cfg === "number" ? value.cfg : 0,
  };
}

/**
 * Lee `NETWORKS`.
 *
 * Hay dos sorpresas del firmware y las dos están contempladas aquí:
 *
 * - Un firmware anterior a 1.3.6 deja `"1"` (lo que se escribió) en vez de la
 *   lista. No es un array, se devuelve vacío.
 * - El módulo puede devolver un array con entradas a medio construir, así que
 *   cada una se filtra por `s` de tipo string.
 */
export function parseNetworks(raw: string): ScannedNetwork[] {
  const parsed: unknown = JSON.parse(raw || "[]");
  if (!Array.isArray(parsed)) return [];

  const networks: ScannedNetwork[] = [];
  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) continue;
    const value = entry as { s?: unknown; r?: unknown; e?: unknown };
    if (typeof value.s !== "string") continue;
    networks.push({
      ssid: value.s,
      rssi: typeof value.r === "number" ? value.r : 0,
      secured: value.e === 1,
    });
  }
  return networks;
}

/**
 * Trocea el JSON de configuración en los fotogramas que el firmware entiende:
 * `!` limpia, `+` añade, `=` añade y aplica.
 */
export function configFrames(config: ModuleConfig): string[] {
  const json = JSON.stringify(config);
  if (json.length > MAX_CONFIG_LENGTH) {
    throw new Error(
      `la configuración ocupa ${json.length} caracteres y el firmware descarta más de ${MAX_CONFIG_LENGTH}`,
    );
  }

  const frames = ["!"];
  for (let i = 0; i < json.length; i += CHUNK) {
    const last = i + CHUNK >= json.length;
    frames.push((last ? "=" : "+") + json.slice(i, i + CHUNK));
  }
  return frames;
}

/** El nombre que anuncia el módulo, para mostrarlo mientras se busca. */
export function moduleName(advertised: string | null, identity: ModuleIdentity): string {
  return advertised ?? `${BLE_NAME_PREFIX}${identity.code}`;
}