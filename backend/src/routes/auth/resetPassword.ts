import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  ResetPassword,
  ResetPasswordSchema,
} from "../../validations/resetPassword";

const prisma = new PrismaClient();

export default async function resetPassword(req: Request, res: Response) {
  // validate the request body
  let input: ResetPassword;
  try {
    input = ResetPasswordSchema.parse(req.body);
  } catch (e: any) {
    if (e.errors) return res.status(400).send({ message: e.errors[0].message });
    else return res.status(400).send({ message: "Invalid input" });
  }

  // check if the user exists and has not attempted OTP verification more than 10 times
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
      resetTokenAttempt: true,
    },
  });
  if (!user)
    return res.status(404).send({ message: "User not found", path: "signup" });
  if (user.resetTokenAttempt >= 10)
    return res.status(401).send({ message: "Too many attempts" });

  // Check if the OTP is correct and has not expired and the new password is set
  const userWithOtp = await prisma.user.findFirst({
    where: {
      email: input.email,
      resetToken: input.otp,
      resetTokenExpire: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
      newPassword: true,
    },
  });

  if (!userWithOtp) {
    await prisma.user.update({
      where: {
        email: input.email,
      },
      data: {
        resetTokenAttempt: {
          increment: 1,
        },
      },
    });
    return res.status(401).send({ message: "Invalid OTP" });
  }
  if (!userWithOtp.newPassword)
    return res.status(400).send({
      message: "Please provide a new password",
      path: "forgotPassword",
    });

  // update the user password
  await prisma.user.update({
    where: {
      id: userWithOtp.id,
    },
    data: {
      password: userWithOtp.newPassword,
    },
  });

  return res
    .status(200)
    .send({ message: "Password reset successfully", path: "login" });
}
