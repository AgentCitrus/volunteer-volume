// check in, check out, name, birthday, phone number, languages spoken, how they heard about it, organizational affiliations, address, email, preferred contact, role in organization, disabilities, emergency contact
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({mssg: 'GET all userdata'});
})

router.get('/:id', (req, res) => {
    res.json({mssg: 'GET specific userdata'});
})

router.post('/', (req, res) => {
    res.json({mssg: 'POST some userdata'});
})

router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE some userdata'});
})

router.patch('/:id', (req, res) => {
    res.json({mssg: 'PATCH some userdata'});
})

module.exports = router;