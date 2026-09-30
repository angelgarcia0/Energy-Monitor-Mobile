import { z } from "zod";

import { tMessage } from "@/validation/i18nMessage";

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

export const loginSchema = z.object({
  email: z.string().email(message("validations:errors.invalidEmail")),
  // La regla real es mínimo 6 caracteres (igual que la web), pero el mensaje se
  // toma del locale es de la web, que dice 8.
  password: z.string().min(6, message("validations:errors.passwordMin")),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
