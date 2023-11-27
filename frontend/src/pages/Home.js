import { useEffect } from 'react'
import { useTareasContext } from '../hooks/useTareasContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from "../hooks/useLogout";

// Components
import {TareaDetails} from '../components/TareaDetails'
import TareaForm from '../components/TareaForm'

const baseUrl = process.env.REACT_APP_API_URL || '';

const Home = () => {

    const {tareas, dispatch} = useTareasContext()
    const {user} = useAuthContext()
    const { logout } = useLogout();

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
            } else {
                if (response.status === 401) {
                    console.log("Unauthorized. Logging out...")
                    logout();
                } else {                    
                    console.error(`Error en la petición: ${response.status}`);
                }
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