import express from "express";
import {createUser,getAllUsers,getUserById,updateUser,toggleStatus,deleteUser} from "../controller/userController.js";
const router = express.Router();

router.post("/",createUser);
router.get("/",getAllUsers);
router.get("/:id",getUserById);
router.put("/:id",updateUser);
router.patch("/:id/status",toggleStatus);
router.delete("/:id",deleteUser);

export default router;