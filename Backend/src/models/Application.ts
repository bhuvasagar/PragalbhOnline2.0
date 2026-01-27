import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  customerName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  message?: string;
  documentUrl: string; // ⭐ ADD
  date: Date;
  status: "pending" | "completed";
}

const ApplicationSchema: Schema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    serviceId: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },

    // ⭐ REQUIRED DOCUMENT (URL)
    documentUrl: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>(
  "Application",
  ApplicationSchema
);
