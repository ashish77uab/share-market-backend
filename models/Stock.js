import mongoose from "mongoose";

export const stockSchema = mongoose.Schema(
  {
    startPrice: { type: Number, required: true },
    endPrice: { type: Number, required: true },
    name: { type: Number, required: true },
  
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model("Stock", stockSchema);
