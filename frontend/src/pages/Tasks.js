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

    useEffect(() => {
        setSelectedWorker(null)
        setSelectedTarea(null)
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

        const fetchTareas = async () => {
            const response = await fetch('/api/tareas/', {
                headers: {
                    'Authorization' : `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if(response.ok){
                tareasDispatch({type:'SET_TAREAS', payload: json})
            }
        }

        if (user) {
            fetchWorkers()
            fetchTareas()
        }
        
    }, [dispatch, tareasDispatch, workersDispatch, user])



    const handleWorkerClick = (worker) => {
        if (selectedWorker === worker) {
            setSelectedWorker(null); // Deseleccionar el trabajador si ya estaba seleccionado
            setSelectedTarea(null)
        } else {
            setSelectedWorker(worker);
        }
    };

    const handleTareaClick = (tarea) => {
        if (selectedTarea === tarea) {
            setSelectedTarea(null); // Deseleccionar la tarea si ya estaba seleccionada
        } else {
            setSelectedTarea(tarea);
        }
    };

    const handleActionClick = () => {
        try{
            console.log("Algo " + selectedWorker._id + " " + selectedTarea._id)
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