const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: `${process.env.EXPIRATION}`})
}

// Login user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await User.login(email, password)

        // Create Token
        const token = createToken(user._id)
        const pin = user.pin

        res.status(200).json({email, token, pin})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Signup user
const signupUser = async (req, res) => {
    const {email, password, pin} = req.body

    try{
        const user = await User.signup(email, password, pin)

        // Create Token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Check Pin
const pinCheck = async (req, res) => {
    const {email, pin} = req.body
    
    try{
        let checked = false
        checked = await User.pinCheck(pin, email)

        res.status(200).json({checked})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    loginUser,
    signupUser,
    pinCheck
}