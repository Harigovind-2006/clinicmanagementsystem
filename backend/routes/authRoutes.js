import express from "express";
import { userLogin, registerUser } from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", userLogin);

router.get("/profile", authMiddleware, (req, res) => {
    res.json(req.user);
});

export default router;