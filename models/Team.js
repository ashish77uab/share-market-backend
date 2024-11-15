import mongoose from "mongoose";

const teamSchema = mongoose.Schema(
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
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    description: {
      type: String,
    },
    players:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
