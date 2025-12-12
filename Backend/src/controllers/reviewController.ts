import { Request, Response } from "express";
import Review from "../models/Review";
import Testimonial from "../models/Testimonial";

// @desc    Get all reviews (public = approved only, admin = all)
// @route   GET /api/reviews
// @access  Public (for approved) / Private (for all)
export const getReviews = async (req: Request, res: Response) => {
  try {
    const { isAdmin } = req.query;

    let query = {};
    if (isAdmin !== "true") {
      query = { approved: true };
    }

    const reviews = await Review.find(query).lean();

    // Fetch legacy testimonials (always considered approved)
    let testimonials: any[] = [];
    if (isAdmin !== "true") {
      // Only show legacy testimonials in public view to avoid cluttering admin
      // Or show them in admin too if you want to manage them (requires migration)
      // For now, let's just show them in public view
      testimonials = await Testimonial.find({}).lean();
    }

    // Map testimonials to Review format
    const formattedTestimonials = testimonials.map((t: any) => ({
      _id: t._id,
      name: t.name,
      rating: t.rating,
      content: t.content.EN || Object.values(t.content)[0], // Fallback to any content
      language: "EN", // Legacy are mostly EN or multi-lang object, treating as base EN for now
      approved: true,
      createdAt: t.createdAt || new Date("2024-01-01"), // Default old date
      isLegacy: true, // Flag to identify legacy
    }));

    // Combine and sort by date descending
    const allReviews = [...reviews, ...formattedTestimonials].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json(allReviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Public
export const createReview = async (req: Request, res: Response) => {
  try {
    const { name, rating, content, language } = req.body;

    const review = await Review.create({
      name,
      rating,
      content,
      language: language || "EN",
      approved: true, // Auto-approve by default
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: "Invalid review data" });
  }
};

// @desc    Update review (Approve/Reject)
// @route   PUT /api/reviews/:id
// @access  Private (Admin)
export const updateReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      review.approved = req.body.approved ?? review.approved;
      review.name = req.body.name || review.name;
      review.content = req.body.content || review.content;
      review.rating = req.body.rating || review.rating;

      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid review data" });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      await review.deleteOne();
      res.json({ message: "Review removed" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
