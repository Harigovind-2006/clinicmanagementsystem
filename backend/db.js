import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGODB_URL;

mongoose.connect(url).then(()=>{
    console.log("MongoDB connected successfully");
}).catch((error)=>{
    console.error("Error connecting to MongoDB:", error);
});