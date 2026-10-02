import { z } from "zod";

import { tError, tMessage } from "@/validation/i18nMessage";
import { passwordField } from "@/features/auth/validation/passwordRules";

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

// El backend limita nombre y apellido a 100 caracteres (`RegisterRequest`).
const accountNameField = z
  .string()
  .trim()
  .min(1, message("validations:errors.required"))
  .min(2, message("validations:errors.nameMin"))
  .max(100, message("validations:errors.nameMax"));

export const accountNameSchema = z.object({
  name: accountNameField,
});

export const accountLastNameSchema = z.object({
  lastName: accountNameField,
});

export const accountEmailSchema = z.object({
  // Misma regla de formato que usa registerSchema.
  email: z
    .string()
    .trim()
    .min(1, message("validations:errors.required"))
    .email(message("validations:errors.invalidEmail")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, message("validations:errors.currentPasswordRequired")),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, message("validations:errors.confirmNewPassword")),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: tError("validations:errors.passwordMatch"),
    path: ["confirmPassword"],
  });

export type AccountNameValues = z.infer<typeof accountNameSchema>;
export type AccountLastNameValues = z.infer<typeof accountLastNameSchema>;
export type AccountEmailValues = z.infer<typeof accountEmailSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
