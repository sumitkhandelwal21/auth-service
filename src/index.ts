import express from 'express';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRouter from './routes/auth';
import userRouter from './routes/user';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log('Database connection failed:', error));