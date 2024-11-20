import mongoose from "mongoose";

export const purchaseStockSchema = mongoose.Schema(
  {
    quantity: { type: Number, required: true },
    startPrice: { type: Number, required: true },
    endPrice: { type: Number, required: true },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
    actionType: {
      type: String,
      enum: ["Buy", "Sell"],
      default: "Buy",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model("PurchaseStock", purchaseStockSchema);
