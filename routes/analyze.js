import express from 'express';
import { analyzeAndSave } from '../geminiService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { conversationId, parsedDialogues } = req.body;

  if (!conversationId || !Array.isArray(parsedDialogues)) {
    return res.status(400).json({ error: 'conversationId와 parsedDialogues가 필요합니다.' });
  }

  try {
    await analyzeAndSave(conversationId, parsedDialogues);
    res.json({ success: true });
  } catch (err) {
    console.error('analyzeAndSave 실패:', err);
    res.status(500).json({ error: 'Gemini 분석 및 저장 실패' });
  }
});

export default router;
