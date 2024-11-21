import express from "express";
const router = express.Router();
import {
  signup,
  signin,
  getUser,
  resetPasswordRequestController,
  resetPasswordController,
  getUsers,
  getAllAdmin,
  getUserById,
  changePasswordController,
  addDepositController,
  getUserTransactionsController,
  withdrawFundController,
  contactUsController
} from "../controllers/users.js";
import { authenticateJWT } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

router.post("/register",upload.fields([
  { name: 'panImage', maxCount: 1 },
  { name: 'aadharImage', maxCount: 1 },
  { name: 'clientImage', maxCount: 1 }
]), signup);
router.post("/login", signin);
router.post("/requestResetPassword", resetPasswordRequestController);
router.post("/resetPassword", resetPasswordController);
router.post("/update-password",authenticateJWT, changePasswordController);
router.post("/add-deposit",authenticateJWT, addDepositController);
router.post("/withdraw-fund",authenticateJWT, withdrawFundController);
router.get("/profile", authenticateJWT, getUser);
router.get("/all-users", authenticateJWT, getUsers);
router.get("/single-user", authenticateJWT, getUserById);
router.get("/all-admin", authenticateJWT, getAllAdmin);
router.get("/transactions", authenticateJWT, getUserTransactionsController);
router.post("/contact-us", contactUsController);


export default router;
