import express from "express";
import {
  createAppoinment,
  getAllActiveAppoinments,
  getAppoinmentById,
  updateAppoinment,
  deleteAppoinment,
  doctorAddsProcedure,
  doctorPrescribesMedicine,
  pharmacistDispenseAndBill,
  getPatientHistory
} from "../controller/appoinmentController.js";

const route = express.Router();

route.route("/")
  .post(createAppoinment)
  .get(getAllActiveAppoinments);

route.route("/:id")
  .get(getAppoinmentById)
  .put(updateAppoinment)
  .delete(deleteAppoinment);



  // Button Action 1: Doctor clicks "Add Procedure"
route.put("/:id/add-procedure", doctorAddsProcedure);

// Button Action 2: Doctor clicks "Add Medicine" 
route.put("/:id/prescribe-medicine", doctorPrescribesMedicine);

// Button Action 3: Pharmacist clicks "Proceed & Bill"
route.put("/:id/dispense-medicine", pharmacistDispenseAndBill);

route.get("/history/:patientId", getPatientHistory);


export default route;
