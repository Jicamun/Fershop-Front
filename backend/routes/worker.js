const express = require('express')

// Controller Functions
const { 
    createWorker,
    getWorker,
    getWorkers,
    deleteWorker,
    updateWorker 
} = require('../controllers/workerController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Require AUTH for all Worker routes
router.use(requireAuth)

// GET all workers
router.get('/', getWorkers);

// GET single worker
router.get('/:id', getWorker);

// POST a new worker
router.post('/', createWorker);

// DELETE worker
router.delete('/:id', deleteWorker);

// UPDATE worker
router.patch('/:id', updateWorker);

module.exports = router