import user from "../models/user.js";

const DUPLICATE_FIELDS = ["username", "email", "pan", "adhaar"];

async function findDuplicateUser(data, excludeId = null) {
    const conditions = DUPLICATE_FIELDS
        .filter((field) => data[field] !== undefined && data[field] !== null && data[field] !== "")
        .map((field) => ({ [field]: data[field] }));

    if (conditions.length === 0) {
        return null;
    }

    const query = { $or: conditions };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    return await user.findOne(query);
}

export const createUser = async (req, res) => {
    try {
        const { username, email, pan, adhaar } = req.body;
        const duplicateUser = await findDuplicateUser({ username, email, pan, adhaar });

        if (duplicateUser) {
            return res.status(400).json({
                message: "User with the same username, email, PAN, or Aadhaar already exists"
            });
        }

        const newUser = new user(req.body);
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await user.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const foundUser = await user.findById(userId);

        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(foundUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, pan, adhaar } = req.body;

        const duplicateUser = await findDuplicateUser(
            { username, email, pan, adhaar },
            userId
        );

        if (duplicateUser) {
            return res.status(400).json({
                message: "Another user already has the same username, email, PAN, or Aadhaar"
            });
        }

        const updatedUser = await user.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await user.findByIdAndDelete(userId);

        if (!deletedUser){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
