import mongoose from "mongoose";
import UserTeam from "../models/UserTeam.js";
import Event from "../models/Event.js";
import Match from "../models/Match.js";
import Wallet from "../models/Wallet.js";
export const getUserMatchTeam = async (req, res) => {
  try {
    const { matchId, userId } = req.params;

    const userTeams = await UserTeam.aggregate([
      {
        $match: {
          match: mongoose.Types.ObjectId(matchId),
          user: mongoose.Types.ObjectId(userId),
        }
      },
      {
        $lookup: {
          from: "players", // Collection to join (Player)
          localField: "players", // Field from UserTeam schema
          foreignField: "_id", // Field from Player schema
          as: "players", // Alias for the populated players array
        }
      },
    ]);
    res.status(200).json(userTeams);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createUserTeam = async (req, res) => {
  try {
    const { match, players } = req.body
    let team = new UserTeam({
      ...req?.body
    });
    team = await team.save();
    if (!team)
      return res.status(400).json({ message: "the team cannot be created!" });
    res.status(201).json(team);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const joinEvent = async (req, res) => {
  try {
    const user = req.user;
    const eventData = { ...req.body }
    const entryFees = Number(eventData.entryFees)
    const walletData = await Wallet.find({ user: user?.id })
    const wallet = walletData[0]
    if (wallet?.amount < entryFees) {
      return res.status(400).json({ message: "Insufficient amount in wallet!" });
    }
    const updatedwallet = await Wallet.findByIdAndUpdate(wallet?._id, { $inc: { amount: -entryFees } })
    delete eventData.entryFees
    const oldEvent = await Event.find({
      match: req.body?.match,
      team: req.body?.team,
      user: user?.id,

    })
    if (oldEvent[0]) {
      return res.status(400).json({ message: "Already joined with team!" });
    }
    let event = new Event({
      ...eventData
    });
    event = await event.save();
    if (!event)
      return res.status(400).json({ message: "the team cannot be joined!" });
    const updatedMatch = await Match.findByIdAndUpdate(
      req.body.match,
      {
        $push: { joinedTeams: event?._id }
      },
      { new: true }
    );
    res.status(201).json(updatedMatch);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getEvents = async (req, res) => {
  try {
    const matchId = req.params?.matchId;
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
        $lookup: {
          from: "userteams", // Join userteams collection
          localField: "team", // Field from Event schema
          foreignField: "_id", // Field from UserTeam schema
          as: "team" // Alias for the output
        }
      },
      {
        $unwind: "$team" // Unwind the array to get a single team object
      },
      {
        $lookup: {
          from: "players", // Join players collection
          localField: "team.players", // Field from UserTeam schema (players array)
          foreignField: "_id", // Field from Player schema
          as: "team.playerDetails" // Alias for player details
        }
      },
      {
        $lookup: {
          from: "playerstathistories", // Join playerscores collection
          let: { playerIds: "$team.players", matchId: mongoose.Types.ObjectId(matchId) }, // Pass players and matchId
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$player", "$$playerIds"] }, // Match players in the team
                    { $eq: ["$match", "$$matchId"] } // Match the current matchId
                  ]
                }
              }
            }
          ],
          as: "team.playerScores" // Alias for player scores
        }
      },
      {
        $addFields: {
          "team.players": {
            $map: {
              input: "$team.playerDetails", // Iterate over playerDetails array
              as: "playerDetail", // Alias for each player detail
              in: {
                $mergeObjects: [
                  "$$playerDetail", // Player details object
                  {
                    // Find the matching player score by player ID
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$team.playerScores", // Array of player scores
                          as: "playerScore", // Alias for each player score
                          cond: { $eq: ["$$playerScore.player", "$$playerDetail._id"] } // Match by player ID
                        }
                      },
                      0 // Return the first matched player score
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      // Add the total points for each player
      {
        $addFields: {
          "team.players": {
            $map: {
              input: "$team.players",
              as: "player",
              in: {
                $mergeObjects: [
                  "$$player",
                  {
                    totalPoints: {
                      $add: [
                        { $multiply: ["$$player.run", 1] }, // Points for runs
                        { $multiply: ["$$player.wicket", 20] }, // Points for wickets
                        { $multiply: ["$$player.catch", 8] }, // Points for catches
                        { $multiply: ["$$player.stumping", 10] }, // Points for stumpings
                        { $multiply: ["$$player.runOut", 6] } // Points for run-outs
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      // Apply captain and vice-captain bonuses
      {
        $addFields: {
          "team.players": {
            $map: {
              input: "$team.players",
              as: "player",
              in: {
                $mergeObjects: [
                  "$$player",
                  {
                    totalPoints: {
                      $cond: {
                        if: { $eq: [{ $toObjectId: "$$player.player" }, { $toObjectId: "$team.captain" }] }, // Check if the player is the captain
                        then: { $multiply: ["$$player.totalPoints", 2] }, // Double the points for captain
                        else: {
                          $cond: {
                            if: { $eq: [{ $toObjectId: "$$player.player" }, { $toObjectId: "$team.viceCaptain" }] }, // Check if the player is the vice-captain
                            then: { $multiply: ["$$player.totalPoints", 1.5] }, // 1.5x points for vice-captain
                            else: "$$player.totalPoints" // Regular points for other players
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          "team.totalPoints": {
            $sum: "$team.players.totalPoints" // Sum of all player totalPoints
          }
        }
      },
      {
        $addFields: {
          isCurrentUser: { $eq: ["$user._id", mongoose.Types.ObjectId(req?.user?.id)] }
        }
      },
      {
        $sort: {
          "team.totalPoints": -1 // Sort by total points
        }
      },
      // Now, add ranking using $setWindowFields
      {
        $setWindowFields: {
          sortBy: { "team.totalPoints": -1 }, // Sort by total points to calculate rank
          output: {
            rank: { $denseRank: {} } // Use $denseRank operator to assign rank
          }
        }
      },
      // Add a secondary sort so the current user is at the top
      {
        $sort: {
          isCurrentUser: -1, // Show the logged-in user first
          rank: 1 // Then sort by rank in ascending order
        }
      },
      {
        $project: {
          _id: 1,
          match: 1,
          user: 1,
          teamNumber: 1,
          teamRank: 1,
          teamScore: 1,
          rank: 1,
          isWon: 1,
          amount: 1,
          "team._id": 1,
          "team.captain": 1,
          "team.viceCaptain": 1,
          "team.players": 1,
          "team.totalPoints": 1,
          "team.playerScores": 1,
          isCurrentUser: 1
        }
      },

    ]);
    if (events?.length > 0) {
      events?.forEach(async (event, index) => {
        await Event.findOneAndUpdate(
          { team: event?.team?._id },
          {
            teamRank: event?.rank,  // Set the rank
            teamScore: event?.team?.totalPoints // Set the team's total score
          }
        );
      });
    }

    res.status(200).json(events); // Return the populated events
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




export const updateUserTeam = async (req, res) => {
  try {
    const userTeam = await UserTeam.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body
      },
      { new: true }
    );

    if (!userTeam)
      return res.status(400).json({ message: "the team cannot be updated!" });
    res.status(201).json(userTeam);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const deleteUserTeam = async (req, res) => {
  try {
    const userTeam = await UserTeam.findById(req.params.id);
    if (userTeam) {
      UserTeam.findByIdAndRemove(req.params.id)
        .then((userTeam) => {
          if (userTeam) {
            return res
              .status(200)
              .json({ success: true, message: "The team is deleted!" });
          } else {
            return res
              .status(404)
              .json({ success: false, message: "team not found!" });
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
