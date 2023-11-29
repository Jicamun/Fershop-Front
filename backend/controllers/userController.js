const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (values) => {
    return jwt.sign({values}, process.env.SECRET, {expiresIn: `${process.env.EXPIRATION}`})
}

// Login user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await User.login(email, password)

        // Create Token
        const token = createToken({user: user._id, email: user.email})
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

// Check Own Pin
const checkOwnPin = async (req, res) => {
    const {pin} = req.body
    const {authorization} = req.headers
    
    try{
        let checked = false
        const email = extractValueFromToken(extractTokenFromHeader(authorization), "email")
        checked = await User.pinCheck(email, pin)

        res.status(200).json({checked})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Change Password
const changeOwnPassword = async (req, res) => {
    console.log("I'm In")

    const {password} = req.body
    const {authorization} = req.headers
    
    try{
        const email = extractValueFromToken(extractTokenFromHeader(authorization), "email")
        const user = await User.changePassword(email, password)
        res.status(200).json({user})
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

// Change Pin
const changeOwnPin = async (req, res) => {
    const {pin} = req.body
    const {authorization} = req.headers
    
    try{
        const email = extractValueFromToken(extractTokenFromHeader(authorization), "email")
        const user = await User.changePin(email, pin)
        res.status(200).json({user})
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

const extractTokenFromHeader = (authorization) => {
    let response = ""   

    if(authorization){
        response = authorization.split(' ')[1]
    }
    return response
}

const extractValueFromToken = (token, option) => {
    let response = ""
    const {values} = jwt.verify(token, process.env.SECRET)

    if(values){
        if (option === "email"){
            response = values.email
        } else {
            response = values.user
        }
    }   
    return response
}

module.exports = {
    loginUser,
    signupUser,
    checkOwnPin,
    changeOwnPassword,
    changeOwnPin
}