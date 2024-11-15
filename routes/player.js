import {
  createPlayer,
  deletePlayer,
  getAllPlayer,
  getPlayer,
  updatePlayer,
  updtePlayerPlayingStatus,
  updtePlayerScore,
  getPlayerScore,
  resetPlayerData
} from "../controllers/player.js";
import express from "express";
const router = express.Router();

router.put("/score-reset", resetPlayerData);
router.get(`/all/:id`, getAllPlayer);
router.post("/add", createPlayer);
router.get("/:id", getPlayer);
router.put("/playing", updtePlayerPlayingStatus);
router.put("/score/:scoreId", updtePlayerScore);
router.get("/score/:playerId", getPlayerScore);
router.put("/:id", updatePlayer);
router.delete("/:id", deletePlayer);
export default router;
