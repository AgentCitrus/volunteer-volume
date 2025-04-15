const mongoose = require('mongoose')

const Schema = mongoose.Schema

const logdataSchema = new Schema({
    checkIn: {
        type: Date,
        required: [true, 'Check-in time required']
    },
    checkOut: {
        type: Date,
        required: [true, 'Check-out time required']
    },
    tasksDesc: {
        type: String,
        required: [true, 'Description of volunteering session required'],
        minLength: [75, 'Minimum characters is 75'],
        maxLength: [500, 'Max characters is 500']
    }
}, {timestamps: true})

module.exports = mongoose.model('logdata', logdataSchema)

