import mongoose from 'mongoose';
import RoomCounter from './roomCounter.js';

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    unique: true
  },
  roomCategory: {
    type: String,
    enum: {
      values: ['small', 'medium', 'large'],
      message: '{VALUE} is not a valid category'
    },
    required: [true, 'Room category is required']
  },
  status: {
    type: String,
    enum: ['occupied', 'available', 'closed'],
    default: 'available'
  },
  
  currentPatient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [
      function() { return this.status === 'occupied'; },
      'Patient reference is required when room is occupied'
    ],
    default: null
  },
  occupiedDate: {
    type: Date,
    required: [
      function() { return this.status === 'occupied'; },
      'Occupied date is required when room is occupied'
    ],
    default: null
  },
  
  advancePaid: {
    type: Number,
    default: 0,
   
    validate: {
      validator: function(value) {
        if (this.status !== 'occupied') return true; // Ignore validation if the room is empty
        
        // Define minimum matrix rules directly in the schema layer
        if (this.roomCategory === 'small' && value < 1500) return false;
        if (this.roomCategory === 'medium' && value < 2000) return false;
        if (this.roomCategory === 'large' && value < 4000) return false;
        
        return true;
      },
      message: 'Paid advance is lower than the minimum required deposit for this category.'
    }
  }
}, {
  timestamps: true
});

roomSchema.pre('save', async function (next) {
  const room = this;

  if (room.isNew) {
    try {
      const counter = await RoomCounter.findOneAndUpdate(
        { id: 'roomId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const paddedSequence = String(counter.seq).padStart(3, '0');
      room.roomId = `r${paddedSequence}`;
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export default mongoose.model('Room', roomSchema);