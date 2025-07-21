import mongoose from "mongoose";


const ParticipantAnalysisSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'UploadedConversation', required: true },
  speaker: { type: String, enum: ['나', '너'], required: true },

  emotionPositiveRatio: { type: Number, required: true },
  emotionNegativeRatio: { type: Number, required: true },
  neutralRatio: { type: Number, required: true },

  emojiUsageRate: { type: Number, required: true },
  questionRate: { type: Number, required: true },
  directLikeExpressionCount: { type: Number, required: true },
  avgResponseDelay: { type: Number, required: true },
  totalMessages: { type: Number, required: true }
});


const ParticipantAnalysis = mongoose.model('ParticipantAnalysis', ParticipantAnalysisSchema);
export default ParticipantAnalysis;