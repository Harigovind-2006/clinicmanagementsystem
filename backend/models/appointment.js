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
<<<<<<< HEAD
        type: Map,
        of: String, 
        default: {} 
    }
});

export default mongoose.model('Appointment', appointmentSchema);
=======
      type: Map,
      of: String,
      default: {},
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
>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432
