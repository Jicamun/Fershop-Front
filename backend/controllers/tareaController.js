const Tarea = require('../models/tareaModel')
const mongoose = require('mongoose')

// GET All Tareas
const getTareas = async (req, res) => {
    try {
        const user_id = req.user._id

        let { selectedWorker, selectedStatus, selectedDateRange, searchColor, clientText, unitText } = req.query;

        if(selectedStatus === '0'){
            selectedWorker = ''
        }
        
        const parametros = {
            user_id,
            worker_id:selectedWorker,
            status:selectedStatus,        
            selectedDateRange,
            color:searchColor,
            cliente:clientText,
            unidad:unitText
        };

        const filtro = Object.fromEntries(
            Object.entries(parametros).filter(([key, value]) => value !== undefined && value !== null && value !== '')
        );

        filtro.user_id = user_id;

        if (selectedDateRange && selectedDateRange.length === 2) {
            filtro.timeStart = {
                $gte: new Date(selectedDateRange[0]),
                $lte: new Date(selectedDateRange[1]),
            };
        }

       

        

        console.log(filtro)

        const tareas = await Tarea.find( filtro ).sort({ status: 1 })
        res.status(200).json(tareas)
    } catch {
        
    }
}

// GET All Tareas by Worker
const getStartedTareasByWorker = async (req, res) => {
    const user_id = req.user._id
    const {id} = req.params
    const tareas = await Tarea.find({ user_id, worker_id:id, status: { $in: [1,2] } }).sort({ createdAt: -1 })

    res.status(200).json(tareas)
}

const getNewTareas = async (req, res) => {
    const user_id = req.user._id
    const tareas = await Tarea.find({ user_id, status:0 }).sort({ createdAt: -1 })

    res.status(200).json(tareas)
}

const getFinishedTareas = async (req, res) => {
    const user_id = req.user._id
    const tareas = await Tarea.find({ user_id, status:3 }).sort({ createdAt: -1 })

    res.status(200).json(tareas)

}

// GET All Free Tareas
const getFreeTareas = async (req, res) => {
    const user_id = req.user._id
    const tareas = await Tarea.find({ user_id, status:0 }).sort({ createdAt: -1 })

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
        const status = 0
        const worker_id = 0
        const tarea = await Tarea.create({cantidad, calidad, color, cliente, unidad, status, worker_id, user_id})
        res.status(200).json(tarea)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// POST Bulk Tarea
const createBulkTarea = async (req, res) => {
    const tareas = req.body;
  
    if (!Array.isArray(tareas) || tareas.length === 0) {
      return res.status(400).json({ error: 'Request body must be an array of tasks' });
    }
  
    const emptyFields = [];
  
    for (const tarea of tareas) {
      if (!tarea.cantidad) {
        emptyFields.push('cantidad');
      }
      if (!tarea.calidad) {
        emptyFields.push('calidad');
      }
      if (!tarea.color) {
        emptyFields.push('color');
      }
      if (!tarea.cliente) {
        emptyFields.push('cliente');
      }
      if (!tarea.unidad) {
        emptyFields.push('unidad');
      }
    }
  
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
    }
  
    try {
      const user_id = req.user._id;
      const status = 0;
      const worker_id = 0;
  
      const tasksToCreate = tareas.map((tarea) => ({
        cantidad: tarea.cantidad,
        calidad: tarea.calidad,
        color: tarea.color,
        cliente: tarea.cliente,
        unidad: tarea.unidad,
        status,
        worker_id,
        user_id,
      }));
  
      await Tarea.collection.drop()
      const createdTasks = await Tarea.insertMany(tasksToCreate);
  
      res.status(200).json(createdTasks);
    } catch (error) {
      res.status(400).json({ error: error.message });
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
    const {id} = req.params
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
    createBulkTarea,
    getTarea,
    getTareas,
    getNewTareas,
    getStartedTareasByWorker,
    getFinishedTareas,
    getFreeTareas,
    deleteTarea,
    updateTarea
}