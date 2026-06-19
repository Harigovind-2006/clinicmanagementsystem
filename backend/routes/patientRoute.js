import express from "express"
import { createPatient, getAllPatients, getPatientById, updatePatient,  deletePatient} from "../controller/patientController.js"

const route = express.Router();
route.post("/patientin", createPatient);
route.get("/patientget", getAllPatients);
route.get("/patientget/:id", getPatientById);
route.put("/update/patient/:id", updatePatient);
route.delete("/delete/patient/:id", deletePatient);

export default route;