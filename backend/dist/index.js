"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// import auth from "./routes/auth/index";
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// app.use('/auth', auth);
app.get('/', (req, res) => {
    console.log('Hello World!');
    res.send('Hello World!');
});
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is healthy and running on port ${port}`);
});
