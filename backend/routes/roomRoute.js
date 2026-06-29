import express from "express";
import { 
    createRoom, 
    getAllRooms, 
    managerAssignsRoom, 
    managerUpdatesRoom ,
    getDischargePatients
} from "../controller/roomController.js";

const route = express.Router();


route.route("/")
    .post(createRoom)       
    .get(getAllRooms);     
route.put("/assign/by-manager/:id", managerAssignsRoom); 

route.put("/update/by-manager/:id", managerUpdatesRoom);

router.get("/discharge", getDischargePatients);

export default route;
