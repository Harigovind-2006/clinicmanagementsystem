import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoute from "./routes/userRoute.js";
import patientRoute from "./routes/patientRoute.js";
import medicineRoute from "./routes/medicineRoute.js";
import appoinmentRoute from "./routes/appoinmentRoute.js";
import authRoute from "./routes/authRoute.js";
import procedureRoute from "./routes/procedureRoute.js"


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
app.use("/procedureapi", procedureRoute);