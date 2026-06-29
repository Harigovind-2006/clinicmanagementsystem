import Room from "../models/room.js";
import User from "../models/user.js";
import Patient from "../models/patient.js";
import mongoose from "mongoose";

export const createRoom = async (req, res) => {
    try {
        const newRoom = new Room(req.body);
        await newRoom.save();
        res.status(201).json({ success: true, data: newRoom });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate("currentPatient", "name pid mobilePhone");
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const managerAssignsRoom = async (req, res) => {
    try {
        const managerId = req.params.id; 
        const { roomId, patientId, advancePaid } = req.body; 

        const staffUser = await User.findById(managerId);
        if (!staffUser || staffUser.role !== "manager") {
            return res.status(403).json({ success: false, message: "Access Denied. Authorization required." });
        }

        const patient = await mongoose.model("Patient").findById(patientId);
        if (!patient || patient.patientType !== "ip") {
            return res.status(400).json({ success: false, message: "Allocation Denied. Target must be an In-Patient (ip)." });
        }

        const targetRoom = await Room.findById(roomId);
        if (!targetRoom || targetRoom.status !== "available") {
            return res.status(400).json({ success: false, message: "Selected room is currently unavailable." });
        }

        targetRoom.status = "occupied";
        targetRoom.currentPatient = patientId;
        targetRoom.occupiedDate = new Date();
        targetRoom.advancePaid = advancePaid;

        await targetRoom.save(); 

        res.status(200).json({ 
            success: true, 
            message: `Room assigned successfully by Manager ${staffUser.fullname}`, 
            data: targetRoom 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: "Assignment failed", error: error.message });
    }
};

export const managerUpdatesRoom = async (req, res) => {
    try {
        const managerId = req.params.id; 
        const { roomId, updateData } = req.body; 

        const staffUser = await User.findById(managerId);
        if (!staffUser || staffUser.role !== "manager") {
            return res.status(403).json({ success: false, message: "Access Denied. Manager privileges required." });
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { $set: updateData }, 
            { new: true, runValidators: true }
        );

        if (!updatedRoom) {
            return res.status(404).json({ success: false, message: "Target room record not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: `Room configurations updated by Manager ${staffUser.fullname}`, 
            data: updatedRoom 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const processRoomReleaseAndRent = async (patientId) => {
    const room = await Room.findOne({ currentPatient: patientId, status: "occupied" });
    
    if (!room) return { message: "No active room assignment found for this patient." };

    const checkInTime = new Date(room.occupiedDate).getTime();
    const checkOutTime = new Date().getTime(); 
    
    const msPerDay = 1000 * 60 * 60 * 24;
    let nightsStayed = Math.ceil((checkOutTime - checkInTime) / msPerDay);
    
    if (nightsStayed <= 0) nightsStayed = 1;

    let perNightRate = 0;
    if (room.roomCategory === "small") perNightRate = 1000;
    if (room.roomCategory === "medium") perNightRate = 1500;
    if (room.roomCategory === "large") perNightRate = 2500;

    const totalRoomGrossCost = nightsStayed * perNightRate;
    const netRoomCharge = totalRoomGrossCost - room.advancePaid;

    const billingLineItem = {};
    const mapKeyName = `Room Rent (${room.roomCategory.toUpperCase()} - ${nightsStayed} Nights)`;
    
    billingLineItem[`billItems.${mapKeyName}`] = {
        amount: netRoomCharge, 
        status: "unpaid" // Fixed: Added status parameter back for invoicing pipeline
    };

    await Patient.findByIdAndUpdate(patientId, { $set: billingLineItem });

    room.status = "available";
    room.currentPatient = null;
    room.occupiedDate = null;
    room.advancePaid = 0;
    await room.save();

    return {
        success: true,
        roomNumber: room.roomId,
        category: room.roomCategory,
        nights: nightsStayed,
        grossCost: totalRoomGrossCost,
        advancePaid: room.advancePaid,
        netAmountPosted: netRoomCharge
    };
};
