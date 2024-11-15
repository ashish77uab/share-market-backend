import { deleteFileFromCloudinary, uploadImageToCloudinary } from "../helpers/functions.js";
import Team from "../models/Team.js";
export const createTeam = async (req, res) => {
 try {
   const file = req.file;
   if (!file) return res.status(400).json({ message: "No icon found" });
   const fileFromCloudinary = await uploadImageToCloudinary(req.file, res)
   let team = new Team({
     name: req.body.name,
     icon: fileFromCloudinary?.url,
     color: req.body.color,
     tournament: req.body.tournament,
   });
   team = await team.save();

   if (!team)
     return res.status(400).json({ message: "the team cannot be created!" });

   res.status(201).json(team);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const getTeam = async (req, res) => {
 try {
   const team = await Team.findById(req.params.id);
   if (!team) {
     res
       .status(500)
       .json({ message: "The team with the given ID was not found." });
   }
   res.status(200).json(team);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};

export const getAllTeam = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params,'req.params')
    const teamList = await Team.find({ tournament: id });

    res.status(200).json(teamList);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
  };
export const updateTeam = async (req, res) => {
 try {
   const oldTeam = await Team.findById(req.params.id);
   let iconToSet;
   const file = req.file;
   if (file) {
     const isDeleted = await deleteFileFromCloudinary(oldTeam?.icon)
     if (isDeleted) {
       const fileFromCloudinary = await uploadImageToCloudinary(req.file, res)
       iconToSet = fileFromCloudinary?.url;
     }
   } else {
     iconToSet = req.body.icon;
   }
   const team = await Team.findByIdAndUpdate(
     req.params.id,
     {
       name: req.body.name,
       icon: iconToSet,
       color: req.body.color,
       tournament: req.body.tournament,
     },
     { new: true }
   );

   if (!team)
     return res.status(400).json({ message: "the category cannot be updated!" });
   res.status(201).json(team);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const deleteTeam = async (req, res) => {
  try {
    const oldTeam = await Team.findById(req.params.id);
    if (oldTeam) {
      const isDeleted = await deleteFileFromCloudinary(oldTeam?.icon)
      if (isDeleted) {
        Team.findByIdAndRemove(req.params.id)
          .then((team) => {
            if (team) {
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
          .json({ message: "Not able to delete image" });
      }
    } else {
      res
        .status(500)
        .json({ message: "Not found any team" });

    }

  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});

  }
};
