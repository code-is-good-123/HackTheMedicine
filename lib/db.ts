import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

const cached = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    console.warn("MongoDB URI not provided — falling back to fast in-memory store");
    return null;
  }

  if (!cached.promise) {
    mongoose.set("bufferCommands", false);
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 3500,
        connectTimeoutMS: 3500,
      })
      .then((m) => {
        console.log("Successfully connected to MongoDB");
        return m;
      })
      .catch((err) => {
        console.warn("MongoDB connection failed or blocked. Using in-memory fallback:", err.message);
        cached.promise = null;
        return null;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function isDbConnected(): boolean {
  return mongoose.connection?.readyState === 1;
}
