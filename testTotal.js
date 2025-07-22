import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { analyzeAndSave } from './geminiService.js';
import { parseKakaoOCRWithAlternatingPattern } from './ocrParser.js';
import fs from 'fs';

dotenv.config();

// 1. MongoDB 연결
await mongoose.connect(process.env.MONGODB_URI);

// 2. OCR JSON 로드
const ocrJson = JSON.parse(fs.readFileSync('./test_ocr.json', 'utf8'));
const imageWidth = 353;

// 3. 대화 파싱
const parsedDialogues = parseKakaoOCRWithAlternatingPattern(ocrJson, imageWidth);

// 4. 분석 및 저장
const conversationId = new mongoose.Types.ObjectId('66a4cdeaf5d9c0f3e4d8499a');
await analyzeAndSave(conversationId, parsedDialogues);

await mongoose.disconnect();