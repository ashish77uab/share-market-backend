import mongoose from "mongoose";
const prizePyramidSchema = mongoose.Schema(
  {
    winningAmount:{
      type: Number,
      default: 0,
      required: true,
    },
    winningPercentage: {
      type: Number,
      default: 0,
      required: true,
    },
    entryFees:{
      type: Number,
      default: 0,
      required: true,
    },
    distributionPyramid:[
      {
        rank: 0,
        prize: 0,
      }
    ],
    rangePyramid:[
      {
        first: 0,
        last: 0,
        prize: 0,
      }
    ],
    
  },
  { timestamps: true }
);

export default mongoose.model("PrizePyramid", prizePyramidSchema);
