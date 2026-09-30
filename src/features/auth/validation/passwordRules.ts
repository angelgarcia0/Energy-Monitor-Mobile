import { z } from "zod";

import { tMessage } from "@/validation/i18nMessage";

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

export const passwordField = z
  .string()
  .min(8, message("validations:errors.passwordMin"))
  .regex(/[A-Z]/, message("validations:errors.passwordUpper"))
  .regex(/(.*[a-z]){3,}/, message("validations:errors.passwordLower"))
  .regex(/(.*[0-9]){3,}/, message("validations:errors.passwordNumber"))
  .regex(/[^A-Za-z0-9]/, message("validations:errors.passwordSpecial"));
