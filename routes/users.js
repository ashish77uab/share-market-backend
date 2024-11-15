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
  getUserById
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
router.get("/profile", authenticateJWT, getUser);
router.get("/all-users", authenticateJWT, getUsers);
router.get("/single-user", authenticateJWT, getUserById);
router.get("/all-admin", authenticateJWT, getAllAdmin);


export default router;
