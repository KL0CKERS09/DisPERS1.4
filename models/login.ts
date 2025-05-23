import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema, "users");
export default User;
