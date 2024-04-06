"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.ResetPasswordSchema = zod_1.default.object({
    otp: zod_1.default.string().length(6, { message: "OTP must be 6 digits" }),
    email: zod_1.default.string().email({ message: "Invalid email" }),
});
