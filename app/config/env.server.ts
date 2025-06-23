import { z } from "zod";

const envSchema = z.object({
  OUTSPEED_API_KEY: z.string().min(1, "OUTSPEED_API_KEY is required"),
});

export const env = envSchema.parse({
  OUTSPEED_API_KEY: process.env.OUTSPEED_API_KEY,
});
