import { httpClient } from "@/services/http/httpClient";

/**
 * Contacto de soporte: un administrador al que la app puede escribirle.
 * El backend los devuelve ordenados por nombre.
 */
export interface SupportContact {
  name: string;
  email: string;
}

/**
 * `GET /support/contacts` — administradores que atienden el soporte.
 *
 * Es una consulta pública (se hace sin sesión) y la lista llega vacía mientras
 * no haya administradores dados de alta, igual que en la web
 * (`services/support/supportApi.js`).
 */
export async function getSupportContacts(): Promise<SupportContact[]> {
  const { data } = await httpClient.get<SupportContact[]>("/support/contacts");
  return data ?? [];
}
