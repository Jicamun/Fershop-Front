import { useState, useRef } from "react"
import { useTareasContext } from "../hooks/useTareasContext"
import { useAuthContext } from "../hooks/useAuthContext"

const TareaForm = () => {
    const { dispatch } = useTareasContext()
    const { user } = useAuthContext()

    const [cantidad, setCantidad] = useState('')
    const [calidad, setCalidad] = useState('')
    const [color, setColor] = useState('')
    const [cliente, setCliente] = useState('')
    const [unidad, setUnidad] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const inputRef = useRef(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!user) {
            setError('You must be logged in')
            return
        }

        const tarea = {cantidad, calidad, color, cliente, unidad}

        const response = await fetch('/api/tareas', {
            method: 'POST',
            body: JSON.stringify(tarea),
            headers: {
                'Content-Type':'application/json',
                'Authorization' : `Bearer ${user.token}`
            }
        })

        const json = await response.json()
        

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if (response.ok) {
            setCantidad('')
            setCalidad('')
            setColor('')
            setCliente('')
            setUnidad('')
            setError(null)
            setEmptyFields([])
            console.log('New Tarea Added', json)
            inputRef.current.focus()
            dispatch({type: 'CREATE_TAREA', payload: json})
        }        
    }

    return (

        <form className="create" onSubmit={handleSubmit}>

            <h3>Add new Tarea</h3>
            <label>Cantidad (lts):</label>
            <input 
                type="number" 
                onChange={(e) => setCantidad(e.target.value)}
                value={cantidad}
                className={emptyFields.includes('cantidad') ? 'error' : ''}
                ref={inputRef}
            />
            <label>Calidad:</label>
            <input 
                type="text" 
                onChange={(e) => setCalidad(e.target.value)}
                value={calidad}
                className={emptyFields.includes('calidad') ? 'error' : ''}
            />
            <label>Color:</label>
            <input 
                type="text" 
                onChange={(e) => setColor(e.target.value)}
                value={color}
                className={emptyFields.includes('color') ? 'error' : ''}
            />     
            <label>Cliente:</label>
            <input 
                type="text" 
                onChange={(e) => setCliente(e.target.value)}
                value={cliente}
                className={emptyFields.includes('cliente') ? 'error' : ''}
            />

            <label>Unidad:</label>
            <input 
                type="text" 
                onChange={(e) => setUnidad(e.target.value)}
                value={unidad}
                className={emptyFields.includes('unidad') ? 'error' : ''}
            />
            
            <button>Add Tarea</button>
            {error && <div className="error">{error}</div>}

        </form>
        
    )
}

export default TareaForm