"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const login_1 = __importDefault(require("./login"));
const signup_1 = __importDefault(require("./signup"));
const verifyEmail_1 = __importDefault(require("./verifyEmail"));
const forgotPassword_1 = __importDefault(require("./forgotPassword"));
const resetPassword_1 = __importDefault(require("./resetPassword"));
const me_1 = __importDefault(require("./me"));
const authRouter = express_1.default.Router();
authRouter.use((0, cookie_parser_1.default)());
authRouter.post("/resetPassword", resetPassword_1.default);
authRouter.post("/forgotPassword", forgotPassword_1.default);
authRouter.post("/verifyEmail", verifyEmail_1.default);
authRouter.post("/signup", signup_1.default);
authRouter.post("/login", login_1.default);
authRouter.get("/me", me_1.default);
exports.default = authRouter;
