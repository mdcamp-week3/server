import mongoose from "mongoose";

const ICategorySchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const ICategory = mongoose.model('ICategory', ICategorySchema);
export default ICategory;