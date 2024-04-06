import express from 'express';
import cookieParser from 'cookie-parser';
import login from './login';
import signup from './signup';
import verifyEmail from './verifyEmail';
import forgotPassword from './forgotPassword';
import logout from './logout';
import resetPassword from './resetPassword';

const authRouter = express.Router();
authRouter.use(cookieParser());

authRouter.post('/resetPassword', resetPassword);
authRouter.post('/logout',logout);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.post('/verifyEmail', verifyEmail);
authRouter.post('/signup', signup);
authRouter.post('/login', login);

export default authRouter;