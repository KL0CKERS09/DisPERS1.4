import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI_ALERT!;
const DB_NAME = "safeNetDb";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI_ALERT environment variable is not set.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      tls: true,
      tlsAllowInvalidCertificates: false,
    }).then((mongoose) => {
      console.log("✅ MongoDB connected (cached)");
      return mongoose.connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
