import procedure from "../models/procedure";


export const createProcedure = async (req, res) => {
    try {
        const { procedureName } = req.body;

        const procedureExists = await Procedure.findOne({ 
            procedureName: { $regex: new RegExp(`^${procedureName}$`, "i") } // Case-insensitive check
        });
        
        if (procedureExists) {
            return res.status(400).json({ success: false, message: "This procedure name already exists" });
        }

        const newProcedure = new Procedure(req.body);
        await newProcedure.save();

        return res.status(201).json({ success: true, data: newProcedure });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getActiveProcedures = async (req, res) => {
    try {
        const procedures = await Procedure.find({ isActive: true }).sort({ procedureName: 1 });
        return res.status(200).json({ success: true, count: procedures.length, data: procedures });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const updateProcedure = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedProcedure = await Procedure.findByIdAndUpdate(
            id,
            { $set: req.body }, // ⚡ Handles partial edits, price changes, or status toggles dynamically!
            { new: true, runValidators: true }
        );

        if (!updatedProcedure) {
            return res.status(404).json({ success: false, message: "Procedure not found" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Procedure updated successfully", 
            data: updatedProcedure 
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

export const deleteProcedure = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProcedure = await Procedure.findByIdAndDelete(id);

        if (!deletedProcedure) {
            return res.status(404).json({ success: false, message: "Procedure not found" });
        }

        return res.status(200).json({ success: true, message: "Procedure deleted successfully from database" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
