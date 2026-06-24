import express from "express"
import {
    createProcedure,
    getActiveProcedures,
    updateProcedure,
    deleteProcedure
} from "../controller/procedureController.js"

const route = express.Router();

route.route("/")
    .post(createProcedure)       
    .get(getActiveProcedures);

route.route("/:id")
    .put(updateProcedure)        
    .delete(deleteProcedure); 

export default route;