import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Sesión del usuario (tokens + idUser) en AsyncStorage, bajo una sola clave.
 * El id del usuario vive en `session.account.idUser` (login y GET /auth/account).
 *
 * El módulo mantiene un espejo en memoria: `useSyncExternalStore` exige una
 * lectura síncrona y AsyncStorage no la ofrece. `hydrateSession` llena ese espejo
 * al arrancar y a partir de ahí toda escritura va primero a memoria y en segundo
 * lugar al disco.
 */
const STORAGE_KEY = "energymonitor_session";

export interface SessionAccount {
  idUser?: string;
  idPerson?: string;
  email?: string;
  status?: string;
  lastLogin?: string | null;
  profileImage?: string | null;
}

export interface SessionProfile {
  name?: string;
  lastName?: string;
  profileImage?: string | null;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
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
}

let cache: Session | null = null;
let hydrated = false;
let snapshot = "null";

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
    cache = raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    cache = null;
  }
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

  cache = next;
  notify();

  void enqueue(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Sin persistencia la sesión sigue viva en memoria hasta cerrar la app.
    }
  });
}

export function clearSession(): void {
  cache = null;
  notify();

  void enqueue(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nada que hacer: la sesión ya no está en memoria.
    }
  });
}

export const isAuthenticated = (): boolean => Boolean(cache?.accessToken);

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

/** El `sub` del access token es el id de la sesión (lo pide POST /auth/logout). */
export function getSessionId(): string | null {
  try {
    const payload = cache?.accessToken.split(".")[1];
    if (!payload) return null;
    const claims = JSON.parse(decodeBase64Url(payload)) as { sub?: string };
    return claims.sub ?? null;
  } catch {
    return null;
  }
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
  };
}