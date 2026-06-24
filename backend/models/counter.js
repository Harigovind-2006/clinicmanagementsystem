<<<<<<< HEAD
import mongoose from 'mongoose';
=======
import mongoose from "mongoose";
>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432

const CounterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

<<<<<<< HEAD
export default mongoose.model('Counter', CounterSchema);
=======
export default mongoose.model("Counter", CounterSchema);
>>>>>>> 8277d545c26343484f66ca2e01fa8e7567621432
