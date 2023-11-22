import { useEffect } from 'react'
import { useTareasContext } from '../hooks/useTareasContext'
import { useAuthContext } from '../hooks/useAuthContext'

// Components
import {TareaDetails} from '../components/TareaDetails'
import TareaForm from '../components/TareaForm'

const baseUrl = process.env.REACT_APP_API_URL || '';

const Home = () => {

    const {tareas, dispatch} = useTareasContext()
    const {user} = useAuthContext()

    useEffect(() => {
        const fetchTareas = async () => {          
            const response = await fetch( baseUrl + '/api/tareas/all', {
                headers: {
                    'Authorization' : `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_TAREAS', payload: json})
            }
        }

        if (user) {
            fetchTareas()
        }
        
    }, [dispatch, user])

    return (
        <div className="home">            
            <div className='tareas'>
                <h1>Tareas</h1>
                    {tareas?.map((tarea) => (
                        <TareaDetails key={tarea._id} tarea={tarea}/>
                    ))}
            </div>
            <div className="tarea-form">
                <TareaForm />
            </div>
            
        </div>
    )
}

export default Home