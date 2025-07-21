import mongoose from "mongoose";


const UploadedConversationSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const UploadedConversation = mongoose.model('UploadedConversation', UploadedConversationSchema);
export default UploadedConversation;
