import mongoose from "mongoose";

const PrescribedMedicineSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine", // Links to your Medicine inventory model (m001, m002)
    required: [true, "Medicine reference is required"]
  },
  days: {
    type: Number,
    required: [true, "Number of days is required"],
    min: [1, "Days must be at least 1"]
  },
  frequency: {
    type: String,
    required: [true, "Frequency note is required (e.g., 1-0-1)"],
    trim: true
  },
  quantity: {
    type: Number,
    default: null // Left blank/null initially until the pharmacist fills it
  },
   // ⚡ UPDATE: Array of structured medicine objects
    medicine: [PrescribedMedicineSchema],
    
    // ⚡ UPDATE: Procedures point directly to the Procedure collection IDs
    procedure: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Procedure"
    }]
}, { _id: false });



const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor reference is required"],
    },
    status: {
      type: String,
      enum: ["waiting", "scheduled", "completed"],
      default: "waiting",
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    appointmentTime: {
      type: String,
      required: [true, "Appointment time is required"],
    },
    vitals: {
      type: Map,
      of: String,
      default: {},
    },
    patientType:{
      type: String,
      enum: ["ip", "op"],
      default:  "op",
    },
    jdObservations:{
      type: String,
      default: ""
    },
    sdObservations:{
      type: String,
      default: ""
    },
    nurseNote:{
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    medicine: {
      
    },
    procedure: {

    }
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, appointmentTime: 1 },
  { unique: true }
);







export default mongoose.model("Appointment", appointmentSchema);
