import mongoose from "mongoose";


const UploadedConversationSchema = new mongoose.Schema({
  ocrResult: Object,
  parsedDialogues: Array,
  createdAt: { type: Date, default: Date.now }
});

const UploadedConversation = mongoose.model('UploadedConversation', UploadedConversationSchema);
export default UploadedConversation;
