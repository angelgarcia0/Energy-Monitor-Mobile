import { Platform, PermissionsAndroid } from "react-native";

/**
 * Permisos de Bluetooth Low Energy en Android.
 *
 * `react-native-ble-plx` declara los permisos en su propio manifiesto, que el
 * autolinking fusiona al compilar. Eso los pone en el manifiesto, pero no los
 * concede: Android 12 los trata como permisos peligrosos y hay que pedirlos en
 * tiempo de ejecución antes de escanear.
 *
 * En iOS no hay permisos que pedir para el escaneo BLE, así que la función
 * devuelve `true` sin hacer nada.
 */

/**
 * Android 12 (API 31) separó los permisos de Bluetooth de los de ubicación. En
 * las versiones anteriores el escaneo BLE exige ubicación fina porque el SSID
 * es información de ubicación; en 12 o superior con `neverForLocation` ya no.
 */
const NEEDS_LOCATION = Platform.OS === "android" && Platform.Version < 31;

export async function ensureBlePermissions(): Promise<boolean> {
  if (Platform.OS !== "android") return true;

  if (NEEDS_LOCATION) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  ]);

  return Object.values(result).every(
    (value) => value === PermissionsAndroid.RESULTS.GRANTED,
  );
}

/**
 * Si falta el permiso, distingue "el usuario lo denegó" de "no hay Bluetooth".
 * Los dos casos ended en mensajes distintos en la interfaz.
 */
export function permissionHint(): "denied" | "unavailable" | null {
  if (Platform.OS !== "android") return null;
  return NEEDS_LOCATION ? "denied" : null;
}