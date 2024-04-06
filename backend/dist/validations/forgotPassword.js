"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.ForgotPasswordSchema = zod_1.default.object({
    email: zod_1.default.string().email({ message: "Invalid email" }),
    newPassword: zod_1.default.string().min(6, { message: "Password must be at least 6 characters" }),
});
