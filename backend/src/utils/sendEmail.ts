import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

function generateSixDigitOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
  }
  return otp;
}

export default async function sendOTP(email : string, otpFor : string) {
  try {
    const otp = generateSixDigitOTP();

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: "OTP for email verification",
      text: `OTP : ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    if(otpFor === "email"){
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          otp,
          otpExpire: new Date(Date.now() + 600000), // OTP expires in 10 minutes
        },
      });
    } 
    else{
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          resetToken: otp,
          resetTokenExpire: new Date(Date.now() + 600000), // OTP expires in 10 minutes
        },
      });
    }
    return { success: "OTP sent successfully" };

  } catch (error) {
    console.log(process.env.APP_EMAIL);
    console.log(process.env.APP_PASSWORD);
    console.log(error);
    return { error: "Error sending OTP" };
  }
}