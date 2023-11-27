import { useAuthContext } from "../hooks/useAuthContext"
import { useTareasContext } from "../hooks/useTareasContext"
import { useLogout } from "../hooks/useLogout";
import PropTypes from 'prop-types'

// Date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
const baseUrl = process.env.REACT_APP_API_URL || '';

const TareaDetails = ({ tarea }) => {

    const {dispatch} = useTareasContext()
    const {user} = useAuthContext()
    const { logout } = useLogout();

    const handleClick = async () => {
        if(!user){
            return
        }
        
        const confirmDelete = window.confirm("¿Seguro que quieres borrar esta tarea?");

        if (confirmDelete) {
            const response = await fetch( baseUrl + '/api/tareas/' + tarea._id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
    
            if (response.ok){
                dispatch({type: 'DELETE_TAREA', payload: json})
            } else {
                if (response.status === 401) {
                    console.log("Unauthorized. Logging out...")
                    logout();
                } else {                    
                    console.error(`Error en la petición: ${response.status}`);
                }
            }
        } else {
            return
        } 
    }

    const handleKeyPress = (event) => {
        
        if (event.key === 'Enter' || event.key === ' ') {
            // Llama a la función de clic cuando se presiona Enter o Espacio
            //onClick(tarea);
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
        _id: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        cantidad: PropTypes.number.isRequired,
        calidad: PropTypes.string.isRequired,
        cliente: PropTypes.string.isRequired,
        unidad: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
    //onClick: PropTypes.func.isRequired,
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

const TareaDetailsWithTime = ({ tarea, worker, onClick }) => {

    const {dispatch} = useTareasContext()
    const {user} = useAuthContext()
    const { logout } = useLogout();
    const baseUrl = process.env.REACT_APP_API_URL || '';

    const handleClick = async () => {
        if(!user){
            return
        }
        
        const confirmDelete = window.confirm("¿Seguro que quieres borrar esta tarea?");

        if (confirmDelete) {
            const response = await fetch( baseUrl + '/api/tareas/' + tarea._id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
    
            if (response.ok){
                dispatch({type: 'DELETE_TAREA', payload: json})
            } else {
                if (response.status === 401) {
                    console.log("Unauthorized. Logging out...")
                    logout();
                } else {                    
                    console.error(`Error en la petición: ${response.status}`);
                }
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

    const getTotalTime = () => {
        if( tarea.timePaused.length > 0 ){
            let totalHours = 0;
            let totalMinutes = 0;
            let totalSeconds = 0;

            for ( let i = 0; i < tarea.timePaused.length; i++) {
                const result = getTimeDifferenceDate(tarea.timePaused[i], tarea.timeResumed[i] )
                totalHours += result.hours;
                totalMinutes += result.minutes;
                totalSeconds += result.seconds;
                if (totalSeconds >= 60) {
                    totalMinutes++;
                    totalSeconds -= 60;
                    }
                    
                    if (totalMinutes >= 60) {
                    totalHours++;
                    totalMinutes -= 60;
                    }
            }

            const aux = getTimeDifferenceDate(tarea.timeStart, tarea.timeFinish )
            const ttp = formatTime(totalHours, totalMinutes, totalSeconds)

            let total = getTimeDifferenceTime( ttp , formatTime(aux.hours, aux.minutes, aux.seconds) );

            return {totalTime: total, totalPausedTime: ttp }
        } else {
            const aux = getTimeDifferenceDate(tarea.timeStart, tarea.timeFinish )
            const total = formatTime(aux.hours, aux.minutes, aux.seconds)
            return {totalTime: total, totalPausedTime: "00:00:00" }
        }      

    }

    function getTimeDifferenceDate(startDateTime, endDateTime) {
        const startDate = new Date(startDateTime);
        const endDate = new Date(endDateTime);

        // Calculate the difference in milliseconds
        const timeDifference = endDate - startDate;

        // Convert the difference to hours and minutes
        const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const secondsDifference = Math.floor((timeDifference % (1000 * 60)) / 1000);

        return { hours: hoursDifference, minutes: minutesDifference, seconds: secondsDifference };
    }

    function getTimeDifferenceTime(time1, time2) {
        // Parse the time values
        const [hours1, minutes1, seconds1] = time1.split(':').map(Number);
        const [hours2, minutes2, seconds2] = time2.split(':').map(Number);
      
        // Convert everything to seconds
        const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1;
        const totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2;
      
        // Calculate the difference in seconds
        const timeDifferenceSeconds = totalSeconds2 - totalSeconds1;
      
        // Convert the difference back to HH-MM-SS format
        const hoursDifference = Math.floor(timeDifferenceSeconds / 3600);
        const minutesDifference = Math.floor((timeDifferenceSeconds % 3600) / 60);
        const secondsDifference = timeDifferenceSeconds % 60;
      
        // Format the difference
        const formattedDifference = formatTime(hoursDifference, minutesDifference, secondsDifference)
      
        return formattedDifference;
      }

    function formatTime(hours, minutes, seconds) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }

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

            {(() => {  
                let ttp = getTotalTime();
                return tarea.status === 3 ? (
                    <>
                    <p> <strong> Tiempo total: </strong> {ttp.totalTime}  </p>
                    <p> <strong> Tiempo total pausado:</strong> {ttp.totalPausedTime}</p>
                    </>
                ) : (
                    <p></p>
                );
            })()}
            

            <p> <strong> Trabajador: </strong> Ne{/*worker.name*/} </p>
            <span className="material-symbols-outlined" onClick={handleClick} onKeyDown={handleKeyPress}>delete_forever</span>
        </div>
    )
}

TareaDetailsWithTime.propTypes = {
    tarea: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        cantidad: PropTypes.number.isRequired,
        calidad: PropTypes.string.isRequired,
        cliente: PropTypes.string.isRequired,
        unidad: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
        timeStart: PropTypes.string,
        timePaused: PropTypes.array,
        timeResumed: PropTypes.array,
        timeFinish: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};


export {TareaDetails, TareaDetailsSmall, TareaDetailsWithTime}