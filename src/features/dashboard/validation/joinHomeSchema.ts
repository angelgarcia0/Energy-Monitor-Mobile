import { z } from "zod";

import { tMessage } from "@/validation/i18nMessage";

export const JOIN_CODE_LENGTH = 8;

export const sanitizeJoinCode = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, JOIN_CODE_LENGTH);

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

export const joinHomeSchema = z.object({
  code: z
    .string()
    .min(1, message("joinHomeModal:errors.required"))
    .regex(/^[A-Z0-9]{8}$/, message("joinHomeModal:errors.invalid")),
});

export type JoinHomeFormValues = z.infer<typeof joinHomeSchema>;
