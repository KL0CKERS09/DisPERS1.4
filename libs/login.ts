import mongoose from "mongoose";

const MONGODB_URI_ALERT = process.env.MONGODB_URI_ALERT!;

export default async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI_ALERT);
}
