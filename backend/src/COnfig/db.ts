import dotenv from "dotenv";
import mongoose from "mongoose";
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error:any) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
