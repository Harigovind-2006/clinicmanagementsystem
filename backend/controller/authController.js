import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Please provide username and password" });
        }

        const user = await User.findOne({ username }).select("+password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "your_hospital_secret_key",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                fullname: user.fullname,
                role: user.role 
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server login failure",
            error: error.message
        });
    }
};