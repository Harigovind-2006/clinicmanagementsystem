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
        const patients = await Patient.find();
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
        const foundPatient = await Patient.findById(patientId);
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

        const updatedPatient = await Patient.findByIdAndUpdate(patientId, updatedData, { new: true });
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
        const deletedPatient = await Patient.findByIdAndDelete(patientId);
        if (!deletedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



export const updatePatientBills = async (req, res) => {
  try {
    const { id } = req.params; // MongoDB _id of the patient
    const { newBills } = req.body; // Expecting e.g., { "Pharmacy Bill": { "amount": 450, "status": "unpaid" } }

    const updateFields = {};
    
    // Loop through the incoming entries to structure the dot notation updates
    for (const [billName, details] of Object.entries(newBills)) {
      updateFields[`billItems.${billName}`] = details;
    }

    // Update the patient document
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true } // runValidators ensures 'paid'/'unpaid' values are accurate
    );

    if (!updatedPatient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(200).json({ success: true, message: 'Bills updated!', data: updatedPatient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};