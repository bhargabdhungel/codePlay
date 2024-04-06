import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { SignupUser, signupUserSchema } from "../../validations/signupUser";
import bcrypt from "bcrypt";
import sendOTP from "../../utils/sendEmail";

const prisma = new PrismaClient();

export default async function signup(req : Request, res : Response) {
  // Validate the input
  let inputUser : SignupUser;
  try {
    inputUser = signupUserSchema.parse(req.body);
  }
  catch (e : any) {
    if(e.errors) return res.status(400).send({ message : e.errors[0].message });
    else return res.status(400).send({ message : "Invalid input" });
  }

  // Check if the user already exists
  const user = await prisma.user.findUnique({
    where: {
      email: inputUser.email,
    },
    select: {
      id: true,
    },
  });
  if (user) {
    return res.status(409).send({ message: "User already exists", path : "login" });
  }

  // Create the user and send the OTP
  const hashedPassword = await bcrypt.hash(inputUser.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: inputUser.email,
      password: hashedPassword,
    },
  });
  const otpResponse = await sendOTP(newUser.email, "email");
  if(otpResponse.error){
    return res.status(500).send({ message: "Error sending OTP" });
  }
  return res.status(201).send({ message: "User created", path : "verify" });
}