import express from "express";
import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from "../controller/userController.js";

const route = express.Router();

route.route("/")
  .post(createUser)     
  .get(getAllUsers);     

route.route("/:id")
  .get(getUserById)     
  .put(updateUser)       
  .delete(deleteUser);  

export default route;