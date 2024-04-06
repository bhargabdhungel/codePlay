import { Request, Response } from "express";
import { ForgotPassword, ForgotPasswordSchema } from "../../validations/forgotPassword";
import { PrismaClient } from "@prisma/client";
import sendOTP from "../../utils/sendEmail";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function forgotPassword(req : Request, res : Response) {
  // validate the request body
  let input : ForgotPassword;
  try {
    input = ForgotPasswordSchema.parse(req.body);
  }
  catch (e : any) {
    if(e.errors) return res.status(400).send({ message: e.errors[0].message });
    else return res.status(400).send({ message: "Invalid input" });
  }

  // check if the user exists
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
    },
  });
  if (!user) {
    return res.status(404).send({ message: "User not found" , path : "signup" });
  }

  // update the user and send the OTP
  const hashedPassword = await bcrypt.hash(input.newPassword, 10);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      newPassword: hashedPassword,
    },
  });
  const otpResponse = await sendOTP(input.email, "reset");
  if (otpResponse.error)
    return res.status(500).send({ message: "Error sending OTP" });
  return res.status(200).send({ message: "OTP sent for password reset", path : "resetPassword"  });
}