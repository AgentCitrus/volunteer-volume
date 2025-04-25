// server/routes/usersdata.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');

/* ── user‑profile controllers ── */
const {
  getAllUserData,
  getUserData,
  addUserData,
  updateUserData,
  deleteUserData
} = require('../controllers/userdataController');

/* ── volunteer log controllers ── */
const {
  getAllLogData,
  getLogData,
  addLogData,
  updateLogData,
  deleteLogData
} = require('../controllers/logdataController');

/* ---------- USER PROFILE ROUTES ---------- */
router.get   ('/userdata',      auth, getAllUserData);
router.get   ('/userdata/:id',  auth, getUserData);
router.post  ('/userdata',      auth, addUserData);
router.patch ('/userdata/:id',  auth, updateUserData);
router.delete('/userdata/:id',  auth, deleteUserData);

/* ---------- VOLUNTEER LOG ROUTES ---------- */
router.get   ('/logdata',       auth, getAllLogData);
router.get   ('/logdata/:id',   auth, getLogData);     // ← fixed line
router.post  ('/logdata',       auth, addLogData);
router.patch ('/logdata/:id',   auth, updateLogData);
router.delete('/logdata/:id',   auth, deleteLogData);

module.exports = router;
