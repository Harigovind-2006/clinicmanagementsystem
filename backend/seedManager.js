import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "./models/user.js";

dotenv.config();

const createManager = async () => {
  try {

    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);

    const existingManager = await User.findOne({
      username: "admin",
    });

    if (existingManager) {
      console.log("Manager already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "123456",
      10
    );

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      username: "admin",
      password: hashedPassword,
      role: "manager",
      status: "Active",
    });

    console.log("Manager created successfully");
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createManager();