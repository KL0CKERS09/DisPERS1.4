import mongoose, { Schema } from "mongoose";

const anonymousReportSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String },
    image: { type: String },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

const AnonymousReport = mongoose.models.AnonymousReport || mongoose.model("AnonymousReport", anonymousReportSchema, "anonymousReport");

export default AnonymousReport;
