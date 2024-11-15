import {
  createUserTeam,
  deleteUserTeam,
  updateUserTeam,
  getUserMatchTeam,
  joinEvent,
  getEvents
} from "../controllers/userTeam.js";
import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
const router = express.Router();

router.post("/add", authenticateJWT, createUserTeam);
router.post("/event", authenticateJWT, joinEvent);
router.get("/event/:matchId", authenticateJWT, getEvents);
router.get("/:matchId/:userId", authenticateJWT, getUserMatchTeam);
router.put("/:id",  authenticateJWT,updateUserTeam);
router.delete("/:id", authenticateJWT, deleteUserTeam);
export default router;
