import { z } from "zod";

export const THRESHOLD_ERROR_MESSAGE = "Ingresa un valor mayor a 0";

export const thresholdValueSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, THRESHOLD_ERROR_MESSAGE)
    .refine(
      (raw) => Number.isFinite(Number(raw)) && Number(raw) > 0,
      THRESHOLD_ERROR_MESSAGE,
    ),
});

export function validateThresholdValue(raw: string): string | null {
  const result = thresholdValueSchema.safeParse({ value: raw });

  return result.success
    ? null
    : (result.error.issues[0]?.message ?? THRESHOLD_ERROR_MESSAGE);
}
