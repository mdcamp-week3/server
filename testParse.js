import fs from 'fs';
import { parseKakaoOCRWithAlternatingPattern } from './ocrParser.js'; // 함수가 들어있는 파일명에 맞게 수정
import path from 'path';

// OCR JSON 파일 불러오기
const ocrJsonPath = path.join('./test_ocr.json'); // 예: JSON을 이 경로에 저장했다고 가정
const rawData = fs.readFileSync(ocrJsonPath, 'utf-8');
const ocrJson = JSON.parse(rawData);

// 이미지의 가로 크기 지정 (OCR JSON 안에도 있지만, 직접 명시함)
const imageWidth = 353;

// 파싱 실행
const parsedResult = parseKakaoOCRWithAlternatingPattern(ocrJson, imageWidth);

// 결과 출력
console.log('✅ 대화 파싱 결과:');
parsedResult.forEach((line, i) => {
  console.log(`${i + 1}. [${line.speaker}] [${line.name}] ${line.text}`);
});
