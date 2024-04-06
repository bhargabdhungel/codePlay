"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailBodySchema = void 0;
const zod_1 = require("zod");
exports.VerifyEmailBodySchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email" }),
    otp: zod_1.z.string().length(6, { message: "OTP must be 6 digits" }),
});
