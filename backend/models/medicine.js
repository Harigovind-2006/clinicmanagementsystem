import mongoose from "mongoose";

<<<<<<< HEAD
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
=======
const medicineSchema = new mongoose.Schema(
  {
    mid: {
      type: String,
      unique: true,
    },
    medicinename: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    scientificname: {
      type: String,
      required: [true, "Scientific name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },
    unitcost: {
      type: Number,
      required: [true, "Unit cost is required"],
      min: [0, "Unit cost cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

medicineSchema.pre("save", async function () {
  const medicine = this;

  if (medicine.isNew) {
    const counter = await mongoose
      .model("MedCounter")
      .findOneAndUpdate(
        { id: "medicineId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

    const paddedSequence = String(counter.seq).padStart(3, "0");
    medicine.mid = `m${paddedSequence}`;
  }
>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432
});

export default mongoose.model("Medicine", medicineSchema);