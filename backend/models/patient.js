import mongoose from "mongoose";

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
    type: Map,
    of: BillDetailsSchema,
    default: {}
  }
}, 
{
    timestamps: true
});

// Pre-save middleware to handle atomic auto-incrementing
patientSchema.pre('save', async function () {
  const patient = this;

  if (patient.isNew) {
    const counter = await mongoose.model('Counter').findOneAndUpdate(
      { id: 'patientId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const paddedSequence = String(counter.seq).padStart(3, '0');
    patient.pid = `p${paddedSequence}`;
  }
});

patientSchema.index(
  { name: 1, mobilePhone: 1 },
  { unique: true }
);


export default mongoose.model("Patient", patientSchema);