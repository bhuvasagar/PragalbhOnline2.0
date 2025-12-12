import express from "express";
import { getTestimonials } from "../controllers/testimonial.controller";

const router = express.Router();

router.get("/", getTestimonials);

export default router;
