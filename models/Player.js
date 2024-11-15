import mongoose from "mongoose";
import { DesignationConstant, RoleConstant } from "../utils/constant.js";

const playerSchema = mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    name: {
      type: String,
      required: true,

    },
   points:{
     type: Number,
     default: 0,
    },
   credits:{
     type: Number,
     default: 0,
    },
    designation: {
      type: String,
      enum: Object.values(DesignationConstant),
      default: DesignationConstant?.None,
      required: true,
    },
    role:{
      type: String,
      enum: Object.values(RoleConstant),
      default: RoleConstant.Batsman,
      required: true,
    },
    isPlaying:{
      type: Boolean,
      default: false,
    },
    match:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
    },
    image:{
      type: String,
      default: null,
    }

  },
  { timestamps: true }
);

export default mongoose.model("Player", playerSchema);
