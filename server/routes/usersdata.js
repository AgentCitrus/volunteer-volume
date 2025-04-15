const express = require('express');
const {
    getAllUserData,
    getUserData,
    addUserData
} = require('../controllers/userdataController')
const router = express.Router();

router.get('/', getAllUserData)

router.get('/:id', getUserData)

router.post('/', addUserData)

router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE some userdata'});
})

router.patch('/:id', (req, res) => {
    res.json({mssg: 'PATCH some userdata'});
})

module.exports = router;