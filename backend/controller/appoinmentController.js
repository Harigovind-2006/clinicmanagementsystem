import Appointment from "../models/appointment.js";
import Patient from "../models/patient.js";
import User from "../models/user.js";
import Medicine from "../models/medicine.js";
import Procedure from "../models/procedure.js";

export const createAppoinment = async (req, res) => {
  try {
    const appointmentDate = new Date(req.body.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(appointmentDate);
    nextDay.setDate(appointmentDate.getDate() + 1);

    const count = await Appointment.countDocuments({
      appointmentDate: {
        $gte: appointmentDate,
        $lt: nextDay
      }
    });

    const appointment = new Appointment({
      ...req.body,
      tokenNumber: count + 1,
      status: "scheduled"
    });

    const savedAppointment = await appointment.save();

    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate("patient", "pid name mobilePhone email dob gender bloodGroup address")
      .populate("doctor", "name specialization email mobile")
      .populate("procedure", "procedureName amount")
      .populate("medicine.medicine", "medicinename medScientificName unitcost");

    return res.status(201).json(populatedAppointment.toObject({ flattenMaps: true }));
  } catch (error) {
    console.error("===== CREATE APPOINTMENT ERROR =====");
    console.error(error);

    if (error.errors) {
      console.error("Validation Errors:", error.errors);
    }

    console.error("Request Body:", req.body);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "This doctor already has an appointment at the selected time."
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const removeProcedure = async (req, res) => {
  try {
    const { id, procedureId } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        $pull: {
          procedure: procedureId,
        },
      },
      { new: true }
    ).populate("procedure");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const getAllActiveAppoinments = async (req, res) => {
  try {
    const activeAppoinments = await Appointment.find({ isActive: true })
      .populate("patient", "pid name mobilePhone email")
      .populate("doctor", "name specialization email mobile")
      .populate("procedure", "procedureName amount")
      .populate("medicine.medicine", "medicinename medScientificName unitcost")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    if (!activeAppoinments || activeAppoinments.length === 0) {
      return res.status(404).json({ message: "No Appointments found" });
    }

    return res.status(200).json(
      activeAppoinments.map(app => app.toObject({ flattenMaps: true }))
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAppoinmentById = async (req, res) => {
  try {
    const appoinmentId = req.params.id;
    const foundAppoinment = await Appointment.findById(appoinmentId)
      .populate("patient", "pid name mobilePhone email dob gender bloodGroup address")
      .populate("doctor", "name specialization email mobile")
      .populate("procedure", "procedureName amount")
      .populate("medicine.medicine", "medicinename medScientificName unitcost");

    if (!foundAppoinment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json(foundAppoinment.toObject({ flattenMaps: true }));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAppoinment = async (req, res) => {
  try {
    const appoinmentId = req.params.id;
    
    const appointment = await Appointment.findById(appoinmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (req.body.vitals !== undefined) {
      appointment.vitals = req.body.vitals;
    }

    if (req.body.complaints !== undefined) {
      appointment.complaints = req.body.complaints;
    }

    if (req.body.jdObservations !== undefined) {
      appointment.jdObservations = req.body.jdObservations;
    }

    if (req.body.sdObservations !== undefined) {
      appointment.sdObservations = req.body.sdObservations;
    }

    if (req.body.nurseNote !== undefined) {
      appointment.nurseNote = req.body.nurseNote;
    }

    if (req.body.status !== undefined) {
      appointment.status = req.body.status;
    }

    if (req.body.patientType !== undefined) {
      appointment.patientType = req.body.patientType;
    }

    if (req.body.from !== undefined) {
      appointment.from = req.body.from;
    }

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appoinmentId)
      .populate("patient", "pid name mobilePhone email dob gender bloodGroup address")
      .populate("doctor", "name specialization email mobile")
      .populate("procedure", "procedureName amount")
      .populate("medicine.medicine", "medicinename medScientificName unitcost");

    return res.status(200).json(populatedAppointment.toObject({ flattenMaps: true }));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This doctor already has an appointment at the selected time. Please choose another time slot."
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAppoinment = async (req, res) => {
  try {
    const appoinmentId = req.params.id;
    const deletedAppoinment = await Appointment.findByIdAndDelete(appoinmentId);

    if (!deletedAppoinment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({ message: "Appointment deleted successfully" });
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
    )
      .populate("patient", "pid name")
      .populate("doctor", "name specialization")
      .populate("procedure", "procedureName amount")
      .populate("medicine.medicine", "medicinename medScientificName unitcost");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const billUpdate = {};
    billUpdate[`billItems.${procedureDetails.procedureName}`] = {
      amount: procedureDetails.amount,
      status: "unpaid"
    };
    await Patient.findByIdAndUpdate(appointment.patient, { $set: billUpdate });

    res.status(200).json({
      success: true,
      message: "Procedure ordered and logged to billing",
      data: appointment.toObject({ flattenMaps: true })
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const doctorPrescribesMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { medicineId, days, frequency } = req.body;

    const medicineExists = await Medicine.findById(medicineId);
    if (!medicineExists) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found in inventory"
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $push: { medicine: { medicine: medicineId, days, frequency } } },
      { new: true }
    )
      .populate("patient", "pid name")
      .populate("doctor", "name specialization")
      .populate("procedure", "procedureName amount")
      .populate("medicine.medicine", "medicinename medScientificName unitcost");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Prescription saved for Pharmacist clearance",
      data: appointment.toObject({ flattenMaps: true })
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const pharmacistDispenseAndBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { dispensedMedicines } = req.body;

    if (!dispensedMedicines || !Array.isArray(dispensedMedicines) || dispensedMedicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one medicine to dispense"
      });
    }

    const appointment = await Appointment.findById(id)
      .populate("patient", "pid name")
      .populate("doctor", "name specialization")
      .populate("procedure", "procedureName amount")
      .populate("medicine.medicine", "medicinename medScientificName unitcost");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment reference not found" });
    }

    const dynamicBillUpdates = {};
    const dispensedItems = [];

    for (const disp of dispensedMedicines) {
      const med = await Medicine.findById(disp.medicineId);
      if (!med) {
        return res.status(404).json({
          success: false,
          message: `Medicine ID ${disp.medicineId} not found in inventory`
        });
      }

      if (med.quantityLeft < disp.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for ${med.medicinename}. Only ${med.quantityLeft} left.`
        });
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

      dispensedItems.push({
        medicineName: med.medicinename,
        quantity: disp.quantity,
        unitCost: med.unitcost,
        totalCost: totalCost
      });
    }

    await Patient.findByIdAndUpdate(appointment.patient, { $set: dynamicBillUpdates });

    const updatedAppointment = await Appointment.findById(id)
      .populate("patient", "pid name")
      .populate("doctor", "name specialization")
      .populate("procedure", "procedureName amount")
      .populate("medicine.medicine", "medicinename medScientificName unitcost");

    res.status(200).json({
      success: true,
      message: "Pharmacy inventory updated and transaction posted to patient invoice!",
      data: {
        appointment: updatedAppointment.toObject({ flattenMaps: true }),
        dispensedItems: dispensedItems,
        totalBill: Object.values(dynamicBillUpdates).reduce((sum, item) => sum + item.amount, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required"
      });
    }

    const history = await Appointment.find({
      patient: patientId,
      status: "completed"
    })
      .populate("doctor", "name specialization email mobile")
      .populate("procedure", "procedureName amount")
      .populate("medicine.medicine", "medicinename medScientificName unitcost")
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    if (!history || history.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No past medical history found for this patient.",
        count: 0,
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history.map(app => app.toObject({ flattenMaps: true }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient history logs",
      error: error.message
    });
  }
};

export const getTodayAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      },
      isActive: true
    })
      .populate("patient", "pid name mobilePhone")
      .populate("doctor", "name specialization email mobile")
      .populate("procedure", "procedureName amount")
      .populate("medicine.medicine", "medicinename medScientificName unitcost")
      .sort({ appointmentTime: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments.map(app => app.toObject({ flattenMaps: true }))
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const query = { doctor: doctorId, isActive: true };

    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(searchDate.getDate() + 1);
      query.appointmentDate = {
        $gte: searchDate,
        $lt: nextDay
      };
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "pid name mobilePhone")
      .populate("doctor", "name specialization email mobile")
      .populate("procedure", "procedureName amount")
      .populate("medicine.medicine", "medicinename medScientificName unitcost")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments.map(app => app.toObject({ flattenMaps: true }))
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};