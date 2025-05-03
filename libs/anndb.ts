import mongoose, { Connection } from "mongoose";

let annConnection: Connection | null = null;

export const connectAnnDB = async (): Promise<Connection> => {
  if (annConnection && annConnection.readyState === 1) {
    return annConnection;
  }

  try {
    const conn = await mongoose.createConnection(process.env.MONGODB_URI_ALERT!, {
      dbName: "safeNetDb", 
    });

    await new Promise<void>((resolve, reject) => {
      conn.once("open", () => {
        console.log("✅ Connected to Announcement DB");
        resolve();
      });
      conn.on("error", (err) => {
        console.error("❌ Announcement DB connection error:", err);
        reject(err);
      });
    });

    annConnection = conn;
    return conn;
  } catch (error) {
    console.error("❌ Failed to connect to Announcement DB:", error);
    throw error;
  }
};

export default connectAnnDB;
