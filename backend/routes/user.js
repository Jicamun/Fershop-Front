const express = require('express')

// Controller Functions
const { loginUser, signupUser, pinCheck } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')


const router = express.Router()

// Login Route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

// Signup route
router.post('/pincheck', requireAuth, pinCheck)

module.exports = router