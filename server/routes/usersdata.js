const express = require('express');
const {
    getAllUserData,
    getUserData,
    addUserData,
    deleteUserData,
    updateUserData
} = require('../controllers/userdataController')
const router = express.Router();

router.get('/', getAllUserData)

router.get('/:id', getUserData)

router.post('/', addUserData)

router.delete('/:id', deleteUserData)

router.patch('/:id', updateUserData)

module.exports = router;