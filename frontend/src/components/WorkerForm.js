import { useState, useRef } from "react"
import { useWorkersContext } from "../hooks/useWorkersContext"
import { useAuthContext } from "../hooks/useAuthContext"
const baseUrl = process.env.REACT_APP_API_URL || '';

const WorkerForm = () => {
    const { dispatch } = useWorkersContext()
    const { user } = useAuthContext()

    const [name, setName] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [salary, setSalary] = useState('')
    const [type, setType] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const inputRef = useRef(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!user) {
            setError('You must be logged in')
            return
        }

        const tarea = {name, birthdate, salary, type}

        const response = await fetch( baseUrl + '/api/workers', {
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
            setName('')
            setBirthdate('')
            setSalary('')
            setType('')
            setError(null)
            setEmptyFields([])
            console.log('New Worker Added', json)
            inputRef.current.focus()
            dispatch({type: 'CREATE_WORKER', payload: json})
        }
    }

    return (

        <form className="create" onSubmit={handleSubmit}>

            <h3>Add new Worker</h3>
            <label>Nombre(s):</label>
            <input 
                type="text" 
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={emptyFields.includes('name') ? 'error' : ''}
                ref={inputRef}
            />
            <label>Fecha de Nacimiento:</label>
            <input 
                type="date" 
                onChange={(e) => setBirthdate(e.target.value)}
                value={birthdate}
                className={emptyFields.includes('birthdate') ? 'error' : ''}
            />
            <label>Salario:</label>
            <input 
                type="number" 
                onChange={(e) => setSalary(e.target.value)}
                value={salary}
                className={emptyFields.includes('salary') ? 'error' : ''}
            />
            <label>Puesto:</label>
            <input 
                type="text" 
                onChange={(e) => setType(e.target.value)}
                value={type}
                className={emptyFields.includes('type') ? 'error' : ''}
            />
            <button>Add Worker</button>
            {error && <div className="error">{error}</div>}

        </form>
        
    )
}

export default WorkerForm