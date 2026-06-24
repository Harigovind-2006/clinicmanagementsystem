import user from "../models/user.js";
import bcrypt from "bcryptjs"; // Make sure to run: npm install bcryptjs

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
        const { username, email, pan, adhaar, password } = req.body;
        
        const duplicateUser = await findDuplicateUser({ 
            username, 
            email, 
            pan, 
            adhaar 
        });

        if (duplicateUser) {
            return res.status(400).json({
                message: "User with the same username, email, PAN, or Aadhaar already exists"
            });
        }

        // Hash the incoming plain text password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Clone the request payload and overwrite the password field with the hash
        const userData = {
            ...req.body,
            password: hashedPassword
        };

        // Save the record to MongoDB
        const newUser = new user(userData);
        const savedUser = await newUser.save();
<<<<<<< HEAD
        
        return res.status(201).json(savedUser);
=======

        const userResponse = savedUser.toObject();
        delete userResponse.password;

        return res.status(201).json(userResponse);

>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432
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

        // Find the user document first
        const foundUser = await user.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Dynamically apply ONLY the fields provided in req.body
        Object.assign(foundUser, req.body);

        const updatedUser = await foundUser.save();

        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        return res.status(200).json(userResponse);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

<<<<<<< HEAD
export const updateDocAttendece = async (req, res) => {
    try {
        const userId = req.params.id;
        const { attendance } = req.body;
        
        // Slightly cleaned up logic for setting attendance
        const newAttendance = attendance === 'active' ? 'inactive' : 'active';
        
        const updatedAttendance = await user.findByIdAndUpdate(
            userId,
            { attendance: newAttendance },
            { new: true }
        );
        
        if (!updatedAttendance){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(updatedAttendance);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
=======

>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432

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
<<<<<<< HEAD
};
=======
};





// export const updateDocAttendece = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const { attendance } = req.body;
//         if (attendance=='active'){
//             const newAttendence='inactive'
//         }
//         else{
//             const newAttendence='active'
//         }
//         const updatedAttendence= await user.findByIdAndUpdate(userId, newAttendence, {new: true});
//         if (!updatedAttendence){
//             return res.status(404).json({ message: "User not found" });
//         }
//         return res.status(200).json(updatedUser);
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };
>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432
