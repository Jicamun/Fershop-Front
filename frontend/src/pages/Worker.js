import { useEffect } from 'react'
import { useWorkersContext } from '../hooks/useWorkersContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from "../hooks/useLogout";

// Components
import {WorkerDetails} from '../components/WorkerDetails'
import WorkerForm from '../components/WorkerForm'

const baseUrl = process.env.REACT_APP_API_URL || '';

const Worker = () => {

    const {workers, dispatch} = useWorkersContext()
    const {user} = useAuthContext()
    const { logout } = useLogout();

    useEffect(() => {
        const fetchWorkers = async () => {          
            const response = await fetch(baseUrl + '/api/workers/', {
                headers: {
                    'Authorization' : `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_WORKERS', payload: json})
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
            fetchWorkers()
        }
        
    }, [dispatch, user])

    return (
        <div className="homeWorkers">
            <div className='workers'>
                <h1>Trabajadores</h1>
                {workers?.map((worker) => (
                    <WorkerDetails key={worker._id} worker={worker}/>
                ))}
            </div>
            <div className='worker-form'>
                <WorkerForm />
            </div>
        </div>
    )
}

export default Worker