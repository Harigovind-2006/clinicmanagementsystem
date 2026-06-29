import express from "express"
import {
    createProcedure,
    getProcedures,
    updateProcedure,
    deleteProcedure
} from "../controller/procedureController.js"

const route = express.Router();

route.route("/")
    .post(createProcedure)       
    .get(getProcedures);

route.route("/:id")
    .put(updateProcedure)        
    .delete(deleteProcedure); 

export default route;