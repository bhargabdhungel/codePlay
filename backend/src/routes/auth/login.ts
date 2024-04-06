import { loginUserSchema } from "../../validations/loginUser";
import { PrismaClient } from "@prisma/client";
import { LoginUser } from "../../validations/loginUser";
import sendOTP from "../../utils/sendEmail";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";


const prisma = new PrismaClient();

export default async function login(req : Request, res : Response) {
  // Validate the input
  let inputUser : LoginUser;
  try {
    inputUser = loginUserSchema.parse(req.body);
  }
  catch (e : any) {
    if(e.errors) return res.status(400).send({ message : e.errors[0].message });
    else return res.status(400).send({ message : "Invalid input" });
  }

  // Check if the user exists && is verified
  const user = await prisma.user.findUnique({
    where: {
      email: inputUser.email,
    },
    select:{
      verified: true,
      password: true,
      email: true,
      id: true,
    }
  });
  if (!user) {
    return res.status(401).send({ message: "user not found" , path : "signup" });
  }
  else{
    if(!user.verified){
      const otpResponse = await sendOTP(user.email, "email");
      if(otpResponse.error){
        return res.status(500).send({ message: "Error sending OTP" });
      }
      return res.status(401).send({ message: "User not verified", path : "verify" });
    }
  }

  // Check if the password is correct
  const passwordMatch = await bcrypt.compare(inputUser.password, user.password);
  if (!passwordMatch) {
    return res.status(401).send({ message: "Incorrect password" });
  }

  // check if the user is verified or not
  if(!user.verified){
    const otpResponse = await sendOTP(user.email , "email");
    if(otpResponse.error){
      return res.status(500).send({ message: "Error sending OTP" });
    }
    return res.status(401).send({ message: "OTP sent for verification", path : "verify" });
  }

  // Generate JWT token and send it in a cookie
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 15,
  });
  return res.status(200).send({ message: "Login successful" });
}