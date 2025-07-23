import express from 'express';
import AnalysisResult from '../models/AnalysisResult.js';
import UploadedConversation from '../models/UploadedConversation.js';

const router = express.Router();

router.post('/upload', async (req, res) => {
  try {
    const { ocrResult, parsedDialogues, userId } = req.body; 
    const conv = new UploadedConversation({ ocrResult, parsedDialogues, userId });
    await conv.save();
    res.json({ conversationId: conv._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '대화 저장 실패' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const conversation = await UploadedConversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Not found' });
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 썸 지수 변화 API 추가
router.get('/sum-score-change/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // 유저가 업로드한 대화 목록(최신순)
    const conversations = await UploadedConversation.find({ userId }).sort({ createdAt: -1 });

    if (conversations.length < 2) {
      return res.status(400).json({ message: '비교할 대화가 2개 이상 필요합니다.' });
    }

    // 최근 2개의 대화
    const [latest, previous] = conversations;

    // 각 대화의 분석 결과 조회
    const latestResult = await AnalysisResult.findOne({ conversationId: latest._id });
    const previousResult = await AnalysisResult.findOne({ conversationId: previous._id });

    if (!latestResult || !previousResult) {
      return res.status(404).json({ message: '분석 결과를 찾을 수 없습니다.' });
    }

    // 썸 지수(finalLikeScore) 변화 계산
    const change = latestResult.finalLikeScore - previousResult.finalLikeScore;

    res.json({
      latest: {
        conversationId: latest._id,
        finalLikeScore: latestResult.finalLikeScore,
        createdAt: latest.createdAt,
      },
      previous: {
        conversationId: previous._id,
        finalLikeScore: previousResult.finalLikeScore,
        createdAt: previous.createdAt,
      },
      change, // 변화량
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;