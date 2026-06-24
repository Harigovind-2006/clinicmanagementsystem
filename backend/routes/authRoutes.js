import express from "express";
import loginUser from "../controller/authController.js";
const router = express.Router();

    router.post("/login",loginUser);
    router.get("/", (req,res) => {
        res.send("Auth Route Working");
    });

export default router;