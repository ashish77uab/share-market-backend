import { createTournament, deleteTournament, getAllTournament, getTournament, updateTournament } from "../controllers/tournament.js";
import express from "express";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get(`/`,   getAllTournament )
router.get('/:id', getTournament)
router.post('/',upload.single('icon'),createTournament )
router.put('/:id',upload.single('icon'),updateTournament)
router.delete('/:id', deleteTournament)
export default router;