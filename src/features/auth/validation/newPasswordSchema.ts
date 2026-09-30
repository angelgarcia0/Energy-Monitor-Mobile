import { z } from "zod";

import { tError, tMessage } from "@/validation/i18nMessage";

import { passwordField } from "./passwordRules";

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

export const newPasswordSchema = z
  .object({
    password: passwordField,
    repeatPassword: z.string().min(1, message("validations:errors.repeatPassword")),
  })
  .refine((data) => data.password === data.repeatPassword, {
    error: tError("validations:errors.passwordMatch"),
    path: ["repeatPassword"],
  });

export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
