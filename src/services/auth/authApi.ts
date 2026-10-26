import { httpClient } from "@/services/http/httpClient";
import {
  clearSession,
  getSession,
  getSessionId,
  saveSession,
  type SessionAccount,
} from "./session";

export interface LoginCredentials {
  email: string;
  password: string;
  /** Solo tras aceptar los términos: el servidor responde 428 a una cuenta que nunca lo hizo. */
  acceptTerms?: boolean;
}

export interface AccountResponse extends SessionAccount {
  name?: string | null;
  lastName?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  account: AccountResponse;
}

/** `GET /auth/account` y `PUT /auth/profile` devuelven la persona persistida. */
export interface ProfileResponse {
  idPerson: string;
  name: string;
  /** `null` si la cuenta no tiene apellido (p. ej. creada con Google). */
  lastName: string | null;
}

export async function login({
  email,
  password,
  acceptTerms = false,
}: LoginCredentials): Promise<AccountResponse> {
  const { data } = await httpClient.post<LoginResponse>("/auth/login", {
    email,
    password,
    ...(acceptTerms ? { acceptTerms: true } : {}),
  });
  return openSession(data);
}

/**
 * `POST /auth/google` con el `idToken` del inicio de sesión nativo de Google. La
 * primera vez el servidor crea la cuenta con el nombre, la foto y el correo de
 * Google (ya verificado), así que no hay paso de verificación como en el registro.
 * Crear la cuenta exige `acceptTerms`; sin él el servidor responde 428.
 */
export async function loginWithGoogle(
  idToken: string,
  acceptTerms = false,
): Promise<AccountResponse> {
  const { data } = await httpClient.post<LoginResponse>("/auth/google", {
    idToken,
    ...(acceptTerms ? { acceptTerms: true } : {}),
  });
  return openSession(data);
}

async function openSession(data: LoginResponse): Promise<AccountResponse> {
  saveSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    // El backend declara cuánto vive el token; sin esto el cliente descubre que
    // venció cuando el backend le responde 401.
    expiresAt: Date.now() + data.expiresIn * 1000,
    account: data.account,
    profile: {
      name: data.account.name ?? "",
      lastName: data.account.lastName ?? "",
      profileImage: data.account.profileImage ?? null,
    },
  });
  // Nombre y foto; el login ya es válido sin ellos.
  await refreshProfile().catch(() => {});
  return data.account;
}

/**
 * `POST /auth/register` responde 202 sin cuenta: la cuenta se crea cuando se verifica el
 * código que llega al correo (`/auth/email/verify`). Si no se verifica, el registro vence.
 */
export interface RegistrationResponse {
  email: string;
  expiresAt: string;
}

export const register = (payload: {
  email: string;
  password: string;
  name: string;
  lastName: string;
  profileImage?: string;
}) => httpClient.post<RegistrationResponse>("/auth/register", payload).then((r) => r.data);

export const verifyEmail = ({ email, code }: { email: string; code: string }) =>
  httpClient.post("/auth/email/verify", { email, code });

export const resendVerification = (email: string) =>
  httpClient.post("/auth/email/verification/resend", { email });

export const forgotPassword = (email: string) =>
  httpClient.post("/auth/password/forgot", { email });

export const resetPassword = ({
  email,
  resetToken,
  newPassword,
}: {
  email: string;
  resetToken: string;
  newPassword: string;
}) => httpClient.post("/auth/password/reset", { email, resetToken, newPassword });

export const changePassword = ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) => httpClient.post("/auth/password/change", { currentPassword, newPassword });

/**
 * Edita el nombre, el apellido y/o la foto de perfil, cada uno por separado: solo se
 * envían los campos recibidos. `lastName: ""` borra el apellido; `profileImage` es un
 * data-URL y "" la elimina.
 * Guarda en la sesión lo que el backend confirmó o, para la foto, lo enviado.
 */
export async function updateProfile({
  name,
  lastName,
  profileImage,
}: {
  name?: string;
  lastName?: string;
  profileImage?: string;
}) {
  const { data } = await httpClient.put<ProfileResponse>("/auth/profile", {
    name,
    lastName,
    profileImage,
  });
  saveSession({
    profile: {
      ...getSession()?.profile,
      name: data.name,
      lastName: data.lastName ?? "",
      ...(profileImage !== undefined ? { profileImage: profileImage || null } : {}),
    },
  });
  return data;
}

/**
 * Mueve la cuenta a otro correo. El backend lo llama `newEmail` para que nada del
 * cuerpo pueda confundirse con una credencial, y el cambio reinicia la verificación
 * del correo, así que quien llama debe avisar de que hay que volver a verificar.
 */
export async function updateEmail(email: string): Promise<void> {
  await httpClient.put("/auth/profile", { newEmail: email });
  const previous = getSession();
  saveSession({
    account: { ...previous?.account, email },
  });
}

/**
 * `GET /auth/account`: refresca correo, foto, nombre y apellido. Se llama al abrir
 * el perfil.
 */
export async function getAccount(): Promise<AccountResponse> {
  const { data } = await httpClient.get<AccountResponse>("/auth/account");
  const previous = getSession();
  saveSession({
    account: {
      ...previous?.account,
      idUser: data.idUser ?? previous?.account?.idUser,
      email: data.email,
      profileImage: data.profileImage ?? null,
    },
    profile: {
      ...previous?.profile,
      ...(data.name != null ? { name: data.name, lastName: data.lastName ?? "" } : {}),
      profileImage: data.profileImage ?? null,
    },
  });
  return data;
}

/** Deja en la sesión correo, foto, nombre y apellido del usuario. */
export async function refreshProfile(): Promise<void> {
  await getAccount();
}

/** Elimina la cuenta tras confirmar con la contraseña; cierra la sesión local. */
export async function deleteAccount(password: string): Promise<void> {
  await httpClient.post("/auth/account/delete", { password });
  clearSession();
}

/**
 * Cierra la sesión local primero (nada en vuelo puede revivirla) y avisa al backend
 * después, con el access token capturado antes de borrarlo. El resultado del
 * backend no importa: la sesión local ya no existe.
 */
export async function logout(): Promise<void> {
  const accessToken = getSession()?.accessToken;
  const idUserSession = getSessionId();
  clearSession();
  if (!accessToken || !idUserSession) return;

  try {
    await httpClient.post(
      "/auth/logout",
      { idUserSession },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  } catch {
    // Sin reintento; el backend expira la sesión por su cuenta.
  }
}