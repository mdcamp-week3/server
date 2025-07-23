import mongoose from "mongoose";


const UploadedConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ocrResult: Object,
  parsedDialogues: Array,
  createdAt: { type: Date, default: Date.now }
});

const UploadedConversation = mongoose.model('UploadedConversation', UploadedConversationSchema);
export default UploadedConversation;
