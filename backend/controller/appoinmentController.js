import Appointment from "../models/appointment.js";
import Patient from "../models/patient.js";
import { Medicine } from "../models/medicine.js";
import { Procedure } from "../models/procedure.js";

export const createAppoinment = async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    return res.status(201).json(savedAppointment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllActiveAppoinments = async (req, res) => {
  try {
    const activeAppoinments = await Appointment.find({ isActive: true })
      .populate("patient", "pid name")
      .populate("doctor", "fullname specialisation");

    if (!activeAppoinments || activeAppoinments.length === 0) {
      return res.status(404).json({ message: "No Appoinments found" });
    }

    return res.status(200).json(activeAppoinments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAppoinmentById = async (req, res) => {
  try {
    const appoinmentId = req.params.id;
    const foundAppoinment = await Appointment.findById(appoinmentId);

    if (!foundAppoinment) {
      return res.status(404).json({ message: "Appoinment not found" });
    }

    return res.status(200).json(foundAppoinment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAppoinment = async (req, res) => {
  try {
    const appoinmentId = req.params.id;
    const updatedAppoinment = await Appointment.findByIdAndUpdate(
      appoinmentId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedAppoinment) {
      return res.status(404).json({ message: "Appoinment not found" });
    }

    return res.status(200).json(updatedAppoinment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAppoinment = async (req, res) => {
  try {
    const appoinmentId = req.params.id;
    const deletedAppoinment = await Appointment.findByIdAndDelete(appoinmentId);

    if (!deletedAppoinment) {
      return res.status(404).json({ message: "Appoinment not found" });
    }

    return res.status(200).json({ message: "Appoinment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




// 4. NEW WORKFLOW: DOCTOR ADDS A PROCEDURE (Instantly Billed)
// =========================================================================
// @route   PUT /api/appointments/:id/add-procedure
export const doctorAddsProcedure = async (req, res) => {
    try {
        const { id } = req.params; // Appointment ID
        const { procedureId } = req.body;

        const procedureDetails = await Procedure.findById(procedureId);
        if (!procedureDetails) {
            return res.status(404).json({ success: false, message: "Procedure lookup failed" });
        }

        // Push procedure object ID to the appointment array
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { $push: { procedure: procedureId } },
            { new: true }
        );

        // Push procedure name and cost instantly to the Patient's billItems Map
        const billUpdate = {};
        billUpdate[`billItems.${procedureDetails.procedureName}`] = {
            amount: procedureDetails.amount,
            status: "unpaid"
        };
        await Patient.findByIdAndUpdate(appointment.patient, { $set: billUpdate });

        res.status(200).json({ success: true, message: "Procedure ordered and logged to billing", data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 5. NEW WORKFLOW: DOCTOR PRESCRIBES MEDICINE (Saved without Bill or Stock deduction)
// =========================================================================
// @route   PUT /api/appointments/:id/prescribe-medicine
export const doctorPrescribesMedicine = async (req, res) => {
    try {
        const { id } = req.params; // Appointment ID
        const { medicineId, days, frequency } = req.body; // e.g., { medicineId: "hex...", days: 5, frequency: "1-0-1" }

        // Pushes the medicine configuration with quantity initialized as null
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { $push: { medicine: { medicine: medicineId, days, frequency } } },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Prescription saved for Pharmacist clearance", data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// =========================================================================
// 6. NEW WORKFLOW: PHARMACIST ADDS QUANTITY (Deducts Stock & Dispatches Bill)
// =========================================================================
// @route   PUT /api/appointments/:id/dispense-medicine
export const pharmacistDispenseAndBill = async (req, res) => {
    try {
        const { id } = req.params; // Appointment ID
        const { dispensedMedicines } = req.body; 
        // Expected payload layout: [ { medicineId: "65b...", quantity: 15 }, { medicineId: "65c...", quantity: 10 } ]

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment reference not found" });
        }

        const dynamicBillUpdates = {};

        // Loop through each entry the pharmacist verified
        for (const disp of dispensedMedicines) {
            const med = await Medicine.findById(disp.medicineId);
            if (!med) {
                return res.status(404).json({ success: false, message: `Medicine ID ${disp.medicineId} not found in inventory` });
            }

            // Guardrail: Block dispatch if stock is insufficient
            if (med.quantityLeft < disp.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient inventory for ${med.medName}. Only ${med.quantityLeft} left.` });
            }

            // 1. Deduct stock from the physical inventory count
            med.quantityLeft -= disp.quantity;
            await med.save();

            // 2. Use Mongoose positional operator ($) to set the pharmacist quantity inside the specific nested array element
            await Appointment.updateOne(
                { _id: id, "medicine.medicine": disp.medicineId },
                { $set: { "medicine.$.quantity": disp.quantity } }
            );

            // 3. Compute the financial cost line item
            const totalCost = med.unitCost * disp.quantity;
            dynamicBillUpdates[`billItems.${med.medName}`] = {
                amount: totalCost,
                status: "unpaid"
            };
        }

        // 4. Send the total calculated costs over to the Patient's master bill items Map
        await Patient.findByIdAndUpdate(appointment.patient, { $set: dynamicBillUpdates });

        res.status(200).json({ success: true, message: "Pharmacy inventory updated and transaction posted to patient invoice!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


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