import { useEffect, useState } from 'react'
import { useWorkersContext } from '../hooks/useWorkersContext'
import { useTareasContext } from '../hooks/useTareasContext'
import { useAuthContext } from '../hooks/useAuthContext'

// Components
import {TareaDetailsSmall} from '../components/TareaDetails'
import {WorkerDetailsSmall} from '../components/WorkerDetails'

const Task = () => {
    const {dispatch} = useAuthContext()
    const {workers, dispatch: workersDispatch} = useWorkersContext()
    const {tareas, dispatch: tareasDispatch} = useTareasContext()
    const {user} = useAuthContext()
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedTarea, setSelectedTarea] = useState(null);

    const fetchWorkers = async () => {          
        const response = await fetch('/api/workers/', {
            headers: {
                'Authorization' : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            workersDispatch({type: 'SET_WORKERS', payload: json})
        }
    }

    const fetchFreeTareas = async () => {
        const response = await fetch('/api/tareas/free', {
            headers: {
                'Authorization' : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok){
            tareasDispatch({type:'SET_TAREAS', payload: json})
        }
    }

    const fetchTareasByWorker = async (worker) => {
        const response = await fetch('/api/tareas/worker/' + worker._id, {
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
        }
    }

    const startTarea = async (tarea, worker) => {
        debugger
        tarea.status = 1;
        tarea.worker_id = worker._id;

        const response = await fetch('/api/tareas/' + tarea._id, {
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
                'Authorization' : `Bearer ${user.token}`
            },
            body: JSON.stringify(tarea)
        })

        if(response.ok){
            setSelectedWorker(null)
            setSelectedTarea(null) 
        }
    }

    useEffect(() => {
        setSelectedWorker(null)
        setSelectedTarea(null)       

        if (user) {
            fetchWorkers()
        }
        
    }, [dispatch, tareasDispatch, workersDispatch, user])



    const handleWorkerClick = (worker) => {         
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
            console.log(tarea)
        }
    };

    const handleActionClick = () => {
        try{
            console.log("Algo " + selectedWorker.name + " " + selectedTarea.color)
            startTarea(selectedTarea, selectedWorker)
        }
        catch (error)
        {
            alert("An error has ocurred")
        }
        
    }

    return (
        <div className="igualadorInterface">
            <div className='workers'>
                <h1>Igualadores</h1>

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
                className={`tareas ${selectedWorker ? '' : 'disabled-div'}`}
                disabled={!selectedWorker}
            >
                <h1>Lista de Colores</h1>
                <div className='row tareas-row'>
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
                className={`buttons ${selectedTarea ? '' : 'disabled-div'}`}
                disabled={!selectedTarea}
            >
                <h1>Acción</h1>
                <div className='button-row button-start'>
                    <button 
                        type="button" 
                        className="btn btn-square-md btn-success"
                        onClick={handleActionClick}
                    >
                        Iniciar
                    </button>
                    {/*<span className="material-symbols-outlined play" >play</span>*/}
                </div>
                <div className='button-row button-pause'> 
                    <button 
                        type="button" 
                        className="btn btn-square-md btn-danger"
                        onClick={handleActionClick}
                    >
                        Finalizar
                    </button>                  
                    {/*<span className="material-symbols-outlined pause" >stop</span>*/}
                </div>
            </div>
        </div>
    )
}

export default Task