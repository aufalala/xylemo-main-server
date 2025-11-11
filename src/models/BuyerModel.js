import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
  buyerName: {
    type: String,
    required: true,
  },
  platformId: {
    type: String,
    unique: true,
    // required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    // required: false,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
});

export default mongoose.model('Buyer', buyerSchema);
