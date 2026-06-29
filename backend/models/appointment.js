import mongoose from "mongoose";

const PrescribedMedicineSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: [true, "Medicine reference is required"],
    },
    days: {
      type: Number,
      required: [true, "Number of days is required"],
      min: [1, "Days must be at least 1"],
    },
    frequency: {
      type: String,
      required: [true, "Frequency note is required (e.g., 1-0-1)"],
      trim: true,
    },
    quantity: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: Number,
      required: true,
    },
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
      enum: ["waiting", "scheduled", "completed", "in-progress", "follow-up"],
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
    complaints: {
      type: String,
      default: "",
    },
    patientType: {
      type: String,
      enum: ["ip", "op"],
      default: "op",
    },
    from: {
      type: String,
      enum: ["OPD", "IP"],
      default: "OPD",
    },
    roomNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room', 
      required: [
        function() {
          return this.patientType === "ip";
        },
        "Room number is required for In-Patients (ip)"
      ]
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI"],
      default: "Cash",
    },
    upiId: {
      type: String,
      default: "",
      trim: true,
    },
    consultationFee: {
      type: Number,
      default: 500,
      min: [0, "Consultation fee cannot be negative"],
    },
    paymentTimestamp: {
      type: Date,
      default: null,
    },
    jdObservations: {
      type: String,
      default: ""
    },
    sdObservations: {
      type: String,
      default: ""
    },
    nurseNote: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    medicine: {
      type: [PrescribedMedicineSchema],
      default: [],
    },
    procedure: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Procedure",
        }
      ],
      default: [],
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

appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ tokenNumber: 1 }, { unique: true });

appointmentSchema.pre('save', function(next) {
  if (this.paymentMethod && !this.paymentTimestamp) {
    this.paymentTimestamp = new Date();
  }
  next();
});

appointmentSchema.virtual('paymentStatus').get(function() {
  if (this.paymentMethod && this.paymentTimestamp) {
    return 'Paid';
  }
  return 'Pending';
});

appointmentSchema.virtual('assignedDoctorName').get(function() {
  return this.doctor; 
});

appointmentSchema.virtual('specialization').get(function() {
  return this.doctor?.specialisation || 'N/A';
});

appointmentSchema.set('toJSON', { virtuals: true });
appointmentSchema.set('toObject', { virtuals: true });

export default mongoose.model("Appointment", appointmentSchema);