import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    pan: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number"],
    },
    dob: {
      type: Date,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    adhaar: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: [
        "manager",
        "fos",
        "seniordoctor",
        "juniordoctor",
        "nurse",
        "pharmacist",
      ],
      required: true,
    },
    specialization: {
      type: String,
      enum: [
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "General medicine",
        "Cardiology",
        "Dermatology",
        "Gynaecology",
        "Ent",
        "Ophthalmology",
        "General Surgery",
      ],
      trim: true,
      required: [
        function () {
          return this.role === "seniordoctor";
        },
        "Specialization is required for senior doctors",
      ],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);



userSchema.pre("save", async function () {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

export default mongoose.model("User", userSchema);
