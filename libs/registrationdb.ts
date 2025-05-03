import mongoose from "mongoose";

const connectRegistrationDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI_ALERT!, {
            dbName: "safeNetDb",
        });

        console.log("Connected to Registration DB");
    } catch (error) {
        console.error("Error connecting to Registration DB:", error);
        throw error;
    }
};

export default connectRegistrationDB;
