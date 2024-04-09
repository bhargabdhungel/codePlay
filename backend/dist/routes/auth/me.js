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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function me(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token)
                return res.status(401).send({ message: "Not logged in" });
            // Verify the token
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            }
            catch (e) {
                return res.status(401).send({ message: "Not logged in" });
            }
            if (!decoded || !decoded.userId)
                return res.status(401).send({ message: "Not logged in" });
            // Send the user data
            const user = yield prisma.user.findUnique({
                where: {
                    id: decoded.userId,
                },
                select: {
                    email: true,
                    name: true,
                    role: true,
                },
            });
            if (!user)
                return res.status(401).send({ message: "User not found" });
            return res.status(200).send({
                data: user,
            });
        }
        catch (e) {
            return res.status(500).send({ message: "Internal server error" });
        }
    });
}
exports.default = me;
