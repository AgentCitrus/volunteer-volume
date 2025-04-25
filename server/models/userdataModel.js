const mongoose = require('mongoose');
const { Schema } = mongoose;

const emergencyContactSchema = new Schema(
  { name: String, phone: String, relationship: String },
  { _id: false }
);

const userdataSchema = new Schema(
  {
    /* profile */
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    birthday:  Date,
    street:    String,
    city:      String,
    state:     String,
    phoneNumber: String,
    preferredContact: { type: String, enum: ['email', 'phone'], default: 'email' },
    languagesSpoken:   { type: [String], default: [] },
    howHeard:          String,
    otherOrganizations:{ type: [String], default: [] },
    disabilities:      String,
    emergencyContact:  emergencyContactSchema,

    /* auth */
    email:        { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ['volunteer', 'admin'], default: 'volunteer' },

    /* e-mail verification */
    emailVerified:      { type: Boolean, default: false },
    verifyEmailToken:   String,
    verifyEmailExpires: Date,

    /* forgot-password */
    resetPasswordToken:   String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserData', userdataSchema);
