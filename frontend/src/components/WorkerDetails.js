import { useAuthContext } from "../hooks/useAuthContext"
import { useWorkersContext } from "../hooks/useWorkersContext"
import { useLogout } from "../hooks/useLogout";

// Date fns
//import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {format, parseISO} from 'date-fns'
const baseUrl = process.env.REACT_APP_API_URL || '';

const WorkerDetails = ({ worker }) => {

    const {dispatch} = useWorkersContext()
    const {user} = useAuthContext()
    const { logout } = useLogout()

    const handleClick = async () => {
        if(!user){
            return
        }
        
        const response = await fetch( baseUrl + '/api/workers/' + worker._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok){
            dispatch({type: 'DELETE_WORKER', payload: json})
        } else {
            if (response.status === 401) {
                console.log("Unauthorized. Logging out...")
                logout();
            } else {                    
                console.error(`Error en la petición: ${response.status}`);
            }
        }

    }

    const parsedDate = parseISO(worker.birthdate)

    const formattedDate = format(parsedDate, "MM-dd-yyyy")

    return (
        <div className="worker-details">
            <h4>{worker.name}</h4>
            <p> <strong>Fecha de Nacimiento: </strong> {formattedDate} </p>
            <p> <strong>Salario: </strong> ${worker.salary} </p>
            <p> <strong>Puesto: </strong> {worker.type} </p>
            {/*<p> {formatDistanceToNow(new Date(worker.createdAt), {addSuffix: true})} </p>*/}
            <span className="material-symbols-outlined" onClick={handleClick}>delete_forever</span>
        </div>
    )
}

const WorkerDetailsSmall = ({ worker, onClick, selected }) => {
    const handleClick = () => {
        // Llama a la función de clic pasando el trabajador
        onClick(worker);
    };

    return (
        <div className={`worker-details-small ${selected ? 'selected' : ''}`} onClick={handleClick}>
            <h4>{worker.name}</h4>
            {/*<p> {formatDistanceToNow(new Date(worker.createdAt), {addSuffix: true})} </p>*/}
            {/*<span className="material-symbols-outlined" onClick={handleClick}>delete_forever</span>*/}
        </div>
    )
}

export {WorkerDetails,  WorkerDetailsSmall}