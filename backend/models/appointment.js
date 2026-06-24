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



// 7. NEW WORKFLOW: GET PATIENT APPOINTMENT HISTORY (No new table needed!)
// =========================================================================
// @route   GET /api/appointments/history/:patientId
export const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params; // Expects the MongoDB _id of the patient

        // Search the appointment table for this specific patient where status is completed
        const history = await Appointment.find({ 
            patient: patientId, 
            status: "completed" 
        })
        .sort({ appointmentDate: -1, appointmentTime: -1 }) // Newest history first
        .populate("doctor", "fullname specialisation")     // Fetches doctor name and specialisation
        .populate("medicine.medicine", "medName medScientificName") // Fetches medicine inventory details
        .populate("procedure", "procedureName amount");     // Fetches procedure names and costs

        if (!history || history.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: "No past medical history found for this patient.", 
                count: 0,
                data: [] 
            });
        }

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch patient history logs",
            error: error.message
        });
    }
};



export default mongoose.model("Appointment", appointmentSchema);
