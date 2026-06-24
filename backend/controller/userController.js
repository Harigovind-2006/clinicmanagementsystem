import User from "../models/user.js";
import bcrypt from "bcryptjs";

const createUser = async (req, res) => {
  try {
    console.log("Received user data:", req.body);

    const {
      name,
      email,
      mobile,
      username,
      password,
      role,
      specialization,
      dob,
      gender,
      address,
    } = req.body;

    const existingUser = await user.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      mobile,
      username,
      password: hashedPassword,
      role,
      specialization,
      dob,
      gender,
      address,
    });

    console.log("Created user:", newUser);

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllUsers = async (req,res) => {
    try {
        const {role} = req.query;

        let filter = {};

        if (role) {
            filter.role = role;
        }

        const users = await User.find(filter).select("-password");

        res.json(users);
    }
    catch (error){
        res.status(500).json ({
            message: error.message,
        });
    }
};

const getUserById = async (req,res) =>{
    try{
        const foundUser = await User.findById(req.params.id).select("-password");

        if(!foundUser){
            return res.status(404).json ({
                message : "User not found",
            });
        }
        res.json(foundUser);
    }
    catch(error){
        res.status(500).json ({
            message : error.message,
        });
    }
};

const updateUser = async (req,res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new :true,
            }
        );
        res.json(updatedUser);
    }
    catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

const toggleStatus = async (req,res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        user.status = user.status === "Active"
        ? "Inactive"
        : "Active";

        await user.save();

        res.json({
            message : "Status Updated",
            status:user.status,
        });
    }
    catch(error){
        res.status(500).json ({
            message : error.message,
        });
    }
};

const deleteUser = async (req,res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(404).json ({
                message :"User not found",
            });
        }
        await user.deleteOne();

        res.json({
            message:"User deleted Successfully",
        });
    } catch(error){
        res.status(500).json({
            message : error.message,
        });
    }
};

export {createUser,getAllUsers,getUserById,updateUser,toggleStatus,deleteUser,};