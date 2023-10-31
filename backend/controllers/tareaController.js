const Tarea = require('../models/tareaModel')
const mongoose = require('mongoose')

// GET All Tareas
const getTareas = async (req, res) => {
    const user_id = req.user._id
    const tareas = await Tarea.find({ user_id }).sort({ createdAt: 1 })

    res.status(200).json(tareas)
}

// GET Single Tarea
const getTarea = async (req, res) => {
    const {id} = req.params
    const user_id = req.user._id

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No tarea with that id 1'})
    }

    const tarea = await Tarea.find({_id:id, user_id}).catch((error) => {
        console.log(error)
    })

    if(!tarea) {
        return res.status(404).json({error: 'No tarea with that id 2'})
    }

    res.status(200).json(tarea)
}

// POST New Tarea
const createTarea = async (req, res) => {
    const {cantidad, calidad, color, cliente, unidad} = req.body

    let emptyFields = []
    
    if(!cantidad) {
        emptyFields.push('cantidad')
    }
    if(!calidad) {
        emptyFields.push('calidad')
    }
    if(!color) {
        emptyFields.push('color')
    }
    if(!cliente) {
        emptyFields.push('cliente')
    }
    if(!unidad) {
        emptyFields.push('unidad')
    }
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields})
    }

    // Add doc to DB
    try {
        const user_id = req.user._id
        const tarea = await Tarea.create({cantidad, calidad, color, cliente, unidad, user_id})
        res.status(200).json(tarea)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// DELETE Single Tarea
const deleteTarea = async (req, res) => {
    const {id} = req.params
    const user_id = req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No tarea with that id'})
    }

    const tarea = await Tarea.findOneAndDelete({_id: id, user_id})

    if (!tarea) {
        return res.status(404).json({error: 'No tarea with that id'})
    }

    res.status(200).json(tarea)

}

// PATCH Single Tarea
const updateTarea = async (req, res) => {
    const {id, values} = req.params
    const user_id = req.user._id
    

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No tarea with that id'})
    }

    const tarea = await Tarea.findOneAndUpdate({_id: id, user_id},{ 
        ...req.body
    })

    if (!tarea){
        return res.status(404).json({error: 'No tarea with that id'})
    }

    res.status(200).json(tarea)

}

module.exports = {
    createTarea,
    getTarea,
    getTareas,
    deleteTarea,
    updateTarea
}