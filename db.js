import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("❌ MONGODB_URI 환경 변수가 없습니다.");
  }

  try {
    await mongoose.connect(uri, {
      dbName: "talktic",
    });
    console.log("MongoDB 연결 성공");
  } catch (err) {
    console.error("MongoDB 연결 실패:", (err).message);
    process.exit(1);
  }
};
