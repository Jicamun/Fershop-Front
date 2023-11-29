const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const { response } = require('express')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    }
})

// Static Signup method
userSchema.statics.signup = async function(email, password, pin) {

    // Validation 
    if (!email || !password){
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if (!validator.isStrongPassword(password)){
        throw Error('Password not strogn enough')
    }
    if (pin < 999 || pin > 10000){
        throw Error('PIN has to be 4 digits long')
    }

    const exists = await this.findOne({email})
    if(exists){
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const salt2 = await bcrypt.genSalt(10)
    const hash2 = await bcrypt.hash(pin, salt2)

    const user = await this.create({ email, password: hash, pin: hash2 })

    return user
}

// Static Login Method
userSchema.statics.login = async function(email, password) {

    if (!email || !password){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email})

    if(!user){
        throw Error('Incorrect Email or Password')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error('Incorrect Email or Password')
    }

    return user

}

// Static Pin Check Method
userSchema.statics.pinCheck = async function(email, pin) {
    let match = false
    if (!pin){
        throw Error('All fields must be filled')
    }
    
    const user = await this.findOne({email})

    if(!user){
        throw Error('User not found')
    }

    match = await bcrypt.compare(pin +"", user.pin+"")

    if(!match){
        throw Error('Wrong Pin')
    }

    return match

}

userSchema.statics.changePassword = async function(email, password) {
    
    if (!password){
        throw Error('All fields must be filled')
    }
    if (!validator.isStrongPassword(password)){
        throw Error('Password not strogn enough')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const newUser = await this.findOneAndUpdate({ email }, { password: hash }, { new: true })

    return newUser
}

userSchema.statics.changePin = async function(email, pin) {
    // Validation 
    console.log("Aqui, pin: " + pin)
    if (!pin || !isNumericString(pin)){
        throw Error('All fields must be filled correctly')
    }
    if (pin < 999 || pin > 10000){
        throw Error('PIN has to be 4 digits long')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(pin+"", salt)

    const user = await this.findOneAndUpdate({ email }, { pin: hash }, { new: true })

    return user
}

function isNumericString(str) {
    // Use a regular expression to check if the string only contains digits
    return /^\d+$/.test(str);
}
  


module.exports = mongoose.model('User', userSchema)