import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Sesión del usuario (tokens + idUser). Los tokens van al almacén seguro del sistema
 * (Keychain / Keystore, `expo-secure-store`): en AsyncStorage quedarían en texto plano y
 * entrarían en las copias de seguridad del teléfono. El resto (cuenta, perfil) sigue en
 * AsyncStorage, bajo una sola clave.
 * El id del usuario vive en `session.account.idUser` (login y GET /auth/account).
 *
 * El módulo mantiene un espejo en memoria: `useSyncExternalStore` exige una
 * lectura síncrona y AsyncStorage no la ofrece. `hydrateSession` llena ese espejo
 * al arrancar y a partir de ahí toda escritura va primero a memoria y en segundo
 * lugar al disco.
 */
const STORAGE_KEY = "energymonitor_session";
const TOKENS_KEY = "energymonitor_session_tokens";

// En la Web no hay almacén seguro: los tokens van con el resto, como antes.
const secureStoreAvailable = Platform.OS !== "web";

type StoredTokens = Pick<Session, "accessToken" | "refreshToken">;

async function readTokens(): Promise<StoredTokens | null> {
  if (!secureStoreAvailable) return null;
  const raw = await SecureStore.getItemAsync(TOKENS_KEY);
  return raw ? (JSON.parse(raw) as StoredTokens) : null;
}

/** Escribe la sesión: los tokens en el almacén seguro y lo demás en AsyncStorage. */
async function writeSession(session: Session): Promise<void> {
  if (!secureStoreAvailable) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return;
  }
  const { accessToken, refreshToken, ...rest } = session;
  await SecureStore.setItemAsync(
    TOKENS_KEY,
    JSON.stringify({ accessToken, refreshToken }),
    { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY },
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
}

async function removeStoredSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  if (secureStoreAvailable) await SecureStore.deleteItemAsync(TOKENS_KEY);
}

export interface SessionAccount {
  idUser?: string;
  idPerson?: string;
  email?: string;
  status?: string;
  lastLogin?: string | null;
  profileImage?: string | null;
  /** Creada con Google: no tiene contraseña que cambiar y su borrado se confirma con un código. */
  googleAccount?: boolean;
}

export interface SessionProfile {
  name?: string;
  lastName?: string;
  profileImage?: string | null;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  /**
   * Epoch ms en que vence el access token. El backend manda `expiresIn` en el
   * login y en cada renovación; guardarlo permite renewar **antes** de la
   * petición en vez de descubrir que ya venció cuando responde 401.
   */
  expiresAt?: number;
  /** Id de la sesión del backend que contestó el login (lo pide POST /auth/logout). */
  idUserSession?: string;
  account?: SessionAccount;
  profile?: SessionProfile;
}

/** Usuario en sesión, como lo expone `useCurrentPerson`. */
export interface CurrentPerson {
  id: string;
  name: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  googleAccount: boolean;
}

let cache: Session | null = null;
let hydrated = false;
let snapshot = "null";
/**
 * `false` cuando el usuario desmarcó "Mantener la sesión iniciada": la sesión
 * vive solo en memoria y cerrar la app la termina. Lo fija cada login.
 */
let persistent = true;

const listeners = new Set<() => void>();
const notify = () => {
  snapshot = JSON.stringify(cache);
  listeners.forEach((listener) => listener());
};

/**
 * Las escrituras se encadenan para que un `clear` encolado detrás de un `save`
 * no pueda ser pisado por una escritura anterior que todavía estaba en vuelo.
 */
let writes: Promise<void> = Promise.resolve();
const enqueue = (task: () => Promise<void>) => {
  writes = writes.then(task).catch(() => {});
  return writes;
};

export async function hydrateSession(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as Partial<Session>) : null;
    const tokens = await readTokens();
    cache = stored ? ({ ...stored, ...tokens } as Session) : null;
    // Una versión anterior guardaba los tokens junto con el resto, en AsyncStorage: se
    // pasan al almacén seguro y dejan de estar en texto plano.
    if (cache && secureStoreAvailable && stored?.accessToken) {
      const migrated = cache;
      void enqueue(() => writeSession(migrated));
    }
    // Sin tokens no hay sesión que recuperar (p. ej. se restauró una copia de seguridad).
    if (cache && !cache.accessToken) cache = null;
  } catch {
    cache = null;
  }
  // Lo que está en disco se guardó porque el usuario pidió mantener la sesión.
  persistent = true;
  hydrated = true;
  notify();
}

export function isSessionHydrated(): boolean {
  return hydrated;
}

export function getSession(): Session | null {
  return cache;
}

/** Suscripción para que la UI (Sidebar, perfil) se actualice al cambiar la sesión. */
export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Huella de la sesión; cambia con cada `saveSession`/`clearSession`. */
export function getSessionSnapshot(): string {
  return snapshot;
}

/** Guarda (fusiona) la sesión y la persiste. */
export function saveSession(patch: Partial<Session>): void {
  const previous = cache;
  const next: Session = {
    ...previous,
    ...patch,
    account: patch.account ?? previous?.account,
    profile: { ...previous?.profile, ...patch.profile },
  } as Session;

  // Cada token nuevo trae su propio vencimiento. El login lo manda explícito
  // (`expiresIn`), pero la renovación solo devuelve el JWT, así que se lee del
  // claim `exp`. Si no se puede leer, `expiresAt` queda sin valor y el token se
  // trata como vencido, que es la postura segura: renueva de más una vez, no
  // renueva tarde.
  if (patch.accessToken && patch.expiresAt === undefined) {
    next.expiresAt = expiryFromToken(patch.accessToken);
  }

  cache = next;
  notify();

  const persist = persistent;
  void enqueue(async () => {
    try {
      if (persist) {
        await writeSession(next);
      } else {
        // Una sesión anterior que sí se guardó no debe revivir al reabrir la app.
        await removeStoredSession();
      }
    } catch {
      // Sin persistencia la sesión sigue viva en memoria hasta cerrar la app.
    }
  });
}

/**
 * Abre la sesión de un login. `persist` es la casilla "Mantener la sesión
 * iniciada": con ella la sesión se guarda en disco y la app la recupera al
 * abrirse; sin ella, dura hasta cerrar la app. Las renovaciones del token
 * siguen la misma elección.
 */
export function startSession(session: Session, persist: boolean): void {
  persistent = persist;
  saveSession(session);
}

export function clearSession(): void {
  cache = null;
  notify();

  void enqueue(async () => {
    try {
      await removeStoredSession();
    } catch {
      // Nada que hacer: la sesión ya no está en memoria.
    }
  });
}

export const isAuthenticated = (): boolean => Boolean(cache?.accessToken);

/**
 * Margen de renovación: si al token le queda menos de esto ya se cuenta como
 * vencido. Cubre el reloj del dispositivo atrasado y el viaje de la petición.
 */
const EXPIRY_SKEW_MS = 30_000;

/**
 * `true` si el access token venció o está por vencer.
 *
 * Una sesión sin `expiresAt` —escrita antes de que existiera el campo— se toma
 * como vencida a propósito: la primera petición la renueva y lo guarda, y desde
 * ahí deja de renovar antes de tiempo. Sin esto, una sesión guardada por una
 * versión anterior dispararía un 401 en cada arranque.
 */
export function isAccessTokenExpired(now: number = Date.now()): boolean {
  const session = cache;
  if (!session?.accessToken) return false;
  if (session.expiresAt === undefined) return true;
  return session.expiresAt - EXPIRY_SKEW_MS <= now;
}

/** Decodifica base64url a texto (Hermes no expone `atob`). */
function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let output = "";
  let buffer = 0;
  let bits = 0;

  for (const char of padded) {
    const index = alphabet.indexOf(char);
    if (index === -1) continue;
    buffer = (buffer << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }

  return output;
}

/** Claims del access token, o `null` si el token no es un JWT legible. */
function readClaims(token: string | undefined): { exp?: number; sub?: string } | null {
  try {
    const payload = token?.split(".")[1];
    if (!payload) return null;
    return JSON.parse(decodeBase64Url(payload)) as { exp?: number; sub?: string };
  } catch {
    return null;
  }
}

/** Epoch ms en que expira el token, según su claim `exp`. */
function expiryFromToken(token: string | undefined): number | undefined {
  const exp = readClaims(token)?.exp;
  return typeof exp === "number" ? exp * 1000 : undefined;
}

/**
 * Id de la sesión del backend (lo pide POST /auth/logout). No es el `sub` del
 * access token: ese es el id de la cuenta, y el backend responde 404 a él. Una
 * sesión guardada antes de existir el campo no lo tiene.
 */
export function getSessionId(): string | null {
  return cache?.idUserSession ?? null;
}

/** Datos del usuario en sesión (el backend no devuelve nombre en el login). */
export function getCurrentPerson(): CurrentPerson | null {
  const session = cache;
  if (!session?.account) return null;
  return {
    id: session.account.idUser ?? "",
    name: session.profile?.name ?? "",
    lastName: session.profile?.lastName ?? "",
    email: session.account.email ?? "",
    profileImage: session.profile?.profileImage ?? null,
    googleAccount: session.account.googleAccount === true,
  };
}