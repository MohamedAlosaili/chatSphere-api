import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  const conn = await mongoose.connect(MONGODB_URI);

  console.log(
    colors.cyan.bold.underline(`MongoDB connected ${conn.connection.host}`)
  );
};

export default connectDB;
