"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = void 0;
const zod_1 = require("zod");
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters long').max(100, 'Password must be at most 100 characters long')
});
