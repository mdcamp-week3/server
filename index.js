import express from "express";
import { connectDB } from "./db.js";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
