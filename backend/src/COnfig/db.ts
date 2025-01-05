import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from "path";
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const connectDB = async () => {
  const mongoURI = String(process.env.MONGO_URI);
  try {
    // Connect to MongoDB using the connection string
    const conn = await mongoose.connect(mongoURI, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error:any) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
