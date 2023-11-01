import { useEffect } from 'react'
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

    useEffect(() => {
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
        
    }, [dispatch, user])

    return (
        <div className="igualadorInterface">
            <div className='workers'>
                <h1>Igualadores</h1>

                {workers?.map((worker) => (
                    <WorkerDetailsSmall key={worker._id} worker={worker}/>
                ))}
            </div>
                      
            <div className='tareas'>
                <h1>Lista de Colores</h1>
                {tareas?.map((tarea) => (
                    <TareaDetailsSmall key={tarea._id} tarea={tarea}/>
                ))}
            </div>

            <div className='buttons'>
                <h1>Acción</h1>
                <span className="material-symbols-outlined play" >play_arrow</span>
                <span className="material-symbols-outlined pause" >pause</span>
            </div>
        </div>
    )
}

export default Task