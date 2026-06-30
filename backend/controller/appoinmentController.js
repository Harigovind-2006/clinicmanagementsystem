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
      tokenNumber: count + 1
    });

    const savedAppointment = await appointment.save();

    const patient = await Patient.findById(savedAppointment.patient)
      .select("pid name mobilePhone email dob gender bloodGroup address");

    const doctor = await User.findById(savedAppointment.doctor)
      .select("fullname specialisation email mobilePhone");

    const result = {
      ...savedAppointment.toObject(),
      patient: patient,
      doctor: doctor
    };

    return res.status(201).json(result);
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
  };

  export const getAllActiveAppoinments = async (req, res) => {
    try {
      const activeAppoinments = await Appointment.find({ isActive: true })
        .sort({ appointmentDate: 1, appointmentTime: 1 });

      if (!activeAppoinments || activeAppoinments.length === 0) {
        return res.status(404).json({ message: "No Appointments found" });
      }

      const populatedAppointments = await Promise.all(
        activeAppoinments.map(async (appointment) => {
          const patient = await Patient.findById(appointment.patient)
            .select("pid name mobilePhone email");

          const doctor = await User.findById(appointment.doctor)
            .select("fullname specialisation email mobilePhone");

          return {
            ...appointment.toObject(),
            patient: patient,
            doctor: doctor
          };
        })
      );

      return res.status(200).json(populatedAppointments);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const getAppoinmentById = async (req, res) => {
    try {
      const appoinmentId = req.params.id;
      const foundAppoinment = await Appointment.findById(appoinmentId);

      if (!foundAppoinment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      const patient = await Patient.findById(foundAppoinment.patient)
        .select("pid name mobilePhone email dob gender bloodGroup address");

      const doctor = await User.findById(foundAppoinment.doctor)
        .select("fullname specialisation email mobilePhone");

      const medicineDetails = await Promise.all(
        (foundAppoinment.medicine || []).map(async (med) => {
          const medicine = await Medicine.findById(med.medicine)
            .select("medicinename medScientificName unitcost");
          return {
            ...med.toObject(),
            medicine: medicine
          };
        })
      );

      const procedureDetails = await Promise.all(
        (foundAppoinment.procedure || []).map(async (procId) => {
          return await Procedure.findById(procId)
            .select("procedureName amount");
        })
      );

      const result = {
        ...foundAppoinment.toObject(),
        patient: patient,
        doctor: doctor,
        medicine: medicineDetails,
        procedure: procedureDetails
      };

      return res.status(200).json(result);
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
        return res.status(404).json({ message: "Appointment not found" });
      }

      const patient = await Patient.findById(updatedAppoinment.patient)
        .select("pid name mobilePhone email");

      const doctor = await User.findById(updatedAppoinment.doctor)
        .select("fullname specialisation email mobilePhone");

      const result = {
        ...updatedAppoinment.toObject(),
        patient: patient,
        doctor: doctor
      };

      return res.status(200).json(result);
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
      );

      if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }

      const patient = await Patient.findById(appointment.patient)
        .select("pid name");

      const doctor = await User.findById(appointment.doctor)
        .select("fullname specialisation");

      const procedures = await Promise.all(
        (appointment.procedure || []).map(async (procId) => {
          return await Procedure.findById(procId)
            .select("procedureName amount");
        })
      );

      const result = {
        ...appointment.toObject(),
        patient: patient,
        doctor: doctor,
        procedure: procedures
      };

      const billUpdate = {};
      billUpdate[`billItems.${procedureDetails.procedureName}`] = {
        amount: procedureDetails.amount,
        status: "unpaid"
      };
      await Patient.findByIdAndUpdate(appointment.patient, { $set: billUpdate });

      res.status(200).json({
        success: true,
        message: "Procedure ordered and logged to billing",
        data: result
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
      );

      if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }

      const patient = await Patient.findById(appointment.patient)
        .select("pid name");

      const doctor = await User.findById(appointment.doctor)
        .select("fullname specialisation");

      const medicineDetails = await Promise.all(
        (appointment.medicine || []).map(async (med) => {
          const medicine = await Medicine.findById(med.medicine)
            .select("medicinename medScientificName");
          return {
            ...med.toObject(),
            medicine: medicine
          };
        })
      );

      const result = {
        ...appointment.toObject(),
        patient: patient,
        doctor: doctor,
        medicine: medicineDetails
      };

      res.status(200).json({
        success: true,
        message: "Prescription saved for Pharmacist clearance",
        data: result
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

      const appointment = await Appointment.findById(id);
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

      const updatedAppointment = await Appointment.findById(id);

      const patient = await Patient.findById(updatedAppointment.patient)
        .select("pid name");

      const doctor = await User.findById(updatedAppointment.doctor)
        .select("fullname specialisation");

      const medicineDetails = await Promise.all(
        (updatedAppointment.medicine || []).map(async (med) => {
          const medicine = await Medicine.findById(med.medicine)
            .select("medicinename medScientificName unitcost");
          return {
            ...med.toObject(),
            medicine: medicine
          };
        })
      );

      const result = {
        ...updatedAppointment.toObject(),
        patient: patient,
        doctor: doctor,
        medicine: medicineDetails
      };

      res.status(200).json({
        success: true,
        message: "Pharmacy inventory updated and transaction posted to patient invoice!",
        data: {
          appointment: result,
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
        .sort({ appointmentDate: -1, appointmentTime: -1 });

      if (!history || history.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No past medical history found for this patient.",
          count: 0,
          data: []
        });
      }

      const populatedHistory = await Promise.all(
        history.map(async (appointment) => {
          const doctor = await User.findById(appointment.doctor)
            .select("fullname specialisation email");

          const medicineDetails = await Promise.all(
            (appointment.medicine || []).map(async (med) => {
              const medicine = await Medicine.findById(med.medicine)
                .select("medicinename medScientificName unitcost");
              return {
                ...med.toObject(),
                medicine: medicine
              };
            })
          );

          const procedureDetails = await Promise.all(
            (appointment.procedure || []).map(async (procId) => {
              return await Procedure.findById(procId)
                .select("procedureName amount");
            })
          );

          return {
            ...appointment.toObject(),
            doctor: doctor,
            medicine: medicineDetails,
            procedure: procedureDetails
          };
        })
      );

      res.status(200).json({
        success: true,
        count: history.length,
        data: populatedHistory
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
        .sort({ appointmentTime: 1 });

      const populatedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const patient = await Patient.findById(appointment.patient)
            .select("pid name mobilePhone");

          const doctor = await User.findById(appointment.doctor)
            .select("fullname specialisation");

          return {
            ...appointment.toObject(),
            patient: patient,
            doctor: doctor
          };
        })
      );

      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: populatedAppointments
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
        .sort({ appointmentDate: 1, appointmentTime: 1 });

      const populatedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const patient = await Patient.findById(appointment.patient)
            .select("pid name mobilePhone");

          const doctor = await User.findById(appointment.doctor)
            .select("fullname specialisation");

          return {
            ...appointment.toObject(),
            patient: patient,
            doctor: doctor
          };
        })
      );

      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: populatedAppointments
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}