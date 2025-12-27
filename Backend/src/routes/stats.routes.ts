import express from "express";
import { getStats, incrementVisits } from "../controllers/stats.controller";

const router = express.Router();

router.get("/", getStats);
router.post("/visit", incrementVisits);

export default router;
