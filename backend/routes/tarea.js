const express = require('express')

// Controller Functions
const { 
    createTarea,
    createBulkTarea,
    getTarea,
    getTareas,
    getNewTareas,
    getStartedTareasByWorker,
    getFinishedTareas,
    getFreeTareas,
    deleteTarea,
    updateTarea 
} = require('../controllers/tareaController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Require AUTH for all Tarea routes
router.use(requireAuth)

// GET all tareas
router.get('/all', getTareas);

// GET all non worked tareas
router.get('/new', getNewTareas);

// GET all started tareas by Worker
router.get('/started/:id', getStartedTareasByWorker);

// GET all finished tareas
router.get('/finished', getFinishedTareas);

// GET Free tareas 
router.get('/free', getFreeTareas);

// GET single tarea
router.get('/:id', getTarea);

// POST a new tarea
router.post('/', createTarea);

// POST Bulk tarea
router.post('/bulk', createBulkTarea);

// DELETE tarea
router.delete('/:id', deleteTarea);

// UPDATE tarea
router.patch('/:id', updateTarea);

module.exports = router