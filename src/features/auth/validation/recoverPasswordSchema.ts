import { z } from "zod";

export const recoverPasswordSchema = z.object({
  email: z.string().min(1, "El campo es obligatorio").email("Correo inválido"),
});

export type RecoverPasswordFormValues = z.infer<typeof recoverPasswordSchema>;