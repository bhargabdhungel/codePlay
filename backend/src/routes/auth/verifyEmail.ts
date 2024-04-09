import { Request, Response } from "express";
import {
  VerifyEmailBody,
  VerifyEmailBodySchema,
} from "../../validations/verifyEmailBody";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function verifyEmail(req: Request, res: Response) {
  // Validate the input
  let inputUser: VerifyEmailBody;
  try {
    inputUser = VerifyEmailBodySchema.parse(req.body);
  } catch (e: any) {
    if (e.errors) return res.status(400).send({ message: e.errors[0].message });
    else return res.status(400).send({ message: "Invalid input" });
  }

  // Check if the user exists and has not attempted OTP verification more than 10 times
  const user = await prisma.user.findUnique({
    where: {
      email: inputUser.email,
    },
    select: {
      id: true,
      otpAttempt: true,
    },
  });
  if (!user)
    return res.status(404).send({ message: "User not found", path: "signup" });
  if (user.otpAttempt >= 10)
    return res
      .status(401)
      .send({ message: "Too many attempts", path: "login" });

  // Check if the OTP is correct and has not expired
  const userWithOtp = await prisma.user.findFirst({
    where: {
      email: inputUser.email,
      otp: inputUser.otp,
      otpExpire: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
    },
  });
  if (!userWithOtp) {
    await prisma.user.update({
      where: {
        email: inputUser.email,
      },
      data: {
        otpAttempt: {
          increment: 1,
        },
      },
    });
    return res.status(401).send({ message: "Invalid OTP" });
  }

  // Update the user to verified
  await prisma.user.update({
    where: {
      id: userWithOtp.id,
    },
    data: {
      verified: true,
      otp: null,
      otpExpire: null,
      otpAttempt: 0,
    },
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15d",
    }
  );
  return res
    .status(200)
    .send({ message: "User verified", save: { token }, path: "home" });
}
