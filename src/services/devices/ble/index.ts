/**
 * Alta de un módulo por Bluetooth Low Energy.
 *
 * El flujo completo es:
 *
 *   1. scanForModules()      lista los módulos cercanos
 *   2. connectModule(id)     conecta y lee INFO (code, id, fw, cfg)
 *   3. linkDevice(homeId)    POST /homes/{id}/devices → devuelve apiKey y broker
 *   4. session.sendConfig()  escribe red + broker + apiKey por BLE
 *   5. esperar "mqtt_ok" en STATUS
 *
 * El paso 3 va antes que el 4 a propósito, y por dos motivos: el backend tiene
 * que devolver `broker.host`, y si el módulo está mal escrito conviene enterarse
 * antes de grabarle la red. También evita dejar en el backend un módulo que
 * nunca se configuró.
 */

export { ensureBlePermissions } from "./permissions";
export {
  connectModule,
  destroyManager,
  getManager,
  ModuleSession,
} from "./moduleSession";
export { scanForModules } from "./scan";
export type { DiscoveredModule, ScanOutcome } from "./scan";
export {
  BLE_NAME_PREFIX,
  CONFIG_UUID,
  configFrames,
  INFO_UUID,
  MAX_CONFIG_LENGTH,
  moduleName,
  NETWORKS_UUID,
  parseIdentity,
  parseNetworks,
  SERVICE_UUID,
  signalPercent,
  STATUS_UUID,
  type ModuleConfig,
  type ModuleIdentity,
  type ModuleStatus,
  type ScannedNetwork,
} from "./protocol";