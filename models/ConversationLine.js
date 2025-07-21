import mongoose from "mongoose";

const ConversationLineSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'UploadedConversation', required: true },
  speaker: { type: String, enum: ['나', '너'], required: true },
  text: { type: String, required: true },
  order: { type: Number, required: true },
  timestamp: { type: Date },
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], required: true },
  containsLikeExpression: { type: Boolean, default: false },
  containsQuestion: { type: Boolean, default: false },
  emojiCount: { type: Number, default: 0 }
});

const ConversationLine = mongoose.model('ConversationLine', ConversationLineSchema);
export default ConversationLine;