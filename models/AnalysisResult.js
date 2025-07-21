import mongoose from "mongoose";

const AnalysisResultSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'UploadedConversation', required: true },
  meScore: { type: Number, required: true },
  youScore: { type: Number, required: true },
  finalLikeScore: { type: Number, required: true }
});

const AnalysisResult = mongoose.model('AnalysisResult', AnalysisResultSchema);
export default AnalysisResult;