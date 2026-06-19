const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  pid: {
    type: String,
    unique: true 
  },
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  mobilePhone: {
    type: String,
    required: [true, 'Mobile phone number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Invalid Indian mobile number']
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Email address is required'],
    lowercase: true,
    match: [/^\s*[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}\s*$/, 'Invalid email address']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['Male', 'Female',  'Other'],
      message: '{VALUE} is not a valid gender option'
    }
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood group'
    }
  },
  address:{
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  pendingAmount:{
    type: Number,
    default: 0,
    
  },
  billItems: {
    type: map,
    of: BillDetailsSchema,
    default: {}
  }

}, 
{
    timestamps: true
});

// Pre-save middleware to handle atomic auto-incrementing
patientSchema.pre('save', async function (next) {
  const patient = this;

  // Only run this logic if it's a completely new patient entry
  if (patient.isNew) {
    try {
      // Find the counter document and atomically increment the sequence by 1
      const counter = await mongoose.model('Counter').findOneAndUpdate(
        { id: 'patientId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Creates the counter document if it doesn't exist yet
      );

      // Pad the number with zeros to ensure a minimum width of 3 characters (e.g., 1 -> '001')
      const paddedSequence = String(counter.seq).padStart(3, '0');
      
      // Assemble the final custom patient ID format
      patient.pid = `p${paddedSequence}`;
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});



const BillDetailsSchema = new mongoose.Schema({
  billName: {
    type: String,
    required: [true, 'Bill item name is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Bill item amount is required'],
    default: 0,
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    required: [true, 'Bill item status is required'],
    default: 'unpaid',
  },
},{ _id: false });


module.exports = mongoose.model("Patient", patientSchema);