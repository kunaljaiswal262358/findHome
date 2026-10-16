import mongoose from "mongoose";

const dbURI = "mongodb://localhost:27017/findHome";

export const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Database connected succesfully.");
  } catch (error) {
    console.error("Mongodb connection failed.");
  }
};