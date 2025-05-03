import mongoose from "mongoose";

const ResetTokenSchema = new mongoose.Schema({
  email: String,
  code: String,
  createdAt: { type: Date, expires: 600, default: Date.now }, // Expires in 10 minutes
});

export default mongoose.models.ResetToken || mongoose.model("ResetToken", ResetTokenSchema);
