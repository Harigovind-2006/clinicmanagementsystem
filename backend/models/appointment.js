const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    patient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, "Patient reference is required"]
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Doctor reference is required"]
    },
    status: {
        type: String,
        enum: ["waiting", "scheduled", "completed"],
        default: "waiting" // Defaults to waiting when a receptionist schedules it
    },
    appointmentDate: {
        type: Date,
        required: [true, "Appointment date is required"]
    },
    appointmentTime: {
        type: String,
        required: [true, "Appointment time is required"]
    },
    vitals: {
        type: Map,
        of: String, 
        default: {} 
    }
});