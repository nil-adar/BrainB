import mongoose from "mongoose";

/**
 * Returns a raw MongoDB collection by name sandra
 */
export function getMongoCollection(collectionName: string) {
  if (!mongoose.connection || !mongoose.connection.db) {
    throw new Error("MongoDB connection is not established");
  }
  return mongoose.connection.db.collection(collectionName);
}
