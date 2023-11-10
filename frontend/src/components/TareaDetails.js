import { useAuthContext } from "../hooks/useAuthContext"
import { useTareasContext } from "../hooks/useTareasContext"
import PropTypes from 'prop-types'

// Date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const TareaDetails = ({ tarea, onClick }) => {

    const {dispatch} = useTareasContext()
    const {user} = useAuthContext()

    const handleClick = async () => {
        if(!user){
            return
        }
        
        const confirmDelete = window.confirm("¿Seguro que quieres borrar esta tarea?");

        if (confirmDelete) {
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
        } else {
            return
        } 
    }

    const handleKeyPress = (event) => {
        
        if (event.key === 'Enter' || event.key === ' ') {
            // Llama a la función de clic cuando se presiona Enter o Espacio
            onClick(tarea);
        }
    };

    return (
        <div className="tarea-details">
            <h4>{tarea.color}</h4>
            <p> <strong>Cantidad (Litros): </strong> {tarea.cantidad} </p>
            <p> <strong>Calidad: </strong> {tarea.calidad} </p>
            <p> <strong>Cliente: </strong> {tarea.cliente} </p>
            <p> <strong>Unidad: </strong> {tarea.unidad} </p>
            <p> <strong>Status: </strong>   
                {(() => {
                    let statusText
                    switch(tarea.status) {
                        case 0:
                            statusText = "Nuevo"
                            break;
                        case 1:
                            statusText = "En Proceso"
                            break;
                        case 2:
                            statusText = "En pausa"
                            break;
                        default:
                            statusText = "Terminado"
                            break;
                    }
                    return statusText;                    
                })()}
            </p>
            <p> {formatDistanceToNow(new Date(tarea.createdAt), {addSuffix: true})} </p>
            <span className="material-symbols-outlined" onClick={handleClick} onKeyDown={handleKeyPress}>delete_forever</span>
        </div>
    )
}

TareaDetails.propTypes = {
    tarea: PropTypes.shape({
        color: PropTypes.string.isRequired,
        cantidad: PropTypes.number.isRequired,
        calidad: PropTypes.string.isRequired,
        cliente: PropTypes.string.isRequired,
        unidad: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

const TareaDetailsSmall = ({ tarea, onClick, selected }) => {
    const handleClick = () => {
        // Llama a la función de clic pasando el trabajador
        onClick(tarea);
    };

    const handleKeyPress = (event) => {
        
        if (event.key === 'Enter' || event.key === ' ') {
            // Llama a la función de clic cuando se presiona Enter o Espacio
            onClick(tarea);
        }
    };

    return (
        <div className="col-sm-6">
            <div 
                className=
                    {`card tarea-details-small ${selected ? 'selected' : ''} ${tarea.status === 0 ? 'status-new' : tarea.status === 1 ? 'status-in-progress' : tarea.status === 2 ? 'status-paused' : 'status-finished'}`}
                onClick={handleClick} 
                onKeyDown={handleKeyPress} 
                tabIndex={0} 
            >
                <div className="card-body">
                    <h5 className="card-title">{tarea.color}</h5>            
                    <p className="card-text"> {tarea.cantidad} lts <br/> {tarea.calidad} <br/> {tarea.cliente} <br/> {tarea.unidad} </p>
                </div>
            </div>
        </div>
    )
}
TareaDetailsSmall.propTypes = {
    tarea: PropTypes.shape({
        color: PropTypes.string.isRequired,
        cantidad: PropTypes.number.isRequired,
        calidad: PropTypes.string.isRequired,
        cliente: PropTypes.string.isRequired,
        unidad: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
};

export {TareaDetails, TareaDetailsSmall}