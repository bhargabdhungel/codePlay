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
Object.defineProperty(exports, "__esModule", { value: true });
const verifyEmailBody_1 = require("../../validations/verifyEmailBody");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function verifyEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate the input
        let inputUser;
        try {
            inputUser = verifyEmailBody_1.VerifyEmailBodySchema.parse(req.body);
        }
        catch (e) {
            if (e.errors)
                return res.status(400).send({ message: e.errors[0].message });
            else
                return res.status(400).send({ message: "Invalid input" });
        }
        // Check if the user exists and has not attempted OTP verification more than 10 times
        const user = yield prisma.user.findUnique({
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
            return res.status(401).send({ message: "Too many attempts" });
        // Check if the OTP is correct and has not expired
        const userWithOtp = yield prisma.user.findFirst({
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
            yield prisma.user.update({
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
        yield prisma.user.update({
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
        return res.status(200).send({ message: "User verified", path: "home" });
    });
}
exports.default = verifyEmail;
