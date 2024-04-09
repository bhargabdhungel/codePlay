import express from "express";
import cookieParser from "cookie-parser";
import login from "./login";
import signup from "./signup";
import verifyEmail from "./verifyEmail";
import forgotPassword from "./forgotPassword";
import resetPassword from "./resetPassword";
import me from "./me";

const authRouter = express.Router();
authRouter.use(cookieParser());

authRouter.post("/resetPassword", resetPassword);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/verifyEmail", verifyEmail);
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", me);
export default authRouter;
