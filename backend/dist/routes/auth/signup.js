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
const client_1 = require("@prisma/client");
const signupUser_1 = require("../../validations/signupUser");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const prisma = new client_1.PrismaClient();
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate the input
        let inputUser;
        try {
            inputUser = signupUser_1.signupUserSchema.parse(req.body);
        }
        catch (e) {
            if (e.errors)
                return res.status(400).send({ message: e.errors[0].message });
            else
                return res.status(400).send({ message: "Invalid input" });
        }
        // Check if the user already exists with the same email or username
        const user = yield prisma.user.findFirst({
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
            if (user.email == inputUser.email) {
                return res.status(409).send({ message: "Email already registered", path: "login" });
            }
            else if (user.name == inputUser.username) {
                return res.status(409).send({ message: "username already taken" });
            }
        }
        // Create the user and send the OTP
        const hashedPassword = yield bcrypt_1.default.hash(inputUser.password, 10);
        const newUser = yield prisma.user.create({
            data: {
                email: inputUser.email,
                password: hashedPassword,
                name: inputUser.username,
            },
        });
        const otpResponse = yield (0, sendEmail_1.default)(newUser.email, "email");
        if (otpResponse.error) {
            return res.status(500).send({ message: "Error sending OTP" });
        }
        return res.status(201).send({ message: "OTP sent for verification", path: "verifyEmail", data: {
                email: newUser.email
            } });
    });
}
exports.default = signup;
