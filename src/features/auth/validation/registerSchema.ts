import { z } from "zod";

import { tError, tMessage } from "@/validation/i18nMessage";

import { passwordField } from "./passwordRules";

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

export const registerSchema = z
  .object({
    name: z.string().min(1, message("validations:errors.required")),

    email: z.string().min(1, message("validations:errors.required")),

    password: passwordField,

    repeatPassword: z.string().min(1, message("validations:errors.repeatPassword")),

    terms: z.boolean().refine((val) => val === true, {
      error: tError("validations:errors.terms"),
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    error: tError("validations:errors.passwordMatch"),
    path: ["repeatPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
