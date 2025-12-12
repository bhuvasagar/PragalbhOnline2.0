import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  rating: number;
  content: {
    EN: string;
    GU: string;
    HI: string;
  };
}

const TestimonialSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: {
      EN: { type: String, required: true },
      GU: { type: String, required: true },
      HI: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
