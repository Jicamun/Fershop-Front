const Worker = require('../models/workerModel')
const mongoose = require('mongoose')

// GET All Workers
const getWorkers = async (req, res) => {
    const user_id = req.user._id
    const workers = await Worker.find({ user_id }).sort({ createdAt: 1 })

    res.status(200).json(workers)
}

// GET All Workers by Role
const getWorkerByType = async (req, res) => {
    const user_id = req.user._id
    const {type} = req.params
    const workers = await Worker.find({ user_id, type }).sort({ createdAt: 1 })

    res.status(200).json(workers)
}

// GET Single Worker
const getWorker = async (req, res) => {
    const {id} = req.params
    const user_id = req.user._id

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No worker with that id'})
    }

    const worker = await Worker.find({_id:id, user_id}).catch((error) => {
        console.log(error)
    })

    if(!worker) {
        return res.status(404).json({error: 'No worker with that id'})
    }

    res.status(200).json(worker)
}

// POST New Worker
const createWorker = async (req, res) => {
    const {name, birthdate, salary, type} = req.body

    let emptyFields = []
    
    if(!name) {
        emptyFields.push('name')
    }
    if(!birthdate) {
        emptyFields.push('birthdate')
    }
    if(!salary) {
        emptyFields.push('salary')
    }
    if(!type) {
        emptyFields.push('type')
    }
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields})
    }

    // Add doc to DB
    try {
        const user_id = req.user._id
        console.log({name, birthdate, salary, type, user_id})
        const worker = await Worker.create({name, birthdate, salary, type, user_id})
        console.log(worker)
        res.status(200).json(worker)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// DELETE Single Worker
const deleteWorker = async (req, res) => {
    const {id} = req.params
    const user_id = req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No worker with that id'})
    }

    const worker = await Worker.findOneAndDelete({_id: id, user_id})

    if (!worker) {
        return res.status(404).json({error: 'No worker with that id'})
    }

    res.status(200).json(worker)

}

// PATCH Single Worker
const updateWorker = async (req, res) => {
    const {id, values} = req.params
    const user_id = req.user._id
    

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No worker with that id'})
    }

    const worker = await Worker.findOneAndUpdate({_id: id, user_id},{ 
        ...req.body
    })

    if (!worker){
        return res.status(404).json({error: 'No worker with that id'})
    }

    res.status(200).json(worker)

}

module.exports = {
    createWorker,
    getWorker,
    getWorkers,
    deleteWorker,
    updateWorker
}