import express from "express"
import { createMedicine, getAllMedicines, getMedicineById, updateMedicine, deleteMedicine, updateQuantity } from "../controller/medicineController.js"

const route = express.Router();
route.post("/medicinein", createMedicine);
route.get("/medicineget", getAllMedicines);
route.get("/medicineget/:id", getMedicineById);
route.put("/update/medicine/:id", updateMedicine);
route.delete("/delete/medicine/:id", deleteMedicine);
route.put("/update/medicinequantity/:id", updateQuantity);



export default route;