/**
 * ID del cliente OAuth de Google de tipo **Web** (el mismo `GOOGLE_CLIENT_ID` del
 * servicio de seguridad), necesario para el inicio de sesión con Google.
 *
 * Es el web y no el de Android a propósito: el `idToken` que devuelve Google va
 * dirigido (`aud`) al cliente que se pasa como `webClientId`, y el servidor solo
 * acepta tokens para el suyo. El cliente Android (paquete + SHA-1 de la llave que
 * firma la APK) también tiene que existir en el mismo proyecto de Google Cloud,
 * pero no se escribe aquí: Google lo reconoce por el paquete y la firma, y sin él
 * responde `DEVELOPER_ERROR`.
 *
 * No es un secreto (el secreto del cliente se queda en el servidor). Se escribe en
 * `.env` como `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`; vacío = botón de Google sin
 * efecto, con un aviso.
 */
const RAW_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ?? "";

export const GOOGLE_WEB_CLIENT_ID = RAW_WEB_CLIENT_ID;

export const HAS_GOOGLE_SIGN_IN = RAW_WEB_CLIENT_ID.length > 0;
