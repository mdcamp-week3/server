import express from "express";
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import categoryDetailRouter from "./routes/categoryDetails.js";
import analyzeRouter from "./routes/analyze.js";
import cors from 'cors';
import imageRoutes from './routes/imageRoutes.js';

connectDB();

dotenv.config();
const app = express();

connectDB();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/image', imageRoutes); // '/api/image/upload' 경로가 되게 설정

app.use('/api/categoryDetails', categoryDetailRouter)

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

const port = process.env.PORT || 3000;

app.use('/api/category-details', categoryDetailRouter)
app.use('/api/analyze', analyzeRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
