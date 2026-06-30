import express from "express";
import { 
  createMedicine, 
  getAllMedicines, 
  getMedicineById, 
  updateMedicine, 
  deleteMedicine, 
  updateQuantity 
} from "../controller/medicineController.js";

const route = express.Router();

route.route("/")
  .post(createMedicine)     
  .get(getAllMedicines);   

route.route("/:id")
  .get(getMedicineById)    
  .put(updateMedicine)    
  .delete(deleteMedicine); 

route.put("/:id/quantity", updateQuantity);

export default route;
