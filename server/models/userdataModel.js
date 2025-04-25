// server/models/userdataModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userdataSchema = new Schema(
  {
    /* ───────── profile fields ───────── */
    firstName:  { type: String, required: true, trim: true },
    lastName:   { type: String, required: true, trim: true },
    /* … keep your other profile fields unchanged … */

    /* ───────── auth fields ─────────── */
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['volunteer', 'admin'],
      default: 'volunteer'
    },

    /* ───────── reset-password fields ───────── */
    resetPasswordToken:   String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserData', userdataSchema);
