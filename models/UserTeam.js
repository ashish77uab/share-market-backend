import mongoose from "mongoose";
const userTeamSchema = mongoose.Schema(
  {
    match:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    captain:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    viceCaptain:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    players:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      }
    ],
  
  },
  { timestamps: true }
);

export default mongoose.model("UserTeam", userTeamSchema);
