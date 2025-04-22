// server/routes/usersdata.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');

const {
  getAllUserData,
  getUserData,
  addUserData,
  updateUserData,
  deleteUserData
} = require('../controllers/userdataController');

/* ----  USER PROFILE ROUTES  ---- */
router.get   ('/userdata',      auth, getAllUserData);
router.get   ('/userdata/:id',  auth, getUserData);
router.post  ('/userdata',      auth, addUserData);
router.patch ('/userdata/:id',  auth, updateUserData);
router.delete('/userdata/:id',  auth, deleteUserData);

module.exports = router;
