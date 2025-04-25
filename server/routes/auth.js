const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');

router.post('/register',             auth.register);
router.post('/login',                auth.login);
router.post('/forgot-password',      auth.forgotPassword);
router.post('/reset-password/:token',auth.resetPassword);

/* NEW */
router.get('/verify-email/:token',   auth.verifyEmail);

module.exports = router;
