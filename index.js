import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import imageRoutes from './routes/imageRoutes.js';
import categoryDetailRouter from './routes/categoryDetails.js';
import {connectDB} from './db.js';

connectDB();

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/image', imageRoutes); // '/api/image/upload' 경로가 되게 설정

app.use('/api/categoryDetails', categoryDetailRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
