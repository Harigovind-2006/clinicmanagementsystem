import medicine from "../models/medicine.js";

const DUPLICATE_FIELDS = ["scientificName"];

async function findDuplicateMedicine(data, excludeId = null) {
    const conditions = DUPLICATE_FIELDS
        .filter((field) => data[field] !== undefined && data[field] !== null && data[field] !== "")
        .map((field) => ({ [field]: data[field] }));
    
    if (conditions.length === 0) return null;

    const query = { $or: conditions };
    if (excludeId) query._id = { $ne: excludeId };

    return await medicine.findOne(query);
}

export const createMedicine = async (req, res) => {
    console.log("createMedicine called");
    console.log("Request body:", req.body);
    try {
        const { scientificName } = req.body;
        const duplicateMedicine = await findDuplicateMedicine({ scientificName });

        if (duplicateMedicine) {
            return res.status(400).json({ message: "A medicine with the same scientific name already exists." });
        }

        // new medicine(req.body) works perfectly now that schema and frontend keys match
        const newMedicine = new medicine(req.body);
        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllMedicines = async (req, res) => {
    try {
        const medicines = await medicine.find();
        res.status(200).json(medicines || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMedicineById = async (req, res) => {
    try {
        const foundMedicine = await medicine.findById(req.params.id);
        if (!foundMedicine) return res.status(404).json({ message: "Medicine not found" });
        res.status(200).json(foundMedicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMedicine = async (req, res) => {
    try {
        const { scientificName } = req.body;
        const duplicateMedicine = await findDuplicateMedicine({ scientificName }, req.params.id);
        
        if (duplicateMedicine) {
            return res.status(400).json({ message: "A medicine with the same scientific name already exists." });
        }

        // Use returnDocument: 'after' to clear deprecation warning
        const updatedMedicine = await medicine.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { returnDocument: 'after' }
        );
        
        if (!updatedMedicine) return res.status(404).json({ message: "Medicine not found" });
        res.status(200).json(updatedMedicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMedicine = async (req, res) => {
    try {
        const deletedMedicine = await medicine.findByIdAndDelete(req.params.id);
        if (!deletedMedicine) return res.status(404).json({ message: "Medicine not found" });
        res.status(200).json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const updatedMedicine = await medicine.findByIdAndUpdate(
            req.params.id, 
            { quantity: req.body.quantity }, 
            { returnDocument: 'after' }
        );
        
        if (!updatedMedicine) return res.status(404).json({ message: "Medicine not found" });
        res.status(200).json(updatedMedicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};