import { Request, Response } from "express";
import Testimonial from "../models/Testimonial";

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.find({});
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
