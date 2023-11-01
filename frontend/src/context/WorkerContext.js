import { createContext, useReducer } from "react"

export const WorkersContext = createContext()

export const workersReducer = (state, action) => {
    switch (action.type) {
        case 'SET_WORKERS':
            return {workers: action.payload}
        case 'CREATE_WORKER':
            return {workers: [action.payload, ...state.workers]}
        case 'DELETE_WORKER':
            return {workers: state.workers.filter((w) => w._id !== action.payload._id)}
        default:
            return state
    }
}

export const WorkersContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(workersReducer, {
        workers: null
    })

    //const obj = useMemo(() => ({...state, dispatch}), [])
    return (
        <WorkersContext.Provider value={{...state, dispatch}} >
            { children }            
        </WorkersContext.Provider>
    )
}