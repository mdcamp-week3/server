import mongoose from "mongoose";

const ICategoryDetailSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ICategory', required: true },
  content: { type: String, required: true }
});


const ICategoryDetail = mongoose.model('ICategoryDetail', ICategoryDetailSchema);
export default ICategoryDetail;