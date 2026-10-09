/**
 * Datos del paso a paso de recuperación, solo en memoria.
 *
 * El backend no expone un endpoint para "verificar el código": `POST /auth/reset`
 * es el que canjea el token. Por eso el código se valida en el cliente y se pasa al
 * paso final por aquí, igual que en la Web, en lugar de viajar en la ruta.
 */

export interface RecoverFlow {
  email: string;
  /** Código de 6 dígitos que canjea `POST /auth/password/reset`. */
  code: string;
}

let pending: RecoverFlow | null = null;

export function startRecoverFlow(email: string): void {
  pending = { email, code: "" };
}

export function setRecoverCode(code: string): void {
  if (pending) pending.code = code;
}

export function getRecoverFlow(): RecoverFlow | null {
  return pending;
}

export function clearRecoverFlow(): void {
  pending = null;
}