import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  timeUTC: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  platformId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: false,
  },
  isOrder: {
    type: Boolean,
    required: true,
  },
  isFailedOrder: {
    type: Boolean,
    required: true,
  },
  isHighlighted: {
    type: Boolean,
    required: true,
  }
});

export default mongoose.model('Chat', chatSchema);
