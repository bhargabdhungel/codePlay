import z from 'zod';

export const ResetPasswordSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
  email: z.string().email({ message: "Invalid email" }),
});

export type ResetPassword = z.infer<typeof ResetPasswordSchema>;