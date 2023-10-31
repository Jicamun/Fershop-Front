const express = require('express')

// Controller Functions
const { 
    createTarea,
    getTarea,
    getTareas,
    deleteTarea,
    updateTarea 
} = require('../controllers/tareaController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Require AUTH for all Tarea routes
router.use(requireAuth)

// GET all tareas
router.get('/', getTareas);

// GET single tarea
router.get('/:id', getTarea);

// POST a new tarea
router.post('/', createTarea);

// DELETE tarea
router.delete('/:id', deleteTarea);

// UPDATE tarea
router.patch('/:id', updateTarea);

module.exports = router