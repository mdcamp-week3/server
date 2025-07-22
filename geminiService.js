import axios from 'axios';
import dotenv from 'dotenv';
import ParticipantAnalysis from './models/ParticipantAnalysis.js';

dotenv.config();

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function analyzeConversation(conversationText, otherName) {
  const prompt = `
  다음은 "나"와 "${otherName}"의 카카오톡 대화입니다.

  ${conversationText}

  아래와 같은 JSON 형식으로만 출력하세요. 반드시 JSON 외에는 아무 설명도 넣지 마세요. 값이 없으면 0으로 표시하세요. 모든 수치는 0.0 ~ 1.0 사이의 실수로, 총 메시지 수는 정수로 표현하세요.

  {
    "나": {
      "emotionPositiveRatio": (긍정 감정 비율),
      "emotionNegativeRatio": (부정 감정 비율),
      "neutralRatio": (중립 감정 비율),
      "questionRate": (질문 비율),
      "directLikeExpressionCount": (직접적인 호감 표현 수),
      "avgResponseDelay": (응답 지연 평균, 분 단위),
      "totalMessages": (전체 메시지 수)
    },
    "${otherName}": {
      위와 동일하게 작성
    }
  }
  `;

  try {
    const res = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );

    const rawText = res.data.candidates?.[0]?.content?.parts?.[0]?.text;


    const blocks = [...rawText.matchAll(/```json\s*([\s\S]*?)```/gi)];
    if (blocks.length === 0) throw new Error('JSON 코드블록을 찾을 수 없습니다.');

    let merged = {};
    for (const [, jsonBlock] of blocks) {
      try {
        const parsed = JSON.parse(jsonBlock.trim());
        merged = { ...merged, ...parsed }; // 병합
      } catch (err) {
        console.warn('JSON 파싱 실패 블록:\n', jsonBlock);
        continue;
      }
    }

    if (!merged['나']) throw new Error('"나" 분석 결과 없음');

    return merged;
    
  } catch (error) {
    console.error('Gemini 분석 실패:', error?.response?.data || error.message);
    throw error;
  }
}


export async function analyzeAndSave(conversationId, parsedDialogues) {
  const conversationText = parsedDialogues
    .map(d => `${d.name}: ${d.text}`)
    .join('\n');

  const otherName = parsedDialogues.find(d => d.speaker === '너')?.name || '상대방'
  const result = await analyzeConversation(conversationText, otherName);

  for (const speaker of ['나', otherName]) {
    const data = result[speaker];

    if (
      !data ||
      typeof data.emotionPositiveRatio !== 'number' ||
      typeof data.totalMessages !== 'number'
    ) {
      console.warn(`"${speaker}" 분석 누락 또는 잘못된 응답:`, data);
      continue;
    }

    const analysis = new ParticipantAnalysis({
      conversationId,
      speaker: speaker === otherName ? '너' : '나',
      otherName,
      emotionPositiveRatio: Number(data.emotionPositiveRatio || 0),
      emotionNegativeRatio: Number(data.emotionNegativeRatio || 0),
      neutralRatio: Number(data.neutralRatio || 0),
      questionRate: Number(data.questionRate || 0),
      directLikeExpressionCount: parseInt(data.directLikeExpressionCount || 0),
      avgResponseDelay: Number(data.avgResponseDelay || 0),
      totalMessages: parseInt(data.totalMessages || 0),
    });

    await analysis.save();
  }

}