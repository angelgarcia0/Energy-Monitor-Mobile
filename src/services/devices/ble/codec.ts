import { Buffer } from "buffer";

/**
 * `react-native-ble-plx` transporta todos los valores de una característica en
 * base64, y React Native no trae `Buffer`. `buffer` es JavaScript puro, así que
 * entra sin recompilar el binario, al contrario que con una librería nativa.
 */

/** UTF-8 → base64, que es lo que espera `writeValueWithResponse`. */
export function encode(text: string): string {
  return Buffer.from(text, "utf8").toString("base64");
}

/**
 * base64 → UTF-8, que es lo que devuelve `readValue`.
 *
 * Una respuesta corrupta no debe tumbar la sesión entera: si no es base64 se
 * devuelve cadena vacía y quien llama decide.
 */
export function decode(value: string | null): string {
  if (!value) return "";
  try {
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return "";
  }
}