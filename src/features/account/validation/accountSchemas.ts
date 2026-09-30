import { z } from "zod";

import { tError, tMessage } from "@/validation/i18nMessage";
import { passwordField } from "@/features/auth/validation/passwordRules";

/**
 * Los mensajes se resuelven con un error map función de Zod, no con strings:
 * así se evalúan en cada validación y reflejan el idioma activo. La lógica de
 * las reglas queda intacta; solo cambia de dónde sale el texto.
 */
const message = tMessage;

export const accountNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, message("validations:errors.required"))
    .min(2, message("validations:errors.nameMin")),
});

export const accountEmailSchema = z.object({
  // Misma regla de formato que usa registerSchema.
  email: z
    .string()
    .trim()
    .min(1, message("validations:errors.required"))
    .email(message("validations:errors.invalidEmail")),
});

export const accountPhoneSchema = z.object({
  // Vacío = quitar el teléfono; si se ingresa, solo dígitos de 7 a 15.
  phone: z
    .string()
    .trim()
    .regex(/^\d*$/, message("validations:errors.phoneDigitsOnly"))
    .refine(
      (value) => value === "" || (value.length >= 7 && value.length <= 15),
      message("validations:errors.phoneDigitsRange"),
    ),
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
export type AccountEmailValues = z.infer<typeof accountEmailSchema>;
export type AccountPhoneValues = z.infer<typeof accountPhoneSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
