import mongoose, { Schema } from "mongoose";

const slidesSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        severity: {
            type: String,
            required: [true, "Severity is required"],
        },
        location: {
            type: String,
            required: [true, "Description is required"],
        },
        status: {
            type: String,
            required: [true, "Description is required"],
        },
        img: {
            type: String,
            required: [true, "Image URL is required"],
        },
    },
    {
        timestamps: true,
    }
);

const Slides = mongoose.models.Slides || mongoose.model("Slides", slidesSchema);

export default Slides;
