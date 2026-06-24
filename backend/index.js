import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoute from "./routes/userRoute.js";
import patientRoute from "./routes/patientRoute.js";
import medicineRoute from "./routes/medicineRoute.js";
<<<<<<< HEAD
import authRoute from "./routes/authRoutes.js";
=======
import appoinmentRoute from "./routes/appoinmentRoute.js";
import authRoute from "./routes/authRoute.js";
>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

<<<<<<< HEAD
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
=======
const PORT = process.env.PORT || 5000;
const URL = process.env.MONGODB_URL;

if (!URL) {
  console.error("MONGODB_URL is not defined in the environment variables.");
  process.exit(1);
}

mongoose
  .connect(URL)
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error while connecting with the database", error);
    process.exit(1);
  });

app.use("/authapi", authRoute);
app.use("/userapi", userRoute);
app.use("/patientapi", patientRoute);
app.use("/medicineapi", medicineRoute);
app.use("/appoinmentapi", appoinmentRoute);
>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432
