import { createContext, useReducer } from "react"
import PropTypes from 'prop-types'

export const TareasContext = createContext()

export const tareasReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TAREAS':
            return {tareas: action.payload}
        case 'CREATE_TAREA':
            return {tareas: [action.payload, ...state.tareas]}
        case 'DELETE_TAREA':
            return {tareas: state.tareas.filter((w) => w._id !== action.payload._id)}
        case 'SET_TAREAS_SMALL':
            return {tareas: action.payload}
        default:
            return state
    }
}

export const TareasContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(tareasReducer, {
        tareas: null
    })

    //const obj = useMemo(() => ({...state, dispatch}), [])
    return (
        <TareasContext.Provider value={{...state, dispatch}} >
            { children }            
        </TareasContext.Provider>
    )
}

TareasContextProvider.propTypes = {
    children: PropTypes.object.isRequired
}