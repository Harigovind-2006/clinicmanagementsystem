// const mongoose = require("mongoose");
import mongoose from "mongoose";


const medicineSchema = new mongoose.Schema({
    mid: {
    type: String,
    unique: true 
    },
    medicinename:{
        type: String,
        required: [true, 'Medicine name is required'],
        trim: true
    },
    scientificname:{
        type: String,
        required: [true, 'Scientific name is required'],
        trim: true
    },
    quantity:{
        type: Number,
        required: [true, 'Quantity is required'],
        default: 0,
        min: [0, 'Quantity cannot be negative']
    },
    unitcost:{
        type: Number,
        required: [true, 'Unit cost is required'],
        min: [0, 'Unit cost cannot be negative']
    }
},{
    timestamps: true
});

// Pre-save middleware to handle atomic auto-incrementing for mid
medicineSchema.pre('save', async function (next) {
  const medicine = this;

  // Only generate a new ID if the document is being created for the first time
  if (medicine.isNew) {
    try {
      // Find and atomically increment the medicine sequence
      const counter = await mongoose.model('medCounter').findOneAndUpdate(
        { id: 'medicineId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Creates the counter document if it doesn't exist
      );

      // Pad the number with zeros to ensure a width of 3 characters (e.g., 1 -> '001')
      const paddedSequence = String(counter.seq).padStart(3, '0');
      
      // Prefix with 'm' for medicine
      medicine.mid = `m${paddedSequence}`;
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});


// module.exports = mongoose.model("Medicine", medicineSchema);
export default mongoose.model("Medicine",medicineSchema )