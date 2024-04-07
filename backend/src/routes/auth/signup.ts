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

  // Check if the user already exists with the same email or username
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: inputUser.email },
        { name: inputUser.username }
      ]
    },
    select: {
      verified: true,
      email: true,
      name: true,
    }
  });



  if (user) {
    if(user.email == inputUser.email){
      return res.status(409).send({ message: "Email already registered", path : "login" });
    }
    else if(user.name == inputUser.username){
      return res.status(409).send({ message: "username already taken"});
    }
  }

  // Create the user and send the OTP
  const hashedPassword = await bcrypt.hash(inputUser.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: inputUser.email,
      password: hashedPassword,
      name: inputUser.username,
    },
  });
  const otpResponse = await sendOTP(newUser.email, "email");
  if(otpResponse.error){
    return res.status(500).send({ message: "Error sending OTP" });
  }
  return res.status(201).send({ message: "OTP sent for verification", path : "verifyEmail" , data : {
    email : newUser.email
  }});
}