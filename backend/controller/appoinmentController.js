
import Appointment from "../models/appointment.js";
import Patient from "../models/patient.js";
import Medicine from "../models/medicine.js";
import Procedure from "../models/procedure.js";

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
      return res.status(200).json(activeAppoinments);
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

export const doctorAddsProcedure = async (req, res) => {
    try {
        const { id } = req.params; 
        const { procedureId } = req.body;

        const procedureDetails = await Procedure.findById(procedureId);
        if (!procedureDetails) {
            return res.status(404).json({ success: false, message: "Procedure lookup failed" });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { $push: { procedure: procedureId } },
            { new: true }
        );

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

export const doctorPrescribesMedicine = async (req, res) => {
    try {
        const { id } = req.params; 
        const { medicineId, days, frequency } = req.body; 

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

export const pharmacistDispenseAndBill = async (req, res) => {
    try {
        const { id } = req.params; 
        const { dispensedMedicines } = req.body; 

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment reference not found" });
        }

        const dynamicBillUpdates = {};

        for (const disp of dispensedMedicines) {
            const med = await Medicine.findById(disp.medicineId);
            if (!med) {
                return res.status(404).json({ success: false, message: `Medicine ID ${disp.medicineId} not found in inventory` });
            }

            if (med.quantityLeft < disp.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient inventory for ${med.medicinename}. Only ${med.quantityLeft} left.` });
            }

            med.quantityLeft -= disp.quantity;
            await med.save();

            await Appointment.updateOne(
                { _id: id, "medicine.medicine": disp.medicineId },
                { $set: { "medicine.$.quantity": disp.quantity } }
            );

            const totalCost = med.unitcost * disp.quantity;
            dynamicBillUpdates[`billItems.${med.medicinename}`] = {
                amount: totalCost,
                status: "unpaid"
            };
        }
        await Patient.findByIdAndUpdate(appointment.patient, { $set: dynamicBillUpdates });

        res.status(200).json({ success: true, message: "Pharmacy inventory updated and transaction posted to patient invoice!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params; 

        const history = await Appointment.find({ 
            patient: patientId, 
            status: "completed" 
        })
        .sort({ appointmentDate: -1, appointmentTime: -1 }) 
        .populate("doctor", "fullname specialisation")     
        .populate("medicine.medicine", "medicinename medScientificName") 
        .populate("procedure", "procedureName amount");     

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
