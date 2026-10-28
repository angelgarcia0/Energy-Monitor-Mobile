import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { GOOGLE_WEB_CLIENT_ID, HAS_GOOGLE_SIGN_IN } from "@/config/googleSignIn";
import { loginWithGoogle, type AccountResponse } from "./authApi";

/**
 * Fallo del lado de Google (antes de llegar al servidor). `reason` elige el mensaje:
 * - `notConfigured`: falta `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` en el build.
 * - `playServices`: el teléfono no tiene Google Play Services o están desactualizados.
 * - `failed`: cualquier otro, p. ej. `DEVELOPER_ERROR` (paquete o SHA-1 sin cliente
 *   Android en Google Cloud). El código queda en `code` y en la consola.
 */
export class GoogleSignInError extends Error {
  constructor(
    readonly reason: "notConfigured" | "playServices" | "failed",
    readonly code?: string,
  ) {
    super(`Google sign-in ${reason}${code ? ` (${code})` : ""}`);
    this.name = "GoogleSignInError";
  }
}

let configured = false;

function configure() {
  if (configured) return;
  // Sin offlineAccess: el servidor verifica el idToken y no necesita un código.
  GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
  configured = true;
}

/**
 * Inicio de sesión (o registro, la primera vez) con la cuenta de Google del
 * teléfono: pide el `idToken` a Google y lo canjea en `POST /auth/google`.
 *
 * Crear la cuenta exige aceptar los términos. `acceptTerms` los da por aceptados
 * (el checkbox del registro); si no, el servidor responde 428, se llama a
 * `askTerms` y, si los acepta, se repite con el mismo `idToken`.
 *
 * @returns la cuenta, o `null` si el usuario cerró el selector de cuentas
 * @throws GoogleSignInError si falla del lado de Google; un error de la API
 *         (401, 403, 409, 428, 503) si lo rechaza el servidor
 */
export async function signInWithGoogle(
  options: {
    acceptTerms?: boolean;
    askTerms?: () => Promise<boolean>;
    /** "Mantener la sesión iniciada"; por defecto, sí. */
    remember?: boolean;
  } = {},
): Promise<AccountResponse | null> {
  if (!HAS_GOOGLE_SIGN_IN) throw new GoogleSignInError("notConfigured");
  configure();

  let idToken: string | null;
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) return null;
    idToken = response.data.idToken;
  } catch (error) {
    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) return null;
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new GoogleSignInError("playServices", error.code);
      }
      if (__DEV__) console.warn("Google sign-in failed:", error.code, error.message);
      throw new GoogleSignInError("failed", error.code);
    }
    throw new GoogleSignInError("failed");
  } finally {
    // La sesión de la app es la del servidor; sin cerrar la de Google, el próximo
    // inicio entraría con la misma cuenta sin dejar elegir otra.
    await GoogleSignin.signOut().catch(() => {});
  }

  // Ocurre si webClientId no es un cliente web válido del proyecto.
  if (!idToken) throw new GoogleSignInError("failed", "NO_ID_TOKEN");
  try {
    return await loginWithGoogle(idToken, options.acceptTerms ?? false, options.remember);
  } catch (error) {
    if ((error as { status?: number })?.status !== 428 || !options.askTerms) throw error;
    if (!(await options.askTerms())) throw error;
    return loginWithGoogle(idToken, true, options.remember);
  }
}
