"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupUserSchema = void 0;
const zod_1 = require("zod");
exports.signupUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    username: zod_1.z.string()
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username must be at most 20 characters long')
        .regex(/^[a-zA-Z0-9]+$/, 'Username must contain only numbers and alphabets'),
    password: zod_1.z.string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password must be at most 100 characters long'),
});
