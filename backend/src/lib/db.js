import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb connected: ${process.env.MONGO_URI}`);
  } catch (error) {
    console.error(`Error connecting to mongo: ${error.message}`);
    process.exit(1);
  }
};
