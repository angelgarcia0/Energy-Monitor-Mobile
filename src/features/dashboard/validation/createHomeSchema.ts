import { z } from "zod";

import { tError, tMessage } from "@/validation/i18nMessage";

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

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

/**
 * `homeType` es el `id_home_type` del backend (`hous000001`, `othe000001`...),
 * no el nombre: `POST /homes` lo manda a `homeTypeId`, que es clave foránea.
 * Las etiquetas salen de `features/shared/homeTypes`.
 *
 * No hay campo para un tipo escrito a mano: el backend solo acepta los tipos del
 * catálogo, así que "otro" es una opción más y su texto libre no tiene dónde
 * guardarse. Por eso la Web quitó ese campo del formulario.
 */
export const createHomeSchema = z.object({
  name: z
    .string()
    .refine((v) => v.trim().length > 0, { error: tError("createHomeModal:errors.nameRequired") })
    .refine((v) => v.trim().length <= 50, { error: tError("createHomeModal:errors.nameMax") }),
  homeType: z.string().min(1, message("createHomeModal:errors.typeRequired")),
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
});

export type CreateHomeFormValues = z.infer<typeof createHomeSchema>;