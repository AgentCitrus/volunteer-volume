const userData = require('../models/userdataModel')
const mongoose = require('mongoose')


// get all
const getAllUserData = async (req, res) => {
    const userdata = await userData.find({}).sort({createdAt: -1})

    res.status(200).json(userdata)
}

// get single
const getUserData = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such user'})
    }

    const userdata = await userData.findById(id)

    if(!userdata){
        return res.status(404).json({error: 'No user found'})
    }

    res.status(200).json(userdata)
}

// create new
const addUserData = async (req, res) => {
    const {firstName, lastName, birthday, phoneNumber, email, street, city, state, preferredContact, languagesSpoken, howHeard, otherOrganizations, disabilities, emergencyContact} = req.body
    try {
        const userdata = await userData.create({firstName, lastName, birthday, phoneNumber, email, street, city, state, preferredContact, languagesSpoken, howHeard, otherOrganizations, disabilities, emergencyContact})
        res.status(200).json(userdata)
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

// delete

// update


module.exports = {
    getAllUserData,
    getUserData,
    addUserData
}