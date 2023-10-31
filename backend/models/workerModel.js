const { Decimal128 } = require('mongodb')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const workerSchema = new Schema({
    name: {
        type: String,
        min: 0, // Minimum value (adjust as needed)
        max: 60, // Maximum value with 3 decimal places (adjust as needed)    
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    salary: {
        type: Number,
        min: 0, // Minimum value (adjust as needed)
        get: v => Math.round(v * 1000) / 100, // Round to 3 decimal places when getting the value
        set: v => Math.round(v * 1000) / 100, // Round to 3 decimal places when setting the value
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Worker', workerSchema)