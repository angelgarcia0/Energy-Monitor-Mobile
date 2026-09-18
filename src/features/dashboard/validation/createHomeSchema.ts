import { z } from "zod";

export const HOME_TYPE_OPTIONS = [
  { value: "house", label: "Casa" },
  { value: "apartment", label: "Apartamento" },
  { value: "studio", label: "Aparta estudio" },
  { value: "other", label: "Otro" },
] as const;

const FORBIDDEN_CHARS = /[<>{}[\]|"`']/;
const ALLOWED_CHARS = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s#\-.,()/]+$/;
const ADDRESS_KEYWORDS =
  /\b(Calle|Cra\.?|Carrera|Av\.?|Avenida|Transversal|Diagonal|Vereda|Finca|Apartamento|Apto|Oficina|Local)\b/i;
const INVALID_CHARS_MSG = "Caracteres no permitidos (< > { } [ ] | \" ` ')";

export const sanitizeAddress = (value: string) =>
  value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>{}[\]|"`']/g, "")
    .slice(0, 200);

export const createHomeSchema = z
  .object({
    name: z
      .string()
      .refine((v) => v.trim().length > 0, "El nombre del hogar es requerido.")
      .refine((v) => v.trim().length <= 50, "Máximo 50 caracteres."),
    homeType: z.string().min(1, "Selecciona un tipo de hogar."),
    otherType: z.string(),
    address: z
      .string()
      .refine((v) => v.trim().length > 0, "La dirección es requerida.")
      .refine((v) => v.trim().length <= 200, "Máximo 200 caracteres")
      .refine((v) => !FORBIDDEN_CHARS.test(v), INVALID_CHARS_MSG)
      .refine((v) => ALLOWED_CHARS.test(v.trim()), INVALID_CHARS_MSG)
      .refine(
        (v) => /#/.test(v) || /No\.?\s+\d/i.test(v) || ADDRESS_KEYWORDS.test(v),
        "Formato de dirección no válido. Ej: Cra. 15 # 93-47",
      ),
    description: z.string().max(200, "Máximo 200 caracteres."),
  })
  .superRefine((data, ctx) => {
    if (data.homeType !== "other") return;
    const other = data.otherType.trim();
    if (!other) {
      ctx.addIssue({ code: "custom", path: ["otherType"], message: "Especifica el tipo de hogar." });
    } else if (other.length > 50) {
      ctx.addIssue({ code: "custom", path: ["otherType"], message: "Máximo 50 caracteres." });
    }
  });

export type CreateHomeFormValues = z.infer<typeof createHomeSchema>;
