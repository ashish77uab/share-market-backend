import { getAllTransactions, updateTransaction} from "../controllers/transactions.js";
import express from "express";
const router = express.Router();

router.get(`/all-transactions`,   getAllTransactions )
router.put('/update-status',updateTransaction)
export default router;