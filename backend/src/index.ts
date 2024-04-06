import express from 'express';
import dotenv from 'dotenv';
// import auth from "./routes/auth/index";
import cors from 'cors';

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


// app.use('/auth', auth);


app.get('/', (req, res) => {
  console.log('Hello World!');
  res.send('Hello World!');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is healthy and running on port ${port}`);
});