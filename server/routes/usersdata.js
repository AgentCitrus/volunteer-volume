const express = require('express');
const userData = require('../models/userdataModel')

const router = express.Router();

router.get('/', (req, res) => {
    res.json({mssg: 'GET all userdata'});
})

router.get('/:id', (req, res) => {
    res.json({mssg: 'GET specific userdata'});
})

router.post('/', async (req, res) => {
    const {firstName, lastName, birthday, phoneNumber, email, street, city, state, preferredContact, languagesSpoken, howHeard, otherOrganizations, disabilities, emergencyContact} = req.body
    try {
        const userdata = await userData.create({firstName, lastName, birthday, phoneNumber, email, street, city, state, preferredContact, languagesSpoken, howHeard, otherOrganizations, disabilities, emergencyContact})
        res.status(200).json(userdata)
    } catch (error){
        res.status(400).json({error: error.message})
    }
})

router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE some userdata'});
})

router.patch('/:id', (req, res) => {
    res.json({mssg: 'PATCH some userdata'});
})

module.exports = router;