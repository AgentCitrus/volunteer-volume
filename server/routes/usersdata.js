const express = require('express')
const auth    = require('../middleware/auth')

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
} = require('../controllers/logdataController')    // ← make sure this line is present

const router = express.Router()

// USER DATA
router.get(   '/userdata',      auth, getAllUserData)
router.get(   '/userdata/:id',  auth, getUserData)
router.post(  '/userdata',      auth, addUserData)
router.delete('/userdata/:id',  auth, deleteUserData)
router.patch( '/userdata/:id',  auth, updateUserData)

// LOG DATA
router.get(   '/logdata',       auth, getAllLogData)
router.get(   '/logdata/:id',   auth, getLogData)
router.post(  '/logdata',       auth, addLogData)
router.delete('/logdata/:id',   auth, deleteLogData)
router.patch( '/logdata/:id',   auth, updateLogData)

module.exports = router
