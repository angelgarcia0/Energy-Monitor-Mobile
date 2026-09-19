import { z } from "zod";

import { passwordField } from "./passwordRules";

export const registerSchema = z
  .object({
    name: z.string().min(1, "El campo es obligatorio"),

    email: z.string().min(1, "El campo es obligatorio"),

    password: passwordField,

    repeatPassword: z.string().min(1, "Confirma tu contraseña"),

    terms: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones",
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repeatPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
