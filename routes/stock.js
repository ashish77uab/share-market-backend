import express from "express";
const router = express.Router();
import {
  getUserStocks,
  createStock,
  updateStock,
  deleteStock
} from "../controllers/purchaseStock.js";
import { authenticateJWT } from "../middleware/auth.js";



router.get("/user-stocks", authenticateJWT, getUserStocks);
router.post("/create-stock", authenticateJWT, createStock);
router.put("/update-stock/:id", authenticateJWT, updateStock);
router.delete("/delete/:id", authenticateJWT, deleteStock);



export default router;
