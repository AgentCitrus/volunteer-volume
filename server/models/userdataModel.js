// server/models/userdataModel.js
const mongoose = require('mongoose')
const { Schema } = mongoose

const userdataSchema = new Schema({
  // — Your existing profile fields —
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  birthday: {
    type: Date,
    required: [true, 'Birthday is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    trim: true
  },
  street: {
    type: String,
    required: [true, 'Street is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  preferredContact: {
    type: String,
    enum: ['email', 'phone'],
    default: 'email'
  },
  languagesSpoken: {
    type: [String],
    default: []
  },
  howHeard: {
    type: String,
    trim: true,
    default: ''
  },
  otherOrganizations: {
    type: [String],
    default: []
  },
  disabilities: {
    type: String,
    trim: true,
    default: ''
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      match: [/^\d{10}$/, 'Must be 10 digits'],
      trim: true
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      trim: true
    }
  },

  // — New auth fields —
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['volunteer', 'coordinator', 'admin'],
    default: 'volunteer'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('UserData', userdataSchema)
