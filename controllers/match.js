import mongoose from "mongoose";
import Match from "../models/Match.js";
import Team from "../models/Team.js";
import PlayerStatHistory from "../models/PlayerStatHistory.js";
import Event from "../models/Event.js";
import Wallet from "../models/Wallet.js";
export const createMatch = async (req, res) => {
  try {

    let match = new Match({
      ...req?.body
    });
    match = await match.save();
    const home = await Team.findById(req.body.home)
    const away = await Team.findById(req.body.away)
    let tempPlayerHistory = [...home.players, ...away.players]?.map((player) => ({ match: match?._id, player: player }))
    await PlayerStatHistory.create(tempPlayerHistory)
    if (!match)
      return res.status(400).json({ message: "the match cannot be created!" });
    res.status(201).json(match);
  } catch (error) {
    console.log(error,'error')
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getMatch = async (req, res) => {
  try {
    const matchId = req.params.id;
    const match = await Match.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(matchId) } // Match by ID
      },
      {
        $lookup: {
          from: "teams", // Collection to join (Team)
          localField: "home", // Field from Match schema
          foreignField: "_id", // Field from Team schema
          as: "home" // Alias for the output (home team details)
        }
      },
      {
        $lookup: {
          from: "teams", // Collection to join (Team)
          localField: "away", // Field from Match schema
          foreignField: "_id", // Field from Team schema
          as: "away" // Alias for the output (away team details)
        }
      },
      {
        $unwind: "$home" // Unwind the array to get a single home team object
      },
      {
        $unwind: "$away" // Unwind the array to get a single away team object
      },
      {
        $lookup: {
          from: "prizepyramids", // Collection to join (Team)
          localField: "prize", // Field from Match schema
          foreignField: "_id", // Field from Team schema
          as: "prize" // Alias for the output (home team details)
        }
      },
      {
        $unwind: "$prize" // Unwind the array to have a single team object
      },
      {
        $lookup: {
          from: "events", // Collection to join (Event)
          let: { matchId: "$_id" }, // Pass match _id to the lookup
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$match", "$$matchId"] } // Match event's matchId with the current match
              }
            },
            {
              $count: "eventCount" // Count the number of matching events
            }
          ],
          as: "eventCount" // Alias for the output
        }
      },
      {
        $lookup: {
          from: "players", // Collection to join (Player)
          localField: "home._id", // Field from home team (Team schema)
          foreignField: "team", // Field from Player schema
          as: "home.players" // Alias for the players of the home team
        }
      },
     
      {
        $lookup: {
          from: "players", // Collection to join (Player)
          localField: "away._id", // Field from away team (Team schema)
          foreignField: "team", // Field from Player schema
          as: "away.players" // Alias for the players of the away team
        }
      },
      {
        $group: {
          _id: "$_id",
          home: { $first: "$home" },
          away: { $first: "$away" },
          time: { $first: "$time" },
          tournament: { $first: "$tournament" },
          location: { $first: "$location" },
          toss: { $first: "$toss" },
          isTop: { $first: "$isTop" },
          winningAmount: { $first: "$winningAmount" },
          entryFees: { $first: "$entryFees" },
          winningPercentage: { $first: "$winningPercentage" },
          status: { $first: "$status" },
          prize: { $first: "$prize" },
          eventCount: { $first: "$eventCount" },
          isDistributed: { $first: "$isDistributed" },
        }
      }
    ]);

    if (!match || match.length === 0) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json(match[0]); // Return the first and only match
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const getAllMatchOfTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const matchList = await Match.aggregate([
      {
        $match: { tournament: mongoose.Types.ObjectId(id) } // Match tournament ID
      },
      {
        $lookup: {
          from: "teams", // Collection to join (Team)
          localField: "home", // Field from Match schema
          foreignField: "_id", // Field from Team schema
          as: "home" // Alias for the output (home team details)
        }
      },
      {
        $lookup: {
          from: "teams", // Collection to join (Team)
          localField: "away", // Field from Match schema
          foreignField: "_id", // Field from Team schema
          as: "away" // Alias for the output (away team details)
        }
      },
      {
        $lookup: {
          from: "prizepyramids", // Collection to join (Team)
          localField: "prize", // Field from Match schema
          foreignField: "_id", // Field from Team schema
          as: "prize" // Alias for the output (home team details)
        }
      },
      {
        $unwind: "$prize" // Unwind the array to have a single team object
      },
      {
        $unwind: "$home" // Unwind the array to have a single team object
      },
      {
        $unwind: "$away" // Unwind the array to have a single team object
      },
     
    ]);
    res.status(200).json(matchList);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getTopMatches = async (req, res) => {
  try {
    const matchList = await Match.aggregate([
      {
        $match: { isTop: true } // Match tournament ID
      },
      {
        $lookup: {
          from: "teams", // Collection to join (Team)
          localField: "home", // Field from Match schema
          foreignField: "_id", // Field from Team schema
          as: "home" // Alias for the output (home team details)
        }
      },
      {
        $unwind: "$home" // Unwind the array to have a single team object
      },
      {
        $lookup: {
          from: "prizepyramids", // Collection to join (Team)
          localField: "prize", // Field from Match schema
          foreignField: "_id", // Field from Team schema
          as: "prize" // Alias for the output (home team details)
        }
      },
      {
        $unwind: "$prize" // Unwind the array to have a single team object
      },
      {
        $lookup: {
          from: "teams", // Collection to join (Team)
          localField: "away", // Field from Match schema
          foreignField: "_id", // Field from Team schema
          as: "away" // Alias for the output (away team details)
        }
      },
      {
        $unwind: "$away" // Unwind the array to have a single team object
      },
      {
        $lookup: {
          from: "events", // Collection to join (Event)
          let: { matchId: "$_id" }, // Pass match _id to the lookup
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$match", "$$matchId"] } // Match event's matchId with the current match
              }
            },
            {
              $count: "eventCount" // Count the number of matching events
            }
          ],
          as: "eventCount" // Alias for the output
        }
      },
      
      
      
     
    ]);
    res.status(200).json(matchList);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const distributeMoney = async (req, res) => {
  try {
    const matchId = req.params.id;
    const matchData = await Match.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(matchId) } // Match by ID
      },
      {
        $lookup: {
          from: "prizepyramids", // Collection to join (Team)
          localField: "prize", // Field from Match schema
          foreignField: "_id", // Field from Team schema
          as: "prize" // Alias for the output (home team details)
        }
      },
      {
        $unwind: "$prize" // Unwind the array to have a single team object
      },
    ]);
    const events = await Event.aggregate([
      {
        $match: { match: mongoose.Types.ObjectId(matchId) } // Match by ID
      },
      {
        $lookup: {
          from: "users", // Join users collection
          localField: "user", // Field from Event schema
          foreignField: "_id", // Field from User schema
          as: "user" // Alias for the output
        }
      },
      {
        $unwind: "$user" // Unwind the array to get a single user object
      },
      
      {
        $sort: {
          teamRank: 1 // Then sort by rank in ascending order
        }
      },
    ]);
    const prizes = matchData?.[0]?.prize
    const topThreeRanks = prizes?.distributionPyramid
    const restRanks = prizes?.rangePyramid
    const getRankPrize=(event)=>{
      const prize1 = topThreeRanks?.find((item) => item?.rank === event.teamRank)
      const prize2 = restRanks?.find((item) => {
        const prize = Number(item?.first) >= Number(event?.teamRank) || Number(item?.last) >= Number(event?.teamRank)
        if (prize) {
          return true
        } else {
          return false
        }

      })
      return prize1 || prize2||null

    }

    if (events?.length > 0) {
      events?.forEach(async (event, index) => {
        const prize = getRankPrize(event)
        const amount=Number(prize?.prize)||0
        await Event.findByIdAndUpdate(
          event?._id,
          {
            isWon: prize? true:false,  // Set the rank
            amount: prize ? amount :0 // Set the team's total score
          }
        );
        await Wallet.findByIdAndUpdate(
          event?.user?.wallet,
          {
            $inc: {
              winnings: prize? amount:0      // Increase the winnings
            }
          },
          { new: true }  // This will return the updated document
        );
      });
    }
    const match = await Match.findByIdAndUpdate(
      matchId,
      {
        isDistributed:true,
        status:'Completed'
      },
      { new: true }
    );

    if (!match)
      return res.status(400).json({ message: "the amount cannot be distributed!" });
    res.status(201).json(events);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateMatch = async (req, res) => {
  try {
   
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body
      },
      { new: true }
    );

    if (!match)
      return res.status(400).json({ message: "the category cannot be updated!" });
    res.status(201).json(match);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (match) {
        Match.findByIdAndRemove(req.params.id)
          .then((match) => {
            if (match) {
              return res
                .status(200)
                .json({ success: true, message: "The match is deleted!" });
            } else {
              return res
                .status(404)
                .json({ success: false, message: "match not found!" });
            }
          })
          .catch((err) => {
            return res.status(500).json({ success: false, error: err });
          });
     
    } else {
      res
        .status(500)
        .json({ message: "Not found any team" });

    }

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });

  }
};
