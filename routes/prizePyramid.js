import {
  createPrizePyramid,
getPrizePyramid,
updtePrizePyramid,
getAllPrizePyramid,
deletePrizePyramid,
} from "../controllers/prizePyramid.js";
import express from "express";
const router = express.Router();
router.post("/add", createPrizePyramid);
router.get("/all", getAllPrizePyramid);
router.put("/update/:id", updtePrizePyramid);
router.get("/:id", getPrizePyramid);
router.delete("/:id", deletePrizePyramid);
export default router;
