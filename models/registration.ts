import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        age: { type: Number, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema, "users");

export default User;
