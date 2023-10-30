const express = require('express')

// Controller Functions
const { loginUser, signupUser } = require('../controllers/userController')


const router = express.Router()

// Login Route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

module.exports = router