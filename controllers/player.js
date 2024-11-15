import mongoose from "mongoose";
import Player from "../models/Player.js";
import Team from "../models/Team.js";
import PlayerStat from "../models/PlayerStat.js";
import Event from "../models/Event.js";
import PlayerStatHistory from "../models/PlayerStatHistory.js";
export const createPlayer = async (req, res) => {
  try {
    const teamId = req?.body?.team
    let player = new Player({
      ...req?.body
    });
    player = await player.save();

    if (!player)
      return res.status(400).json({ message: "the player cannot be created!" });
    await Team.findByIdAndUpdate(
      teamId,
      {
        $push: { players: player?._id } // Push player ID into the players array
      },
      { new: true }
    );
    res.status(201).json(player);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      res
        .status(500)
        .json({ message: "The player with the given ID was not found." });
    }
    res.status(200).json(player);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getPlayerScore = async (req, res) => {
  try {
    let score
    score = await PlayerStat.find({ player: req.params.playerId });

    if (!score?.[0]) {
      score[0] = await PlayerStat.create({ player: req.params.playerId });
    }


    res.status(200).json(score[0]);
  } catch (error) {
    console.log(error, 'attt')
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const playerList = await Player.aggregate([
      {
        $match: { team: mongoose.Types.ObjectId(id) } // Match team ID
      },
      {
        $lookup: {
          from: "teams", // The Team collection
          localField: "team", // Field from Player schema
          foreignField: "_id", // Field from Team schema
          as: "team" // Alias for the team details
        }
      },
      {
        $unwind: "$team" // Unwind the array of team details
      },

    ]);

    res.status(200).json(playerList);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updtePlayerPlayingStatus = async (req, res) => {
  try {
    const playerIds = req.body.playerIds; // Array of player IDs

    // Find all players with the provided IDs
    const players = await Player.find({ _id: { $in: playerIds } });

    if (!players || players.length === 0) {
      return res.status(404).json({ message: "No players found with the given IDs" });
    }

    const updatedPlayers = await Promise.all(
      players.map(player =>
        Player.findByIdAndUpdate(
          player._id,
          { isPlaying: !player.isPlaying },  // Toggle the isPlaying status
          { new: true }  // Return the updated player document
        )
      )
    );

    // Return the updated player records
    res.status(200).json({ message: "Players updated successfully", updatedPlayers });
  } catch (error) {
    console.error("Error updating player status:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const resetPlayerData = async (req, res) => {
  try {
    const { home, away } = req.body
    const homeData = await Team?.findById(home)
    const awayData = await Team?.findById(away)
    const allPlayers = [...homeData?.players, ...awayData?.players]
    allPlayers?.forEach(async (playerId) => {
       await PlayerStat.findOneAndUpdate({ player: playerId }, {
        $set: {
          run: 0,
          wicket: 0,
          catch: 0,
          stumping: 0,
          runOut: 0,
        }
      })
      await PlayerStatHistory.findOneAndUpdate({ player: playerId, isCompleted: false }, { $set: { isCompleted: true } }, { new: true })
    })
    res.status(200).json({message:'success'});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updtePlayerScore = async (req, res) => {
  try {
    const updatedScore = await PlayerStat.findByIdAndUpdate(
      req.params.scoreId,
      {
        ...req.body
      },
      { new: true }
    );
    const tempData = { ...updatedScore.toObject() };
    delete tempData?._id
    await PlayerStatHistory.findOneAndUpdate({ player: updatedScore?.player, isCompleted:false }, tempData, { new: true })
    if (!updatedScore)
      return res.status(400).json({ message: "the score cannot be updated!" });
    res.status(201).json(updatedScore);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body
      },
      { new: true }
    );

    if (!player)
      return res.status(400).json({ message: "the player cannot be updated!" });
    res.status(201).json(player);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (player) {
      Player.findByIdAndRemove(req.params.id)
        .then((player) => {
          if (player) {
            return res
              .status(200)
              .json({ success: true, message: "The player is deleted!" });
          } else {
            return res
              .status(404)
              .json({ success: false, message: "player not found!" });
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
