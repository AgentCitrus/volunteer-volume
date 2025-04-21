const express = require('express');
const {
    getAllUserData,
    getUserData,
    addUserData,
    deleteUserData,
    updateUserData
} = require('../controllers/userdataController')

const {
    getAllLogData,
    getLogData,
    addLogData,
    deleteLogData,
    updateLogData
} = require('../controllers/logdataController')

const router = express.Router();

//userdata
router.get('/userdata', getAllUserData)

router.get('/userdata/:id', getUserData)

router.post('/userdata', addUserData)

router.delete('/userdata/:id', deleteUserData)

router.patch('/userdata/:id', updateUserData)

//logdata
router.get('/logdata', getAllLogData)

router.get('/logdata/:id', getLogData)

router.post('/logdata', addLogData)

router.delete('/logdata/:id', deleteLogData)

router.patch('/logdata/:id', updateLogData)

module.exports = router;