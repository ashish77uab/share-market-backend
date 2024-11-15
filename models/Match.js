import mongoose from "mongoose";

const matchSchema = mongoose.Schema(
  {
    home: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    away: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    time: {
      type: Date,
      required: true,

    },
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    prize: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PrizePyramid",
    },
    location: {
      type: String,
    },
    toss: {
      type: String,
      enum: ["Pending", "Home", "Away"],
      default: "Pending",
      required: true,
    },
    isTop: {
      type: Boolean,
      default: false,
    },
    isDistributed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Live", "Completed"],
      default: "Pending",
      required: true,
    },
    joinedTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);
