import mongoose from 'mongoose';

const MedCounterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

export default mongoose.model('medCounter', MedCounterSchema);
