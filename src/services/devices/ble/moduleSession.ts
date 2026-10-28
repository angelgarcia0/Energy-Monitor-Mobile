import { BleManager, type Device, type Subscription } from "react-native-ble-plx";

import { decode, encode } from "./codec";
import {
  CONFIG_UUID,
  INFO_UUID,
  NETWORKS_UUID,
  SERVICE_UUID,
  STATUS_UUID,
  configFrames,
  moduleName,
  parseIdentity,
  parseNetworks,
  type ModuleConfig,
  type ModuleIdentity,
  type ScannedNetwork,
} from "./protocol";

/**
 * MTU que declara el firmware (`NimBLEDevice::setMTU(247)`). Sin negociarlo,
 * Android escribe como mucho 20 bytes y los trozos de 150 no pasan. El cliente
 * web no lo necesita porque Web Bluetooth lo negocia solo; aquí es obligatorio.
 */
const MTU = 247;

/** Cuánto se espera el `scan_done` antes de rendirse. */
const SCAN_TIMEOUT_MS = 30_000;

/** Un `BleManager` por proceso: abrir varios pelean por el adaptador. */
let manager: BleManager | null = null;

export function getManager(): BleManager {
  manager ??= new BleManager();
  return manager;
}

/** Cierra el adaptador. Para tests o para dejarBluetooth libre. */
export async function destroyManager(): Promise<void> {
  await manager?.destroy();
  manager = null;
}

/**
 * Sesión con un módulo ya conectado.
 *
 * Traduce `bleProvisioning.js` de la Web, con dos diferencias obligatorias: el
 * MTU se negocia a mano, y `STATUS` se escucha con `monitorCharacteristicForService`
 * en lugar de un evento DOM.
 */
export class ModuleSession {
  private statusSubscription: Subscription | null = null;
  private readonly listeners = new Set<(status: string) => void>();
  private readonly disconnectedListeners = new Set<() => void>();

  constructor(
    private readonly device: Device,
    readonly identity: ModuleIdentity,
    private readonly advertisedName: string | null,
  ) {}

  get name(): string {
    return moduleName(this.advertisedName, this.identity);
  }

  /** `true` mientras el módulo siga conectado. */
  get connected(): boolean {
    return Boolean(this.statusSubscription);
  }

  /**
   * Escucha `STATUS`. Si el módulo se desconecta a media configuración se avisa,
   * porque sin eso la interfaz se queda esperando un `mqtt_ok` que no va a llegar.
   */
  watch(): void {
    if (this.statusSubscription) return;

    this.statusSubscription = this.device.monitorCharacteristicForService(
      SERVICE_UUID,
      STATUS_UUID,
      (error, characteristic) => {
        if (error || characteristic == null) {
          this.disconnectedListeners.forEach((listener) => listener());
          return;
        }
        const status = decode(characteristic.value);
        if (!status) return;
        this.listeners.forEach((listener) => listener(status));
      },
    );

    this.device.onDisconnected(() => {
      this.disconnectedListeners.forEach((listener) => listener());
    });
  }

  /** @returns función para dejar de escuchar */
  onStatus(listener: (status: string) => void): () => void {
    this.watch();
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** @returns función para dejar de escuchar desconexiones */
  onDisconnected(listener: () => void): () => void {
    this.disconnectedListeners.add(listener);
    return () => this.disconnectedListeners.delete(listener);
  }

  /**
   * Espera un estado, o falla al vencer el tiempo.
   *
   * Se registra antes de escribir, porque `wifi_connecting` puede llegar mientras
   * la escritura aún no ha terminado.
   */
  waitFor(predicate: (status: string) => boolean, timeoutMs: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        off();
        reject(new Error("timeout"));
      }, timeoutMs);

      const off = this.onStatus((status) => {
        if (!predicate(status)) return;
        clearTimeout(timer);
        off();
        resolve(status);
      });
    });
  }

  /**
   * Pide al módulo que escanee y devuelve lo que ve.
   *
   * El orden importa y no es el intuitivo. Al escribir, el firmware responde con
   * `lastNetworksJson`, la lista **anterior**, y pone `bleScanRequested`; la
   * nueva llega después como `scan_done`. Leer sin esperar daría redes viejas.
   */
  async scanNetworks(): Promise<ScannedNetwork[]> {
    this.watch();
    const done = this.waitFor((status) => status === "scan_done", SCAN_TIMEOUT_MS).catch(
      () => null,
    );

    await this.device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      NETWORKS_UUID,
      encode("1"),
    );
    await done;

    const characteristic = await this.device.readCharacteristicForService(
      SERVICE_UUID,
      NETWORKS_UUID,
    );

    try {
      return parseNetworks(decode(characteristic.value));
    } catch {
      return [];
    }
  }

  /**
   * Manda red, servidor e identidad. El progreso llega por `STATUS`.
   *
   * `host`, `port` y `key` los da el backend en la respuesta de
   * `POST /homes/{id}/devices`; aquí no se deducen.
   */
  async sendConfig(config: ModuleConfig): Promise<void> {
    this.watch();
    for (const frame of configFrames(config)) {
      await this.device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CONFIG_UUID,
        encode(frame),
      );
    }
  }

  /** Cierra la conexión. Silencioso si ya estaba desconectado. */
  async disconnect(): Promise<void> {
    this.statusSubscription?.remove();
    this.statusSubscription = null;
    try {
      await this.device.cancelConnection();
    } catch {
      // ya estaba desconectado
    }
  }
}

/** Conecta y lee la identidad del módulo elegido. */
export async function connectModule(deviceId: string): Promise<ModuleSession> {
  const ble = getManager();

  const device = await ble.connectToDevice(deviceId);
  await device.discoverAllServicesAndCharacteristics();
  // Antes de cualquier escritura: sin esto Android limita a 20 bytes.
  await device.requestMTU(MTU);

  const characteristic = await device.readCharacteristicForService(
    SERVICE_UUID,
    INFO_UUID,
  );

  const raw = decode(characteristic.value);
  const identity = parseIdentity(raw);

  return new ModuleSession(device, identity, device.name ?? null);
}