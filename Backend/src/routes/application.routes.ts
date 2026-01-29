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
import { upload } from "../config/multer";

const router = express.Router();

router
  .route("/")
  .post(upload.array("documents", 5), submitApplication)
  .get(protect, getApplications);

router.route("/:id/status").patch(protect, updateApplicationStatus);

router.post("/bulk-delete", protect, deleteApplications);

router
  .route("/:id")
  .patch(protect, updateApplicationDetails)
  .delete(protect, deleteApplication);

export default router;
