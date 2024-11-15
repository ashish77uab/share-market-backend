import mongoose from "mongoose";

const tournamentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tournament", tournamentSchema);
