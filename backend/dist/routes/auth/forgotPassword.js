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
const forgotPassword_1 = require("../../validations/forgotPassword");
const client_1 = require("@prisma/client");
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // validate the request body
        let input;
        try {
            input = forgotPassword_1.ForgotPasswordSchema.parse(req.body);
        }
        catch (e) {
            if (e.errors)
                return res.status(400).send({ message: e.errors[0].message });
            else
                return res.status(400).send({ message: "Invalid input" });
        }
        // check if the user exists
        const user = yield prisma.user.findUnique({
            where: {
                email: input.email,
            },
            select: {
                id: true,
            },
        });
        if (!user) {
            return res.status(404).send({ message: "User not found", path: "signup" });
        }
        // update the user and send the OTP
        const hashedPassword = yield bcrypt_1.default.hash(input.newPassword, 10);
        yield prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                newPassword: hashedPassword,
            },
        });
        const otpResponse = yield (0, sendEmail_1.default)(input.email, "reset");
        if (otpResponse.error)
            return res.status(500).send({ message: "Error sending OTP" });
        return res.status(200).send({ message: "OTP sent for password reset", path: "resetPassword" });
    });
}
exports.default = forgotPassword;
