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
const loginUser_1 = require("../../validations/loginUser");
const client_1 = require("@prisma/client");
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate the input
        let inputUser;
        try {
            inputUser = loginUser_1.loginUserSchema.parse(req.body);
        }
        catch (e) {
            if (e.errors)
                return res.status(400).send({ message: e.errors[0].message });
            else
                return res.status(400).send({ message: "Invalid input" });
        }
        // Check if the user exists && is verified
        const user = yield prisma.user.findUnique({
            where: {
                email: inputUser.email,
            },
            select: {
                verified: true,
                password: true,
                email: true,
                id: true,
            }
        });
        if (!user)
            return res.status(401).send({ message: "user not found", path: "signup" });
        // Check if the password is correct
        const passwordMatch = yield bcrypt_1.default.compare(inputUser.password, user.password);
        if (!passwordMatch) {
            return res.status(401).send({ message: "Incorrect password" });
        }
        // check if the user is verified or not
        if (!user.verified) {
            const otpResponse = yield (0, sendEmail_1.default)(user.email, "email");
            if (otpResponse.error) {
                return res.status(500).send({ message: "Error sending OTP" });
            }
            return res.status(401).send({ message: "OTP sent for verification", path: "verifyEmail", data: {
                    email: user.email
                } });
        }
        // Generate JWT token and send it in a cookie
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 15,
        });
        return res.status(200).send({ path: "home" });
    });
}
exports.default = login;
