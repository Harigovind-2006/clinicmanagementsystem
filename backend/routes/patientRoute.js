import express from "express";
import { 
  createPatient, 
  getAllPatients, 
  getPatientById, 
  updatePatient,  
  deletePatient, 
  updatePatientBills,
  getPatientInvoice,
  dischargePatient
} from "../controller/patientController.js";

const route = express.Router();

route.route("/")
  .post(createPatient)     
  .get(getAllPatients);     

route.route("/:id")
  .get(getPatientById)      
  .put(updatePatient)       
  .delete(deletePatient);   

// 3. Specialized sub-route for handling billing updates
route.put("/:id/bills", updatePatientBills); 
route.get("/:id/invoice", getPatientInvoice);
route.put("/discharge/:id", dischargePatient);

export default route;