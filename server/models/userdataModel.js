const mongoose = require('mongoose');
const { Schema } = mongoose;

const emergencyContactSchema = new Schema(
  {
    name:         { type: String, trim: true },
    phone:        { type: String, trim: true },
    relationship: { type: String, trim: true }
  },
  { _id: false }
);

const userdataSchema = new Schema(
  {
    /* ───── basic info ───── */
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    birthday:  { type: Date },

    /* ───── address & phone ───── */
    street:      { type: String, trim: true },
    city:        { type: String, trim: true },
    state:       { type: String, trim: true },
    phoneNumber: { type: String, trim: true },

    /* ───── preferences ───── */
    preferredContact: {
      type: String,
      enum: ['email', 'phone'],
      default: 'email'
    },
    languagesSpoken:   { type: [String], default: [] },
    howHeard:          { type: String, trim: true },
    otherOrganizations:{ type: [String], default: [] },
    disabilities:      { type: String, trim: true },

    emergencyContact: emergencyContactSchema,

    /* ───── auth ───── */
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['volunteer', 'admin'],
      default: 'volunteer'
    },

    /* reset-password support */
    resetPasswordToken:   String,
    resetPasswordExpires: Date
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model('UserData', userdataSchema);
