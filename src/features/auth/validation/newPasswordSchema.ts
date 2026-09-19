import { z } from "zod";

import { passwordField } from "./passwordRules";

export const newPasswordSchema = z
  .object({
    password: passwordField,
    repeatPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repeatPassword"],
  });

export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;