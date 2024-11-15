import {
  createMatch,
  deleteMatch,
  getAllMatchOfTournament,
  getMatch,
  updateMatch,
  getTopMatches,
  distributeMoney
} from "../controllers/match.js";
import express from "express";
const router = express.Router();

router.get(`/all/:id`, getAllMatchOfTournament);
router.get(`/top`, getTopMatches);
router.post("/add", createMatch);
router.get("/:id", getMatch);
router.put("/:id", updateMatch);
router.put("/distribute-money/:id", distributeMoney);
router.delete("/:id", deleteMatch);
export default router;
