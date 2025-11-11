import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  permLevel: {
    type: Number,
    enum: [1, 2], // 1 = admin (highest permLevel), 2 = promoter
    default: 2,
  },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  }
});

export default mongoose.model('User', userSchema);
