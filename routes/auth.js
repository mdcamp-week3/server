import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// 회원가입
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body; 
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash }); 
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: '이미 존재하는 이메일이거나 오류 발생' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token, userId: user._id });
});

export default router;