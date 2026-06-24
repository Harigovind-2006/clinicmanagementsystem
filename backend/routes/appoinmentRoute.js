import express from "express";
import {
  createAppoinment,
  getAllActiveAppoinments,
  getAppoinmentById,
  updateAppoinment,
  deleteAppoinment,
} from "../controller/appoinmentController.js";

const route = express.Router();

route.route("/")
  .post(createAppoinment)
  .get(getAllActiveAppoinments);

route.route("/:id")
  .get(getAppoinmentById)
  .put(updateAppoinment)
  .delete(deleteAppoinment);

export default route;
