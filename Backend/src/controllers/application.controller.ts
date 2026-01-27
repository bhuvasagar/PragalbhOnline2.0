import { Request, Response } from "express";
import Application from "../models/Application";
import { AuthRequest } from "../middleware/auth.middleware";

// @desc    Submit a new application
// @route   POST /api/applications
// @access  Public
export const submitApplication = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      phone,
      serviceId,
      serviceName,
      message,
      documentUrl, // ⭐ REQUIRED
    } = req.body;

    // Basic validation
    if (!customerName || !phone || !serviceId || !serviceName) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    if (!documentUrl) {
      return res.status(400).json({
        message: "Document is required",
      });
    }

    const application = new Application({
      customerName,
      phone,
      serviceId,
      serviceName,
      message,
      documentUrl,
      status: "pending",
    });

    const createdApplication = await application.save();

    res.status(201).json({
      success: true,
      data: createdApplication,
    });
  } catch (error: any) {
    console.error("Submission Error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private/Admin
export const getApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private/Admin
export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    const updatedApplication = await application.save();

    res.json({
      success: true,
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update application details
// @route   PATCH /api/applications/:id
// @access  Private/Admin
export const updateApplicationDetails = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { customerName, phone, message, status, serviceId, serviceName } =
      req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (customerName) application.customerName = customerName;
    if (phone) application.phone = phone;
    if (message !== undefined) application.message = message;
    if (status) application.status = status;
    if (serviceId) application.serviceId = serviceId;
    if (serviceName) application.serviceName = serviceName;

    const updatedApplication = await application.save();

    res.json({
      success: true,
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Update Application Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
export const deleteApplication = async (req: AuthRequest, res: Response) => {
  try {
    const result = await Application.deleteOne({ _id: req.params.id });

    if (result.deletedCount && result.deletedCount > 0) {
      res.json({
        success: true,
        message: "Application removed",
      });
    } else {
      res.status(404).json({ message: "Application not found" });
    }
  } catch (error) {
    console.error("Delete Application Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Bulk delete applications
// @route   POST /api/applications/bulk-delete
// @access  Private/Admin
export const deleteApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "No IDs provided",
      });
    }

    const result = await Application.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${result.deletedCount} applications removed`,
    });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
