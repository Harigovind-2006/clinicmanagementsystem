import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    seq: { type: Number, required: true, default: 0 }
});

const MedCounter = mongoose.models.medCounter || mongoose.model('medCounter', counterSchema);

const medicineSchema = new mongoose.Schema({
    mid: { type: String, unique: true },
    name: { type: String, required: [true, 'Medicine name is required'], trim: true },
    scientificName: { type: String, required: [true, 'Scientific name is required'], trim: true },
    quantity: { type: Number, required: [true, 'Quantity is required'], default: 0, min: [0, 'Cannot be negative'] },
    unitCost: { type: Number, required: [true, 'Unit cost is required'], min: [0, 'Cannot be negative'] }
}, { timestamps: true });

// Corrected Async Middleware
medicineSchema.pre('save', async function () {
    if (!this.isNew) return;
    try {
        const counter = await MedCounter.findOneAndUpdate(
            { id: 'medicineId' },
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true }
        );
        this.mid = `M${String(counter.seq).padStart(3, '0')}`;
    } catch (error) {
        throw error;
    }
});

export default mongoose.model("Medicine", medicineSchema);