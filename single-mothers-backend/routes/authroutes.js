const express = require('express');
const router = express.Router();
const authcontroller = require('..//controllers/authcontroller'); // Importing the controller

// Registration route
router.post('/register', authcontroller.register);

// Login route
router.post('/login', authcontroller.login);

module.exports = router;
console.log(router);

