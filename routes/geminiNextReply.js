import express from 'express';
import { getNextReplyRecommendation } from '../geminiNextReply.js';

const router = express.Router();

router.post('/next-reply', async (req, res) => {
  try {
    const { parsedDialogues } = req.body;
    if (!parsedDialogues) return res.status(400).json({ error: 'parsedDialogues 누락' });

    const recommendedReply = await getNextReplyRecommendation(parsedDialogues);
    res.json({ recommendedReply });
  } catch (err) {
    res.status(500).json({ error: err.message || '추천 실패' });
  }
});

export default router;
