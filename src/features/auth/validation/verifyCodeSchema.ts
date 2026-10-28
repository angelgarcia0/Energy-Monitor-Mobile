import { z } from "zod";

import { tMessage } from "@/validation/i18nMessage";

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .length(6, message("validations:errors.codeInvalid"))
    .regex(/^\d{6}$/, message("validations:errors.codeDigits")),
});

export type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;
