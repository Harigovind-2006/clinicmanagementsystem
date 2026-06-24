import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

<<<<<<< HEAD
=======

>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Please provide username and password" });
        }

        const user = await User.findOne({ username }).select("+password");
        if (!user) {
<<<<<<< HEAD
            return res.status(401).json({ success:false, message: "Invalid Username or Password"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
=======
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        const token = jwt.sign(
<<<<<<< HEAD
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                fullname: user.fullname,
                username: user.username,
                role: user.role
=======
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
>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432
            }
        });

    } catch (error) {
<<<<<<< HEAD
        return res.status(500).json({
            message: error.message
=======
        res.status(500).json({
            success: false,
            message: "Server login failure",
            error: error.message
>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432
        });
    }
};