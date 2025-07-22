import express from "express";
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import categoryDetailRouter from "./routes/categoryDetails.js";
import analyzeRouter from "./routes/analyze.js";

dotenv.config();
connectDB();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});


app.use('/api/category-details', categoryDetailRouter)
app.use('/api/analyze', analyzeRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
