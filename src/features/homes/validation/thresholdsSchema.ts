import { z } from "zod";

import i18n from "@/i18n";
import { tMessage } from "@/validation/i18nMessage";

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

const invalidMessage = message("thresholds:errors.invalid");

export const thresholdValueSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, invalidMessage)
    .refine(
      (raw) => Number.isFinite(Number(raw)) && Number(raw) > 0,
      invalidMessage,
    ),
});

export function validateThresholdValue(raw: string): string | null {
  const result = thresholdValueSchema.safeParse({ value: raw });

  return (
    result.success ? null : (result.error.issues[0]?.message ?? i18n.t("thresholds:errors.invalid"))
  );
}
