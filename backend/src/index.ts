import express from 'express';
import dotenv from 'dotenv';
import auth from "./routes/auth/index";
import cors from 'cors';

dotenv.config();


const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(cors());
app.use('/auth', auth);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is healthy and running on port ${port}`);
});
