import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoute from "./routes/userRoute.js";
import patientRoute from "./routes/patientRoute.js";
import medicineRoute from "./routes/medicineRoute.js";
import authRoute from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Clinic Management System API Running"
    });
});

// Routes
app.use("/userapi", userRoute);
app.use("/patientapi", patientRoute);
app.use("/medicineapi", medicineRoute);
app.use("/auth", authRoute);

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

// Database Connection
mongoose
    .connect(MONGODB_URL)
    .then(() => {
        console.log("✅ Database connected successfully");

        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection failed");
        console.error(error);
    });

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});