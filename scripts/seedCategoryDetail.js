import mongoose from "mongoose";
import dotenv from "dotenv";
import ICategory from "../models/ICategory.js";
import ICategoryDetail from "../models/ICategoryDetail.js";
import { connectDB } from "../db.js";

dotenv.config();
await connectDB();

// 🧸 카테고리별 세부 질문 목록
const categoryDetails = {
  "컨텐츠 공유형": [
    "너 이런 분위기 술집/카페 좋아하지 않아?",
    "이거 진짜 웃겨 ㅋㅋㅋㅋㅋㅋㅋ",
    "이거 보니까 너 생각나서 보냈어 ㅋㅋㅋ 너 닮았는데?",
  ],
  "너에 대해 더 알고 싶어": [
    "요즘 제일 자주 하는 생각이 뭐야?",
    "평소에 혼자 있는 시간에 뭐해?",
    "어릴 때 꿈 뭐였어?",
    "너는 스트레스 받으면 뭐 해?",
    "너 혼자만 알고 싶은 노래 있어? 있으면 하나만 알려주면 안 돼?",
    "너 친구들이 너 보고 어떤 스타일이라고 해?",
  ],
  "설렘이 필요할 때": [
    "나 오늘 하루 중 제일 설렌 순간? 너한테 답장 왔을 때.",
    "네가 좋아하는 사람한테 듣고 싶은 말은 뭐야?",
    "요즘 이상하게 어떤 말 하기만 하면 너가 먼저 떠올라",
  ],
  "취향 공유하기": [
    "요즘 제일 빠져 있는 노래 있어?",
    "넷플릭스 정주행 추천해줘.",
    "좋아하는 계절이 언제야? 왜 좋아해",
    "카페 갈 때 무조건 시키는 메뉴 있어?",
    "최애 영화가 뭐야?",
    "가고싶은 여행지 있어?",
  ],
  "과거 이야기": [
    "학창 시절에 제일 기억에 남는 순간은 언제야?",
    "첫사랑은 언제였어? 아직도 기억나?",
    "어릴 때 별명 있었어?",
  ],
  "은근히 떠보기": [
    "요즘 좋아하는 사람 있어?",
    "혹시 연애할 때 연락 자주 하는 편이야?",
    "너 요즘 누구랑 제일 연락 자주 해?",
  ],
  "만약에 시리즈": [
    "너 무인도 가면 어떻게 할거야?",
    "내가 갑자기 기억상실 걸리면 넌 나한테 뭐부터 말해줄 거야?",
    "우리 둘이 같은 회사 다니면 누가 퇴사 먼저 할까ㅋㅋ",
  ],
  "연애 가치관": [
    "사소한 거에도 감동하는 편이야, 아니면 큰 거에만?",
    "연애할 때 ‘하루 한 통 전화’ 가능한 사람?",
    "연애할 때 서운한 건 바로 말하는 편이야, 참고 넘기는 편이야?",
  ],
  "일상 공유형": [
    "오늘 하루 어땠어? 뭔가 기분 좋은 일 있었어?",
    "오늘 점심 뭐 먹었는지 맞혀볼까?",
    "평소에 주말엔 뭐하면서 쉬어?",
  ],
  "이상형 토크": [
    "솔직히 말해서 이상형 고를 때 외모랑 성격 중 뭐가 더 중요해?",
    "연애 상대에게 꼭 있었으면 하는 성격 3가지 있어?",
    "연예인 중에 이상형 한 명만 고르자면 누구야?",
  ],
  "연애 밸런스 게임": [
    "연락 잘 되는데 무뚝뚝한 사람 vs 연락은 가끔인데 표현 잘하는 사람?",
    "오래 보고 천천히 썸타는 거 vs 빠르게 확 불붙는 썸?",
    "친구 같은 연애 vs 매일 설레는 연애",
    "5년동안 애인 1명 vs 1년동안 애인 5명",
    "평생 카톡만 vs 평생 전화만",
    "먼저 고백하기 vs 고백받기",
    "잘 챙기고 집착하는 애인 vs 무관심한데 쿨한 애인",
    "매일 사랑한다 표현 vs 매달 선물 주기",
    "계획에 따라 데이트 vs 무계획 데이트",
  ],
  "티나는 호감 표현": [
    "너랑 얘기하면 시간 진짜 빨리 가.",
    "너 웃을 때 괜히 나도 따라 웃게 돼.",
    "아까 분명히 피곤했는데 너랑 톡하다가 잠 다 깼어",
  ],
  "TMI 폭격!": [
    "오늘 점심 뭐 먹었게? 맞히면 담에 커피 사줄게",
    "오늘 양말 짝짝이였던 거 지금 알았어.",
    "어제 새벽 3시에 갑자기 ‘고등어도 잘 때 눈 감나?’ 생각나서 검색했는데 감긴대!",
  ],
};

async function insertCategoryDetails() {
  try {
    await ICategoryDetail.deleteMany({});
    console.log("🗑 기존 디테일 모두 삭제");

    const allCategories = await ICategory.find({});

    for (const category of allCategories) {
      const details = categoryDetails[category.name];
      if (!details) continue;

      const detailDocs = details.map((text) => ({
        categoryId: category._id,
        content: text,
      }));

      await ICategoryDetail.insertMany(detailDocs);
      console.log(`✅ ${category.name} → ${details.length}개 저장`);
    }
  } catch (error) {
    console.error("❌ 저장 중 에러 발생:", error);
  } finally {
    await mongoose.disconnect();
  }
}

insertCategoryDetails();
