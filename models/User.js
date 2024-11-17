import mongoose from "mongoose";

export const userSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender:  {
      type: String,
      enum: ["male", "female",'others'],
      default: "others",
    },
    password: { type: String, required: true },
    normalPassword: { type: String, required: true },
    panImage: { type: String, required: true },
    aadharImage: { type: String, required: true },
    clientImage: { type: String, required: true },
    phone: { type: String, required: true },
    panNumber: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    address: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    dob: { type: Date, required: true },
    accountType: {
      type: String,
      enum: ["saving", "current"],
      default: "current",
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


export default mongoose.model("User", userSchema);
