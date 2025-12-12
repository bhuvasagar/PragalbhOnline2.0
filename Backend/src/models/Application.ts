import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  customerName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  message?: string;
  date: Date;
  status: "pending" | "completed";
}

const ApplicationSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true }, // Store name snapshot in case service is deleted/changed
    message: { type: String },
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
