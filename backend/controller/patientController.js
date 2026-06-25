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



// @desc    Generate a comprehensive invoice/bill statement for a single patient
// @route   GET /api/patients/:id/invoice
export const getPatientInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify if the passed ID is a valid MongoDB hexadecimal object ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Patient ID format" });
        }

        // Run the high-performance Aggregation Pipeline
        const invoiceData = await mongoose.model("Patient").aggregate([
            // Step 1: Match the specific patient by their ID
            { $match: { _id: new mongoose.Types.ObjectId(id) } },

            // Step 2: Extract map keys and do mathematical transformations
            {
                $project: {
                    pid: 1,
                    name: 1,
                    mobilePhone: 1,
                    // Transform the billItems map into an array of objects: [{ k: "X-Ray", v: { amount: 1500, status: "unpaid" } }]
                    billingTable: { $objectToArray: "$billItems" }
                }
            },

            // Step 3: Format the billing data and compute the balances
            {
                $project: {
                    pid: 1,
                    name: 1,
                    mobilePhone: 1,
                    
                    // Clean up the table structure for the frontend UI layout
                    invoiceItems: {
                        $map: {
                            input: "$billingTable",
                            as: "item",
                            in: {
                                itemName: "$$item.k",
                                amount: "$$item.v.amount",
                                status: "$$item.v.status"
                            }
                        }
                    },

                    // Calculate Total Billing Amount
                    totalBillAmount: { $sum: "$billingTable.v.amount" },

                    // Calculate Total Amount Paid Already
                    totalAmountPaid: {
                        $sum: {
                            $map: {
                                input: "$billingTable",
                                as: "item",
                                in: {
                                    $cond: [ { $eq: ["$$item.v.status", "paid"] }, "$$item.v.amount", 0 ]
                                }
                            }
                        }
                    },

                    totalAmountDue: {
                        $sum: {
                            $map: {
                                input: "$billingTable",
                                as: "item",
                                in: {
                                    $cond: [ { $eq: ["$$item.v.status", "unpaid"] }, "$$item.v.amount", 0 ]
                                }
                            }
                        }
                    }
                }
            }
        ]);

        if (!invoiceData || invoiceData.length === 0) {
            return res.status(404).json({ success: false, message: "Patient invoice records not found" });
        }

        return res.status(200).json({ success: true, invoice: invoiceData[0] });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};