import express from "express";
import { loginUser } from "../controller/authController.js";

const route = express.Router();

route.post("/login", loginUser);

export default route;