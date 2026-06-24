import mongoose from "mongoose";

const procedureSchema = new mongoose.Schema({
    procedureName: {
        type: String,
        required: [true, "Procedure name is required"],
        unique: true, 
        trim: true
    },
    amount: {
        type: Number,
        required: [true, "Procedure amount/cost is required"],
        min: [0, "Amount cannot be negative"] 
    },
    isActive: {
        type: Boolean,
        default: true 
    }
},{
    timestamps: true 
});

export default mongoose.model("Procedure", procedureSchema);
