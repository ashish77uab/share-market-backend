import { deleteFileFromCloudinary, uploadImageToCloudinary } from "../helpers/functions.js";
import Tournament from "../models/Tournament.js";
export const createTournament = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No icon found" });
    const fileFromCloudinary = await uploadImageToCloudinary(req.file, res)
    let tournament = new Tournament({
      name: req.body.name,
      icon: fileFromCloudinary?.url,
      color: req.body.color,
    });
    tournament = await tournament.save();

    if (!tournament)
      return res.status(400).json({ message: "the tournament cannot be created!" });
    res.status(201).json(tournament);
  } catch (error) {
    console.log(error,'error')
    return res.status(500).json({message: 'Internal server error'});
  }
};
export const getTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      res
        .status(500)
        .json({ message: "The Tournament with the given ID was not found." });
    }
    res.status(200).json(tournament);
  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});
  }
};
export const getAllTournament = async (req, res) => {
  try {
    const tournamentList = await Tournament.find();

    if (!tournamentList) {
      res.status(500).json({ success: false });
    }
    res.status(200).json(tournamentList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error" });
  }
};
export const updateTournament = async (req, res) => {
  try {
    const oldTournament = await Tournament.findById(req.params.id);
    let iconToSet;
    const file = req.file;
    if (file) {
      const isDeleted = await deleteFileFromCloudinary(oldTournament?.icon)
      if (isDeleted) {
        const fileFromCloudinary = await uploadImageToCloudinary(req.file, res)
        iconToSet = fileFromCloudinary?.url;
      }
    } else {
      iconToSet = req.body.icon;
    }
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: iconToSet,
        color: req.body.color,
      },
      { new: true }
    );

    if (!tournament)
      return res.status(400).json({ message: "the tournament cannot be updated!" });
    res.status(201).json(tournament);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error" });
  }
};
export const deleteTournament = async (req, res) => {
  try {
    const oldTournament = await Tournament.findById(req.params.id);
    if (oldTournament) {
      const isDeleted = await deleteFileFromCloudinary(oldTournament?.icon)
      if (isDeleted) {
        Tournament.findByIdAndRemove(req.params.id)
          .then((tournament) => {
            if (tournament) {
              return res
                .status(200)
                .json({ success: true, message: "The tournament is deleted!" });
            } else {
              return res
                .status(404)
                .json({ success: false, message: "Tournament not found!" });
            }
          })
          .catch((err) => {
            return res.status(500).json({ success: false, error: err });
          });
      } else {
        res
          .status(500)
          .json({ message: "Not able to delete image" });
      }
    } else {
      res
        .status(500)
        .json({ message: "Not found any Tournament" });

    }

  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error" });

  }

};
