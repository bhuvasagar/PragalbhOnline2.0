import mongoose, { Schema, Document } from "mongoose";

export interface IDocument {
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

export interface IApplication extends Document {
  customerName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  message?: string;
  documents: IDocument[];
  date: Date;
  status: "pending" | "completed";
}

const DocumentSchema: Schema = new Schema(
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ApplicationSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true }, // Store name snapshot in case service is deleted/changed
    message: { type: String },
    documents: [DocumentSchema],
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>("Application", ApplicationSchema);
