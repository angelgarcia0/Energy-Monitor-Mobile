import { z } from "zod";

import i18n from "@/i18n";
import { tError, tMessage } from "@/validation/i18nMessage";

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

export const HOME_TYPE_VALUES = [
  "house",
  "apartment",
  "studio",
  "other",
] as const;

export type HomeTypeValue = (typeof HOME_TYPE_VALUES)[number];

/**
 * Las etiquetas de tipo de hogar viven en el locale `createHomeModal`, así que
 * quien las necesita las pide con su propio `t` en vez de leer un mapa estático.
 */
export function getHomeTypeLabel(
  t: (key: string) => string,
  value: string | undefined,
): string {
  if (!value) return "";
  if (!(HOME_TYPE_VALUES as readonly string[]).includes(value)) return "";
  return t(`createHomeModal:homeTypes.${value}`);
}

const FORBIDDEN_CHARS = /[<>{}[\]|"`']/;
const ALLOWED_CHARS = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s#\-.,()/]+$/;
const ADDRESS_KEYWORDS =
  /\b(Calle|Cra\.?|Carrera|Av\.?|Avenida|Transversal|Diagonal|Vereda|Finca|Apartamento|Apto|Oficina|Local)\b/i;
const invalidCharsMsg = { error: tError("createHomeModal:errors.addressInvalidChars") };

export const sanitizeAddress = (value: string) =>
  value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>{}[\]|"`']/g, "")
    .slice(0, 200);

export const createHomeSchema = z
  .object({
    name: z
      .string()
      .refine((v) => v.trim().length > 0, { error: tError("createHomeModal:errors.nameRequired") })
      .refine((v) => v.trim().length <= 50, { error: tError("createHomeModal:errors.nameMax") }),
    homeType: z.string().min(1, message("createHomeModal:errors.typeRequired")),
    otherType: z.string(),
    address: z
      .string()
      .refine((v) => v.trim().length > 0, { error: tError("createHomeModal:errors.addressRequired") })
      .refine((v) => v.trim().length <= 200, { error: tError("createHomeModal:errors.addressMax") })
      .refine((v) => !FORBIDDEN_CHARS.test(v), invalidCharsMsg)
      .refine((v) => ALLOWED_CHARS.test(v.trim()), invalidCharsMsg)
      .refine(
        (v) => /#/.test(v) || /No\.?\s+\d/i.test(v) || ADDRESS_KEYWORDS.test(v),
        { error: tError("createHomeModal:errors.addressInvalidFormat") },
      ),
    description: z.string().max(200, message("createHomeModal:errors.descriptionMax")),
  })
  .superRefine((data, ctx) => {
    if (data.homeType !== "other") return;
    const other = data.otherType.trim();
    if (!other) {
      ctx.addIssue({
        code: "custom",
        path: ["otherType"],
        message: i18n.t("createHomeModal:errors.otherRequired"),
      });
    } else if (other.length > 50) {
      ctx.addIssue({
        code: "custom",
        path: ["otherType"],
        message: i18n.t("createHomeModal:errors.otherMax"),
      });
    }
  });

export type CreateHomeFormValues = z.infer<typeof createHomeSchema>;
