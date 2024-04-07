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
const client_1 = require("@prisma/client");
const resetPassword_1 = require("../../validations/resetPassword");
const prisma = new client_1.PrismaClient();
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // validate the request body
        let input;
        try {
            input = resetPassword_1.ResetPasswordSchema.parse(req.body);
        }
        catch (e) {
            if (e.errors)
                return res.status(400).send({ message: e.errors[0].message });
            else
                return res.status(400).send({ message: "Invalid input" });
        }
        // check if the user exists and has not attempted OTP verification more than 10 times
        const user = yield prisma.user.findUnique({
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
        const userWithOtp = yield prisma.user.findFirst({
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
            yield prisma.user.update({
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
        yield prisma.user.update({
            where: {
                id: userWithOtp.id,
            },
            data: {
                password: userWithOtp.newPassword,
            },
        });
        return res
            .status(200)
            .send({ message: "Password reset successfully", path: "" });
    });
}
exports.default = resetPassword;
