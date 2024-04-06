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
const express_1 = __importDefault(require("express"));
const loginUser_1 = require("../../validations/loginUser");
const authRouter = express_1.default.Router();
const client_1 = require("@prisma/client");
const signupUser_1 = require("../../validations/signupUser");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
authRouter.use((0, cookie_parser_1.default)());
authRouter.get('/logout', (req, res) => {
    res.clearCookie("token");
    return res.status(200).send({ message: "Logged out" });
});
authRouter.get('/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield prisma.user.findUnique({
            where: {
                id: payload.userId
            },
            select: {
                name: true,
                email: true,
            },
        });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).send({ user });
    }
    catch (error) {
        return res.status(401).send({ message: "Unauthorized" });
    }
}));
authRouter.post('/forgot-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const newPass = req.body.newPassword;
    const emailSchema = zod_1.default.string().email({ message: "Invalid email" });
    const newPassSchema = zod_1.default.string().min(6, { message: "Password must be at least 6 characters" });
    try {
        emailSchema.parse(email);
        newPassSchema.parse(newPass);
    }
    catch (e) {
        return res.status(400).send({ message: e.errors[0].message });
    }
    const user = yield prisma.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
        },
    });
    if (!user) {
        return res.status(404).send({ message: "User not found", path: "signup" });
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPass, 10);
    // todo 
    yield prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            resetToken: hashedPassword,
            resetTokenExpire: new Date(Date.now() + 600000), // 10 minutes
        },
    });
    const otpResponse = yield (0, sendEmail_1.default)(email, "reset");
    if (otpResponse.error) {
        return res.status(500).send({ message: "Error sending OTP" });
    }
    return res.status(200).send({ message: "OTP sent for password reset", path: "reset-password" });
}));
authRouter.post('/reset-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // todo : 
    // validate the request body
    const otp = req.body.otp;
    const email = req.body.email;
    const otpSchema = zod_1.default.string().length(6, { message: "OTP must be 6 digits" });
    const emailSchema = zod_1.default.string().email({ message: "Invalid email" });
    try {
        otpSchema.parse(otp);
        emailSchema.parse(email);
    }
    catch (e) {
        return res.status(400).send({ message: e.errors[0].message });
    }
    // if no user found with the email return 404
    const user = yield prisma.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            resetToken: true,
            resetTokenExpire: true,
            resetTokenAttempt: true,
        },
    });
    if (!user) {
        return res.status(404).send({ message: "User not found", path: "signup" });
    }
    if (user.resetTokenAttempt >= 10) {
        return res.status(401).send({ message: "Too many attempts" });
    }
    // check if the otp is correct and not expired
    const userWithOtp = yield prisma.user.findFirst({
        where: {
            email: email,
            resetToken: otp,
            resetTokenExpire: {
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
                email: email,
            },
            data: {
                resetTokenAttempt: {
                    increment: 1,
                },
            },
        });
        return res.status(401).send({ message: "Invalid OTP" });
    }
    // update the password
    // : todo
    // const 
}));
authRouter.post('/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validate the request body
    const otp = req.body.otp;
    const email = req.body.email;
    const otpSchema = zod_1.default.string().length(6, { message: "OTP must be 6 digits" });
    const emailSchema = zod_1.default.string().email({ message: "Invalid email" });
    try {
        otpSchema.parse(otp);
        emailSchema.parse(email);
    }
    catch (e) {
        return res.status(400).send({ message: e.errors[0].message });
    }
    // if no user found with the email return 404
    const user = yield prisma.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            otpAttempt: true,
        },
    });
    if (!user) {
        return res.status(404).send({ message: "User not found", path: "signup" });
    }
    if (user.otpAttempt >= 10) {
        return res.status(401).send({ message: "Too many attempts" });
    }
    const userWithOtp = yield prisma.user.findFirst({
        where: {
            email: email,
            otp: otp,
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
                email: email,
            },
            data: {
                otpAttempt: {
                    increment: 1,
                },
            },
        });
        return res.status(401).send({ message: "Invalid OTP" });
    }
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
    if (!user) {
        return res.status(401).send({ message: "Ivalid OTP" });
    }
    return res.status(200).send({ message: "User verified successfully", path: "home" });
}));
authRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputUser;
    // Validate the request body
    try {
        inputUser = signupUser_1.signupUserSchema.parse(req.body);
    }
    catch (e) {
        return res.status(400).send({ message: e.errors[0].message });
    }
    // Check if the user already exists in the database with the same email
    const existingUser = yield prisma.user.findUnique({
        where: {
            email: inputUser.email
        },
        select: {
            id: true,
            verified: true,
        },
    });
    if (existingUser) {
        if (existingUser.verified) {
            return res.status(409).send({ message: "User already exists", path: "login" });
        }
        else {
            const otpResponse = yield (0, sendEmail_1.default)(inputUser.email, "email");
            if (otpResponse.error) {
                return res.status(500).send({ message: "Error sending OTP" });
            }
            return res.status(409).send({ message: "OTP sent for verification", path: "verify" });
        }
    }
    // Check if the user already exists in the database with the same username
    const existingUsername = yield prisma.user.findUnique({
        where: {
            name: inputUser.username,
        },
        select: {
            id: true,
        },
    });
    if (existingUsername) {
        return res.status(409).send({ message: "Username already taken" });
    }
    // Create the user in the database
    const hashedPassword = yield bcrypt_1.default.hash(inputUser.password, 10);
    const user = yield prisma.user.create({
        data: {
            email: inputUser.email,
            name: inputUser.username,
            password: hashedPassword,
        },
        select: {
            email: true,
        },
    });
    const otpResponse = yield (0, sendEmail_1.default)(user.email, "email");
    if (otpResponse.error) {
        return res.status(500).send({ message: "Error sending OTP" });
    }
    return res.status(201).send({ message: "User created successfully", email: user.email, path: "verify" });
}));
authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputUser = { email: "", password: "" };
    // Validate the request body
    try {
        inputUser = loginUser_1.loginUserSchema.parse(req.body);
    }
    catch (e) {
        if (e.errors)
            return res.status(400).send({ message: e.errors[0].message });
        else
            return res.status(400).send({ message: "Invalid input" });
    }
    // Check if the user exists in the database
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
    if (!user) {
        return res.status(401).send({ message: "user not found", path: "signup" });
    }
    else {
        if (!user.verified) {
            const otpResponse = yield (0, sendEmail_1.default)(user.email, "email");
            if (otpResponse.error) {
                return res.status(500).send({ message: "Error sending OTP" });
            }
            return res.status(401).send({ message: "User not verified", path: "verify" });
        }
    }
    // Check if the password is correct
    const passwordMatch = yield bcrypt_1.default.compare(inputUser.password, user.password);
    if (!passwordMatch) {
        return res.status(401).send({ message: "Incorrect password" });
    }
    // check if the user is verified or not
    const otpResponse = yield (0, sendEmail_1.default)(user.email, "email");
    if (otpResponse.error) {
        return res.status(500).send({ message: "Error sending OTP" });
    }
    if (!user.verified) {
        return res.status(401).send({ message: "OTP sent for verification", path: "verify" });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 15,
    });
    return res.status(200).send({ message: "Login successful" });
}));
exports.default = authRouter;
