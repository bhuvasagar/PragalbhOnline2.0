import express from "express";
import {
  submitApplication,
  getApplications,
  updateApplicationStatus,
  updateApplicationDetails,
  deleteApplication,
  deleteApplications,
} from "../controllers/application.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.route("/").post(submitApplication).get(protect, getApplications);

router.route("/:id/status").patch(protect, updateApplicationStatus);

router.post("/bulk-delete", protect, deleteApplications);

router
  .route("/:id")
  .patch(protect, updateApplicationDetails)
  .delete(protect, deleteApplication);

export default router;
