import Appointment from "../models/appointment.js";

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