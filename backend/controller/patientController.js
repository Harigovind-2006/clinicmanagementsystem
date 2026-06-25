import Patient from "../models/patient.js";
import { processRoomReleaseAndRent } from "./roomController.js"; // Fixed: Added curly braces for named import
import user from "../models/user.js";
import mongoose from "mongoose"; // Fixed: Added missing mongoose import

export const createPatient = async (req, res) => {
    try {
        const patientData = req.body;
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
};

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
};

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
};

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
};

export const updatePatientBills = async (req, res) => {
  try {
    const { id } = req.params;
    const { newBills } = req.body; 

    const updateFields = {};
    for (const [billName, details] of Object.entries(newBills)) {
      updateFields[`billItems.${billName}`] = details;
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true } 
    );

    if (!updatedPatient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(200).json({ success: true, message: 'Bills updated!', data: updatedPatient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getPatientInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Patient ID format" });
        }

        const invoiceData = await mongoose.model("Patient").aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $project: {
                    pid: 1,
                    name: 1,
                    mobilePhone: 1,
                    patientType: 1,
                    billingTable: { $objectToArray: "$billItems" }
                }
            },
            {
                $project: {
                    pid: 1,
                    name: 1,
                    mobilePhone: 1,
                    patientType: 1,
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
                    totalBillAmount: { $sum: "$billingTable.v.amount" },
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
            return res.status(404).json({ success: false, message: "No billing information found for this profile." });
        }

        const finalStatement = invoiceData[0];

        let financialAction = "collect_payment";
        if (finalStatement.totalAmountDue < 0) {
            financialAction = "refund_to_patient";
            finalStatement.refundAmountExpected = Math.abs(finalStatement.totalAmountDue);
        } else {
            finalStatement.refundAmountExpected = 0;
        }

        return res.status(200).json({ 
            success: true, 
            actionRequired: financialAction, 
            invoice: finalStatement 
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const dischargePatient = async (req, res) => {
    try {
        const managerId = req.params.id; 
        const { patientId } = req.body;  

        const staffUser = await user.findById(managerId);
        if (!staffUser || staffUser.role !== "manager") {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied. Only a hospital Manager can discharge in-patients." 
            });
        }

        const targetPatient = await mongoose.model("Patient").findById(patientId);
        if (!targetPatient) {
            return res.status(404).json({ success: false, message: "Patient record not found" });
        }

        if (targetPatient.patientType !== "ip") {
            return res.status(400).json({ 
                success: false, 
                message: "Discharge failed. This patient is already registered as an Out-Patient (op)." 
            });
        }

        const roomBillingSummary = await processRoomReleaseAndRent(patientId);

        targetPatient.patientType = "op";
        await targetPatient.save();

        res.status(200).json({
            success: true,
            message: `Patient ${targetPatient.name} successfully discharged by Manager ${staffUser.fullname}`,
            patientTypeNow: targetPatient.patientType,
            billingSummary: roomBillingSummary
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Discharge execution failed", 
            error: error.message 
        });
    }
};
