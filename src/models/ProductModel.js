import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productCode: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock must be greater than or equal to 0'],
  },
  stockType: {
    type: String,
    enum: ["SOH", "PRE"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  }
});

productSchema.pre("save", function(next) {
  const now = Date.now();
  this.updatedAt = now;
  
  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

export default mongoose.model('Product', productSchema);
