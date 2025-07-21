import mongoose from 'mongoose';
import { connectDB } from "../db.js";
import ICategory from "../models/ICategory.js"; // 반드시 default export여야 함

// MongoDB 연결
await connectDB();

const categories = [
  "컨텐츠 공유형",
  "너에 대해 더 알고 싶어",
  "설렘이 필요할 때",
  "취향 공유하기",
  "과거 이야기",
  "은근히 떠보기",
  "만약에 시리즈",
  "연애 가치관",
  "일상 공유형",
  "이상형 토크",
  "연애 밸런스 게임",
  "티나는 호감 표현",
  "TMI 폭격!"
];

async function insertCategories() {
  try {
    // 기존 데이터 모두 삭제
    await ICategory.deleteMany({});
    console.log("🗑 기존 카테고리 삭제 완료");

    // 새 데이터 삽입
    const docs = await ICategory.insertMany(
      categories.map(name => ({ name }))
    );
    console.log("✅ 새 카테고리 저장 완료:", docs);
  } catch (error) {
    console.error("❌ 저장 실패:", error);
  } finally {
    await mongoose.disconnect();
  }
}

insertCategories();
