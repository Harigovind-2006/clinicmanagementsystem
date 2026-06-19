import Patient from "../models/patient.js";

export const createPatient = async (req, res) => {
    try {
        const patientData = req.body;

        // pid is auto-generated in the schema pre-save hook,
        // so the controller should NOT manually set it.
        const newPatient = new Patient(patientData);
        const savedPatient = await newPatient.save();

        return res.status(201).json(savedPatient);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        return res.status(500).json({ message: error.message });
    }
};


export const getAllPatients = async (req, res) => {
    try {
        const patients = await patient.find();
        if (!patients || patients.length === 0) {
            return res.status(404).json({ message: "No patients found" });
        }
        return res.status(200).json(patients);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



export const getPatientById = async (req, res) => {
    try {
        const patientId = req.params.id;
        const foundPatient = await patient.findById(patientId);
        if (!foundPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json(foundPatient);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const updatePatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const updatedData = req.body;

        const updatedPatient = await patient.findByIdAndUpdate(patientId, updatedData, { new: true });
        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json(updatedPatient);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



export const deletePatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const deletedPatient = await patient.findByIdAndDelete(patientId);
        if (!deletedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


