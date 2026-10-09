/**
 * Contrato del módulo device. Fuente de verdad: los DTO de
 * `device/adapter/in/web/dto`.
 */

/** `DeviceStatus` del dominio. */
export type DeviceStatus = "ONLINE" | "OFFLINE";

/** `GET /appliance-types`. `idApplianceType` no es el nombre: ver `deviceTypes`. */
export interface ApplianceTypeResponse {
  idApplianceType: string;
  name: string;
}

/**
 * `GET /homes/{id}/devices`
 *
 * `status`, `signalStrength` y `lastSeen` vienen en `null` cuando el módulo
 * nunca se ha conectado. No es lo mismo que cero: `signalStrength: 0` sería una
 * señal medida, `null` es "no hay señal medida".
 */
export interface HomeDevice {
  idDevice: string;
  name: string;
  applianceTypeId: string;
  /** `appliance_type.name` del catálogo, p. ej. `refrigerator`. */
  applianceType: string;
  /** Texto libre de 50 caracteres; puede ser una clave de habitación o no. */
  location: string | null;
  /** ISO-8601. */
  installationDate: string | null;
  deviceCode: string;
  status: DeviceStatus | null;
  /** dBm. */
  signalStrength: number | null;
  /** ISO-8601 de la última lectura del módulo. */
  lastSeen: string | null;
}

export interface LinkDeviceRequest {
  /** 1 a 6 caracteres alfanuméricos; viene del módulo por Bluetooth. */
  deviceCode: string;
  name: string;
  applianceTypeId: string;
  location?: string;
}

export interface UpdateDeviceRequest {
  name: string;
  applianceTypeId: string;
  location?: string;
}

/**
 * `POST /homes/{id}/devices` — además del dispositivo devuelve `apiKey` y el
 * broker, que se escriben al módulo por Bluetooth y no se vuelven a mostrar.
 * Sin Bluetooth no hay a quién escribirlos: el alta queda registrada igual, pero
 * el módulo no recibe su credencial.
 */
export interface LinkDeviceResponse {
  device: HomeDevice;
  apiKey: string;
  broker: {
    host: string;
    port: number;
  };
}