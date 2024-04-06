import { z } from 'zod';

export const VerifyEmailBodySchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

export type VerifyEmailBody = z.infer<typeof VerifyEmailBodySchema>;

