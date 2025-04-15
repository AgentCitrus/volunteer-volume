const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userdataSchema = new Schema({
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
        required: [true, 'Birthday is required'],
        validator: function(value){
            return value <= new Date();
        },
        message: 'Birthday cannot be in the future'
    },
    phoneNumber: {
        type: String,
        match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
        trim: true,
        required: [true, 'Phone number is required']
    },
    email: {
        type: String,
        match: [/.+@.+\..+/, 'Invalid email format'],
        trim: true,
        required: [true, 'Email is required']
    },
    street: {
        type: String,
        trim: true,
        required: [true, 'Street is required']
    },
    city: {
        type: String,
        trim: true,
        required: [true, 'City is required']
    },
    state: {
        type: String,
        trim: true,
        required: [true, 'State is required'],
        enum: {
            values: [
              'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
              'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
              'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
              'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
              'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
            ],
            message: '{VALUE} is not a valid U.S. state abbreviation'
          }
    },
    preferredContact: {
        type: String,
        enum: {
          values: ['email', 'phone', 'text', 'any'],
          message: '{VALUE} is not a valid contact method (email, phone, text, any)'
        },
        lowercase: true,
        trim: true,
        required: [true, 'Contact preference is required']
    },
    languagesSpoken: {
        type: [String],
        default: [],
        trim: true
    },
    howHeard: {
        type: String,
        default: "N/A",
        trim: true,
        maxLength: 50
    },
    otherOrganizations: {
        type: [String],
        default: [],
        trim: true,
        maxLength: [15, 'Too many (15 max)']
    },
    disabilities: {
        type: [String],
        default: [],
        trim: true
    },
    emergencyContact: {
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
        phoneNumber: {
            type: String,
            match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
            trim: true,
            required: [true, 'Phone number is required']
        },
        relationship: {
            type: String,
            trim: true,
            default: 'N/A'
        }

    }
}, {timestamps: true})

module.exports = mongoose.model('userdata', userdataSchema)

