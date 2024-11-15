import {
  createTeam,
  deleteTeam,
  getAllTeam,
  getTeam,
  updateTeam,
} from "../controllers/team.js";
import express from "express";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get(`/all/:id`, getAllTeam);
router.post("/add", upload.single("icon"), createTeam);
router.get("/:id", getTeam);
router.put("/:id", upload.single("icon"), updateTeam);
router.delete("/:id", deleteTeam);
export default router;
