import mongoose from "mongoose";

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
    JdObservations:{
      type: String,
      default: ""
    },
    
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
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
