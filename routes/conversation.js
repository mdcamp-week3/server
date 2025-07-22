import express from 'express';
import UploadedConversation from '../models/UploadedConversation.js';

const router = express.Router();

router.post('/upload', async (req, res) => {
  try {
    const { ocrResult, parsedDialogues } = req.body;
    const conv = new UploadedConversation({ ocrResult, parsedDialogues });
    await conv.save();
    res.json({ conversationId: conv._id });
  } catch (err) {
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

export default router;