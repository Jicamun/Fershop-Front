import { useAuthContext } from "../hooks/useAuthContext"
import { useTareasContext } from "../hooks/useTareasContext"

// Date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const TareaDetails = ({ tarea }) => {

    const {dispatch} = useTareasContext()
    const {user} = useAuthContext()

    const handleClick = async () => {
        if(!user){
            return
        }
        
        const response = await fetch('/api/tareas/' + tarea._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok){
            dispatch({type: 'DELETE_TAREA', payload: json})
        }

    }

    return (
        <div className="tarea-details">
            <h4>{tarea.color}</h4>
            <p> <strong>Cantidad (Litros): </strong> {tarea.cantidad} </p>
            <p> <strong>Calidad: </strong> {tarea.calidad} </p>
            <p> <strong>Cliente: </strong> {tarea.cliente} </p>
            <p> <strong>Unidad: </strong> {tarea.unidad} </p>
            <p> {formatDistanceToNow(new Date(tarea.createdAt), {addSuffix: true})} </p>
            <span className="material-symbols-outlined" onClick={handleClick}>delete_forever</span>
        </div>
    )
}

export default TareaDetails