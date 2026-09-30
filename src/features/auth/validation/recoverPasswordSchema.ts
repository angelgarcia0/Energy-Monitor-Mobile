import { z } from "zod";

import { tMessage } from "@/validation/i18nMessage";

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

export const recoverPasswordSchema = z.object({
  email: z
    .string()
    .min(1, message("validations:errors.required"))
    .email(message("validations:errors.invalidEmail")),
});

export type RecoverPasswordFormValues = z.infer<typeof recoverPasswordSchema>;
