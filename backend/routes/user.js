const express = require('express')

// Controller Functions
const { loginUser, signupUser, checkOwnPin, changeOwnPassword, changeOwnPin } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')


const router = express.Router()

// Login Route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

// Signup route
router.post('/checkOwnPin', requireAuth, checkOwnPin)

// Change Password
router.patch('/changeOwnPassword', requireAuth, changeOwnPassword)

// Change Pin
router.patch('/changeOwnPin', requireAuth, changeOwnPin)

module.exports = router