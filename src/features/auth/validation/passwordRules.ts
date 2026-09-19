import { z } from "zod";

export const passwordField = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .regex(/[A-Z]/, "Debe tener una mayúscula")
  .regex(/(.*[a-z]){3,}/, "Debe tener al menos 3 minúsculas")
  .regex(/(.*[0-9]){3,}/, "Debe tener al menos 3 números")
  .regex(/[^A-Za-z0-9]/, "Debe tener un carácter especial");