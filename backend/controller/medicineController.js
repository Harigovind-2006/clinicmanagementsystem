import medicine from "../models/medicine.js";

const DUPLICATE_FIELDS = ["scientificName"];

async function findDuplicateMedicine(data, excludeId = null) {
    const conditions = DUPLICATE_FIELDS
        .filter((field) => data[field] !== undefined && data[field] !== null && data[field] !== "")
        .map((field) => ({ [field]: data[field] }));
    
        if (conditions.length === 0) {
            return null;
        }

    const query = { $or: conditions };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    return await medicine.findOne(query);
}

export const createMedicine = async (req, res) => {
    try {
        const { scientificName } = req.body;
        const duplicateMedicine = await findDuplicateMedicine({ scientificName });

        if (duplicateMedicine) {
            return res.status(400).json({ error: "A medicine with the same scientific name already exists." });
        }

        // Proceed with creating the new medicine
        const newMedicine = new medicine(req.body);
        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllMedicines = async (req, res) => {
    try {
        const medicines = await medicine.find();
        if (!medicines || medicines.length === 0) {
            return res.status(404).json({ message: "No medicines found" });
        }
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMedicineById = async (req, res) => {
    try {
        const medicineId = req.params.id;
        const foundMedicine = await medicine.findById(medicineId);
        if (!foundMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.status(200).json(foundMedicine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateMedicine = async (req, res) => {
    try {
        const medicineId = req.params.id;
        const { scientificName } = req.body;
        const duplicateMedicine = await findDuplicateMedicine({ scientificName }, medicineId);
        if (duplicateMedicine) {
            return res.status(400).json({ error: "A medicine with the same scientific name already exists." });
        }
        const updatedMedicine = await medicine.findByIdAndUpdate(medicineId, req.body, { new: true });
        if (!updatedMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.status(200).json(updatedMedicine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteMedicine = async (req, res) => {
    try {
        const medicineId = req.params.id;
        const deletedMedicine = await medicine.findByIdAndDelete(medicineId);
        if (!deletedMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.status(200).json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateQuantity = async (req, res) => {
    try {
        const medicineId = req.params.id;
        const { quantity } = req.body;
        const updatedMedicine = await medicine.findByIdAndUpdate(medicineId, { quantity }, { new: true });
        if (!updatedMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.status(200).json(updatedMedicine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
