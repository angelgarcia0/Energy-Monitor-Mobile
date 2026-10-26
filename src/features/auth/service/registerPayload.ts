import type { RegisterFormValues } from "../validation/registerSchema";

/**
 * Cuerpo que espera `POST /api/v1/auth/register` (`RegisterRequest`).
 *
 * - `repeatPassword` y `terms` son controles del formulario: nunca forman
 *   parte del contrato.
 * - El registro no devuelve token, así que después hay que hacer login.
 */
export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  lastName: string;
  profileImage?: string;
  /** El formulario no se envía sin el checkbox; el servidor lo exige (428 sin él). */
  acceptTerms: true;
}

export function toRegisterPayload(values: RegisterFormValues): RegisterPayload {
  return {
    email: values.email.trim(),
    password: values.password,
    name: values.name.trim(),
    lastName: values.lastName.trim(),
    acceptTerms: true,
  };
}