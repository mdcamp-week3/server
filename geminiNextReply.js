import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

/**
 * 카톡 대화 배열을 받아 다음에 할 만한 답변을 Gemini로부터 추천받는다.
 * @param {Array<{name: string, text: string}>} parsedDialogues
 * @returns {Promise<string>} 추천 답변
 */
export async function getNextReplyRecommendation(parsedDialogues) {
  const conversationText = parsedDialogues
    .map(d => `${d.name}: ${d.text}`)
    .join('\n');

  const prompt = `
다음은 카카오톡 대화입니다.

${conversationText}

이 대화의 흐름을 자연스럽게 이어갈 수 있는 다음 카톡 답변 한 문장을 추천해줘.
- 반드시 답변 문장만 출력해. (설명, 인사, 기타 텍스트 없이)
- 답변은 썸타는 사이에 과하지 않게 자연스럽고 상황에 어울리게 작성해줘.
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

    const reply = res.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) throw new Error('추천 답변 없음');
    return reply;
  } catch (error) {
    console.error('Gemini 답변 추천 실패:', error?.response?.data || error.message);
    throw error;
  }
} 