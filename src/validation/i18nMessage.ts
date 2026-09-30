import i18n from "@/i18n";

/**
 * Zod resuelve los mensajes en el momento de validar, así que los schemas se
 * pueden declarar a nivel de módulo pasando un error map que consulta i18n
 * cuando se ejecuta. Los dos helpers son la misma idea con la forma que pide
 * cada API: `tError` para `.refine()` y `tMessage` para los checks de Zod
 * (`.min()`, `.email()`, `.regex()`, ...).
 */
export function tError(key: string) {
  return () => ({ message: i18n.t(key) });
}

export function tMessage(key: string) {
  return { error: tError(key) };
}
