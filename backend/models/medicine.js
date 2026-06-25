import mongoose from "mongoose";
import "./MedCounter.js";

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
});

export default mongoose.model("Medicine", medicineSchema);
