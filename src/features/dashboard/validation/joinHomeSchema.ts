import { z } from "zod";

export const JOIN_CODE_LENGTH = 8;

export const sanitizeJoinCode = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, JOIN_CODE_LENGTH);

export const joinHomeSchema = z.object({
  code: z
    .string()
    .min(1, "Ingresa el código de acceso.")
    .regex(/^[A-Z0-9]{8}$/, "El código debe tener 8 caracteres (letras y números)."),
});

export type JoinHomeFormValues = z.infer<typeof joinHomeSchema>;
