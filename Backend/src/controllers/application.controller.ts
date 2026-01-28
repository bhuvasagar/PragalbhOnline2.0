import { Request, Response } from "express";
import Application from "../models/Application";
import { AuthRequest } from "../middleware/auth.middleware";

// @desc    Submit a new application
// @route   POST /api/applications
// @access  Public
export const submitApplication = async (req: Request, res: Response) => {
  try {
    const { customerName, phone, serviceId, serviceName, message } = req.body;

    const application = new Application({
      customerName,
      phone,
      serviceId,
      serviceName,
      message,
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private/Admin
export const getApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await Application.find().sort({ date: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    const application = await Application.findById(req.params.id);

    if (application) {
      application.status = status;
      const updatedApplication = await application.save();
      res.json(updatedApplication);
    } else {
      res.status(404).json({ message: "Application not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update application details (Name, Phone, etc.)
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

    if (application) {
      application.customerName = customerName || application.customerName;
      application.phone = phone || application.phone;
      application.message =
        message !== undefined ? message : application.message;
      application.status = status || application.status;

      if (serviceId) application.serviceId = serviceId;
      if (serviceName) application.serviceName = serviceName;

      const updatedApplication = await application.save();
      res.json(updatedApplication);
    } else {
      res.status(404).json({ message: "Application not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
export const deleteApplication = async (req: AuthRequest, res: Response) => {
  try {
    const result = await Application.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      res.json({ message: "Application removed" });
    } else {
      res.status(404).json({ message: "Application not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// @desc    Bulk delete applications
// @route   POST /api/applications/bulk-delete
// @access  Private/Admin
export const deleteApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const result = await Application.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount > 0) {
      res.json({ message: `${result.deletedCount} applications removed` });
    } else {
      res.status(404).json({ message: "No applications found to delete" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



aa aakho code application.controller.ts che
