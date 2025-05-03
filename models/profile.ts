import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  phone: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  profilePicture: String // base64
});

export default mongoose.models.User || mongoose.model("User", UserSchema, "users");
