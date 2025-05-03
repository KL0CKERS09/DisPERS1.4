// models/Report.ts
import mongoose, { Schema, Document } from "mongoose";

interface IReport extends Document {
    title: string;
    description: string;
    category: string;
    area: string;
    location: string;
    verified: string;
    user: Schema.Types.ObjectId; 
}

const reportSchema = new Schema<IReport>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    area: { type: String, required: true },
    location: { type: String, required: true },
    verified: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  },
  { timestamps: true }
);

const Report = mongoose.models.Report || mongoose.model<IReport>("Report", reportSchema, "reports");

export default Report;