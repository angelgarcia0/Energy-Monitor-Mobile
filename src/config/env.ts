/**
 * Origen del backend para los módulos de la API.
 *
 * Expo inlina en el bundle las variables `EXPO_PUBLIC_*` al compilar, así que la
 * URL se fija con `EXPO_PUBLIC_API_BASE_URL` (ver `.env.example`). El valor por
 * defecto solo sirve para web y simulador de iOS:
 *
 * - emulador de Android: `http://10.0.2.2:8080` (`localhost` es el propio dispositivo)
 * - teléfono físico:     `http://<IP-del-PC>:8080` y el PC en la misma red
 *
 * El valor configurado es el origen, sin la ruta de la API: `/api/v1` es fija.
 */
const RAW_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8080";

export const API_BASE_URL = `${RAW_BASE_URL.replace(/\/+$/, "")}/api/v1`;