const express = require("express");
const router = express.Router();
const { login, signup, getProfile, updateProfile, changePassword, deleteAccount } = require('../controller/auth');
const { validateLogin, validateSignup } = require('../middleware/validators');
const authorization = require('../middleware/authorization');

// Public auth routes
router.post('/login', validateLogin, login);
router.post('/signup', validateSignup, signup);

// Protected auth routes (require authentication)
router.get('/profile', authorization, getProfile);
router.put('/profile', authorization, updateProfile);
router.put('/change-password', authorization, changePassword);
router.delete('/delete-account', authorization, deleteAccount);

module.exports = router;
