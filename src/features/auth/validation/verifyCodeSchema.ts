import { z } from "zod";

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d{6}$/, "El código solo debe contener dígitos"),
});

export type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;