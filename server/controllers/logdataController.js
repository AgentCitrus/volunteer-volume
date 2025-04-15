const logData = require('../models/logdataModel')
const mongoose = require('mongoose')


// get all
const getAllLogData = async (req, res) => {
    const logdata = await logData.find({}).sort({createdAt: -1})

    res.status(200).json(logdata)
}

// get single
const getLogData = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such log'})
    }

    const logdata = await logData.findById(id)

    if(!logdata){
        return res.status(404).json({error: 'No such log'})
    }

    res.status(200).json(logdata)
}

// create new
const addLogData = async (req, res) => {
    const {checkIn, checkOut, tasksDesc} = req.body
    try {
        const logdata = await logData.create({checkIn, checkOut, tasksDesc})
        res.status(200).json(logdata)
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

// delete
const deleteLogData = async (req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such log'})
    }

    const logdata = await logData.findOneAndDelete({_id: id})

    if(!logdata){
        return res.status(400).json({error: 'No such log'})
    }

    res.status(200).json(logdata)

}

// update
const updateLogData = async (req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such log'})
    }

    const logdata = await logData.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!logdata){
        return res.status(400).json({error: 'No such log'})
    }

    res.status(200).json(logdata)

}


module.exports = {
    getAllLogData,
    getLogData,
    addLogData,
    deleteLogData,
    updateLogData
}