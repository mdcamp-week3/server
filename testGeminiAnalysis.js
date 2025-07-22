import dotenv from 'dotenv';
import { analyzeConversation } from './geminiService.js';
import { parseKakaoOCRWithAlternatingPattern } from './ocrParser.js';
import fs from 'fs';

// 1. 환경변수 로드
dotenv.config();

// 2. 샘플 OCR JSON 불러오기 (직접 테스트용 JSON 준비)
const ocrJson = JSON.parse(fs.readFileSync('./test_ocr.json', 'utf8'));

// 3. 이미지 가로 길이 설정 (예: 1080px)
const imageWidth = 353;

// 4. OCR 파싱
const parsedDialogues = parseKakaoOCRWithAlternatingPattern(ocrJson, imageWidth);
console.log('\n✅ 파싱된 대화:', parsedDialogues);

// 5. 텍스트 변환
const conversationText = parsedDialogues
  .map(d => `${d.name}: ${d.text}`)
  .join('\n');

// 6. 상대 이름 추정
const otherName = parsedDialogues.find(d => d.speaker === '너')?.name || '상대방';

// 7. Gemini 분석 실행
console.log('\n📡 Gemini API에 분석 요청 중...');
analyzeConversation(conversationText, otherName)
  .then(result => {
    console.log('\n✅ Gemini 분석 결과:');
    console.dir(result, { depth: null });
  })
  .catch(err => {
    console.error('\n❌ Gemini 분석 실패:', err.message);
  });
