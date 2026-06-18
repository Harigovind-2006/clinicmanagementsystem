import express from "express"
import {createUser, getAllUsers, getUserById, updateUser, deleteUser} from "../controller/userController.js"
const route = express.Router();

route.post("/userin", createUser)
route.get("/userget", getAllUsers)
route.get("/userget/:id", getUserById);
route.put("/update/user/:id", updateUser);
route.delete("/delete/user/:id", deleteUser);

export default route;