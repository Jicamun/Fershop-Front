const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tareaSchema = new Schema({
    cantidad: {
        type: Number,
        min: 0.000, // Minimum value (adjust as needed)
        max: 999999.999, // Maximum value with 3 decimal places (adjust as needed)
        get: v => Math.round(v * 1000) / 1000, // Round to 3 decimal places when getting the value
        set: v => Math.round(v * 1000) / 1000, // Round to 3 decimal places when setting the value
        required: true
    },
    calidad: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    cliente: {
        type: String,
        required: true
    },
    unidad: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Tarea', tareaSchema)