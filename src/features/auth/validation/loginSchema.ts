import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  // La regla real es mínimo 6 caracteres (igual que la web), pero el
  // mensaje se copia literal del locale es de la web, que dice 8.
  password: z.string().min(6, "Mínimo 8 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;