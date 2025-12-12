import express from "express";
import { translate } from "../controllers/translation.controller";
import { protect, admin } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/translate", protect, admin, translate);

export default router;
