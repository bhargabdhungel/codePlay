"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const transporter = nodemailer_1.default.createTransport({
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
function sendOTP(email, otpFor) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const otp = generateSixDigitOTP();
            const mailOptions = {
                from: process.env.APP_EMAIL,
                to: email,
                subject: "OTP for email verification",
                text: `OTP : ${otp}`,
            };
            yield transporter.sendMail(mailOptions);
            if (otpFor === "email") {
                yield prisma.user.update({
                    where: {
                        email,
                    },
                    data: {
                        otp,
                        otpExpire: new Date(Date.now() + 600000), // OTP expires in 10 minutes
                    },
                });
            }
            else {
                yield prisma.user.update({
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
        }
        catch (error) {
            console.log(process.env.APP_EMAIL);
            console.log(process.env.APP_PASSWORD);
            console.log(error);
            return { error: "Error sending OTP" };
        }
    });
}
exports.default = sendOTP;
