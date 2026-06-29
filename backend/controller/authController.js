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
        console.log("Password match:", isMatch); // Debugging line
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        const token = jwt.sign(
            { id: user._id, userId: user._id.toString(), username: user.username, role: user.role },
            process.env.JWT_SECRET || "your_hospital_secret_key",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
<<<<<<< HEAD
                id: user._id,
                userId: user._id.toString(),
                username: user.username,
=======
                _id: user._id,
>>>>>>> 4c2c2c80626c0007534483793be4fdc98c974377
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
