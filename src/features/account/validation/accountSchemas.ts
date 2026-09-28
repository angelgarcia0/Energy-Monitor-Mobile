import { z } from "zod";

import { passwordField } from "@/features/auth/validation/passwordRules";

export const accountNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El campo es obligatorio")
    .min(2, "Mínimo 2 caracteres"),
});

export const accountEmailSchema = z.object({
  // Misma regla de formato que usa registerSchema.
  email: z
    .string()
    .trim()
    .min(1, "El campo es obligatorio")
    .email("Correo inválido"),
});

export const accountPhoneSchema = z.object({
  // Vacío = quitar el teléfono; si se ingresa, solo dígitos de 7 a 15.
  phone: z
    .string()
    .trim()
    .regex(/^\d*$/, "Solo puedes escribir números")
    .refine(
      (value) => value === "" || (value.length >= 7 && value.length <= 15),
      "Entre 7 y 15 dígitos",
    ),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresa tu contraseña actual"),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, "Confirma tu nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type AccountNameValues = z.infer<typeof accountNameSchema>;
export type AccountEmailValues = z.infer<typeof accountEmailSchema>;
export type AccountPhoneValues = z.infer<typeof accountPhoneSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
