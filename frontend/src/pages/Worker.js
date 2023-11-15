import { useEffect } from 'react'
import { useWorkersContext } from '../hooks/useWorkersContext'
import { useAuthContext } from '../hooks/useAuthContext'

// Components
import {WorkerDetails} from '../components/WorkerDetails'
import WorkerForm from '../components/WorkerForm'

const baseUrl = process.env.REACT_APP_API_URL || '';

const Worker = () => {

    const {workers, dispatch} = useWorkersContext()
    const {user} = useAuthContext()

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
            <WorkerForm />
        </div>
    )
}

export default Worker