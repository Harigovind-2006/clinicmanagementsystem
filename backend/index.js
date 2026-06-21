import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import patientRoute from "./routes/patientRoute.js";
import medicineRoute from "./routes/medicineRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const URL = process.env.MONGODB_URL;

mongoose
.connect(URL)
.then(()=>{
    console.log("Database connected successfully");
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error)=>{
    console.log("Error while connecting with the database", error)
});

app.use("/userapi", userRoute);
app.use("/patientapi", patientRoute);
app.use("/medicineapi", medicineRoute);