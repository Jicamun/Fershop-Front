import { useEffect, useState } from 'react'
import { useWorkersContext } from '../hooks/useWorkersContext'
import { useTareasContext } from '../hooks/useTareasContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from "../hooks/useLogout";

// Components
import {TareaDetailsSmall} from '../components/TareaDetails'
import {WorkerDetailsSmall} from '../components/WorkerDetails'

const baseUrl = process.env.REACT_APP_API_URL || '';

const Task = () => {
    const {dispatch} = useAuthContext()
    const {workers, dispatch: workersDispatch} = useWorkersContext()
    const {tareas, dispatch: tareasDispatch} = useTareasContext()
    const {user} = useAuthContext()
    const { logout } = useLogout();
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedTarea, setSelectedTarea] = useState(null);

    useEffect(() => {
        setSelectedWorker(null)
        setSelectedTarea(null)       

        if (user) {
            if(!workers){
                fetchWorkers()
            }            
        }
        
    }, [dispatch, tareasDispatch, workersDispatch, user])

    const fetchWorkers = async () => {          
        const response = await fetch( baseUrl + '/api/workers/', {
            headers: {
                'Authorization' : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            workersDispatch({type: 'SET_WORKERS', payload: json})
        } else {
            if (response.status === 401) {
                console.log("Unauthorized. Logging out...")
                logout();
            } else {                    
                console.error(`Error en la petición: ${response.status}`);
            }
        }
    }

    const fetchFreeTareas = async () => {
        const response = await fetch( baseUrl + '/api/tareas/free', {
            headers: {
                'Authorization' : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok){
            tareasDispatch({type:'SET_TAREAS', payload: json})
        } else {
            if (response.status === 401) {
                console.log("Unauthorized. Logging out...")
                logout();
            } else {                    
                console.error(`Error en la petición: ${response.status}`);
            }
        }
    }

    const fetchTareasByWorker = async (worker) => {
        const response = await fetch( baseUrl + '/api/tareas/started/' + worker._id, {
            headers: {
                'Authorization' : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(json.length < 1){
            fetchFreeTareas()
            return
        }

        if(response.ok){
            tareasDispatch({type:'SET_TAREAS_SMALL', payload: json})
        } else {
            if (response.status === 401) {
                console.log("Unauthorized. Logging out...")
                logout();
            } else {                    
                console.error(`Error en la petición: ${response.status}`);
            }
        }
    }

    const startTarea = async (tarea, worker) => {
        if(!tarea || !worker){
            alert("Seleccione un trabajador y una tarea primero.")
            return
        }
        if(tarea.status !== 2){
            tarea.timeStart = Date.now()
        } else {            
            tarea.timeResumed.push(Date.now()) 
        }

        tarea.status = 1;
        tarea.worker_id = worker._id;

        const response = await updateTarea(tarea)

        if(response.ok){
            setSelectedTarea(null) 
        }
    }
    
    const pauseTarea = async (tarea, worker) => {
        if(!tarea || !worker){
            return
        }
        tarea.status = 2;
        tarea.timePaused.push(Date.now()) 
        
        const response = await updateTarea(tarea)
        
        if(response.ok){
            setSelectedTarea(null) 
        }
    }

    const finishTarea = async (tarea, worker) => {
        if(!tarea || !worker){
            return
        }
        tarea.status = 3;
        tarea.timeFinish = Date.now()

        const response = await updateTarea(tarea)

        if(response.ok){
            setSelectedTarea(null)
            setSelectedWorker(null) 
        }
    }

    const cancelTarea = async (tarea, worker) => {
        if(!tarea || !worker){
            return
        }
        tarea.status = 0;
        tarea.timeStart = ""
        tarea.timePaused = []
        tarea.timeResumed = []
        tarea.timeFinish = ""

        const response = await updateTarea(tarea)

        if(response.ok){
            setSelectedTarea(null) 
        }
    }

    const handleWorkerClick = (worker) => {         
        tareasDispatch({type:'SET_TAREAS_SMALL', payload: []})
        setSelectedTarea(null)        
        
        if (selectedWorker === worker) {            
            setSelectedWorker(null); // Deseleccionar el trabajador si ya estaba seleccionado            
        } else {            
            setSelectedWorker(worker);
            fetchTareasByWorker(worker)   
        } 
    };

    const handleTareaClick = (tarea) => {
        if (selectedTarea === tarea) {
            setSelectedTarea(null); // Deseleccionar la tarea si ya estaba seleccionada
        } else {
            setSelectedTarea(tarea);
        }
    };

    const handleActionStartClick = () => {
        try{        
            startTarea(selectedTarea, selectedWorker)
        }
        catch (error)
        {
            alert("An error has ocurred")
        }
        
    }
    
    const handleActionFinishClick = () => {
        try{        
            finishTarea(selectedTarea, selectedWorker)
        }
        catch (error)
        {
            alert("An error has ocurred")
        }
        
    }
    
    const handleActionPauseClick = () => {
        try{  
            
            pauseTarea(selectedTarea, selectedWorker)
        }
        catch (error)
        {
            alert("An error has ocurred")
        }
         
    }
    const handleActionCancelClick = () => {
        try{  
            
            cancelTarea(selectedTarea, selectedWorker)
        }
        catch (error)
        {
            alert("An error has ocurred")
        }
        
    }

    const updateTarea = async (tarea) => {
        const response = await fetch( baseUrl + '/api/tareas/' + tarea._id, {
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
                'Authorization' : `Bearer ${user.token}`
            },
            body: JSON.stringify(tarea)
        })

        if (response.status === 401) {
            console.log("Unauthorized. Logging out...")
            logout();
            return
        } else {                    
            console.error(`Error en la petición: ${response.status}`);
        }

        return response
    }

    

    return (
        <div className="igualadorInterface">
            <div className='workers'>
                <h3>Igualadores</h3>

                {workers?.map((worker) => (
                    <WorkerDetailsSmall 
                        key={worker._id} 
                        worker={worker}
                        onClick={handleWorkerClick}
                        selected={selectedWorker === worker}
                    />
                ))}
            </div>
                      
            <div 
                className="tareas"
            >
                <h3>Colores</h3>
                <div 
                    className={`row tareas-row ${selectedWorker ? '' : 'disabled-div'}`
                     }
                    disabled={!selectedWorker}
                >
                    {tareas?.map((tarea) => (
                        <TareaDetailsSmall 
                            key={tarea._id} 
                            tarea={tarea}
                            onClick={handleTareaClick}
                            selected={selectedTarea === tarea}                            
                        />
                    ))}
                </div>
            </div>

            <div 
                className='buttons'
                disabled={!selectedTarea}
            >
                <h3>Acción</h3>
                <div className={`button ${selectedTarea ? '' : 'disabled-div'}`}>
                    <div className={`button-row button-start ${selectedTarea && (selectedTarea.status === 0 || selectedTarea.status === 2) ? '' : 'disabled-div'}`}>
                        <button 
                            type="button" 
                            className="btn btn-square-md btn-success"
                            onClick={handleActionStartClick}
                        >
                            Iniciar
                        </button>                        
                    </div>
                    <div className={`button-row button-pause ${selectedTarea && (selectedTarea.status === 1) ? '' : 'disabled-div'} `}> 
                        <button 
                            type="button" 
                            className="btn btn-square-md btn-warning"
                            onClick={handleActionPauseClick}
                        >
                            Pausar
                        </button>                  
                    </div>
                    <div className={`button-row button-pause ${selectedTarea && (selectedTarea.status === 1) ? '' : 'disabled-div'}`}> 
                        <button 
                            type="button" 
                            className="btn btn-square-md btn-success"
                            onClick={handleActionFinishClick}
                        >
                            Finalizar
                        </button>                  
                    </div>

                    <div className={`button-row button-pause ${selectedTarea && (selectedTarea.status !== 0) ? '' : 'disabled-div'}`}> 
                        <button 
                            type="button" 
                            className="btn btn-square-md btn-danger"
                            onClick={handleActionCancelClick}
                        >
                            Cancelar
                        </button>                                          
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Task