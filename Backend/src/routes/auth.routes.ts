import express from "express";
import {
  loginAdmin,
  getMe,
  updateProfile,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;
