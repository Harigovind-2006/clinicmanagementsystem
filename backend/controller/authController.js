import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginUser = async (req,res) => {
    try{
        const {username, password} = req.body;

        console.log("Username received:", username);

        const foundUser = await user.findOne({ username });

        console.log("Found user:", foundUser);
        if(!foundUser){
            return res.status(401).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            foundUser.password,
        );

        if(!isMatch){
            return res.status(401).json({
                message:"Invalid Password",
            });
        }

        const token = jwt.sign(
            {
                id: foundUser._id,
                role: foundUser.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"30d",
            }
        );

        res.json({
            token,
            role: foundUser.role,
            name: foundUser.name,
        });
    }
    catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

export default loginUser;