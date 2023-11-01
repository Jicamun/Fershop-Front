import { useAuthContext } from "./useAuthContext"
import { useTareasContext } from "./useTareasContext"
import { useWorkersContext } from "./useWorkersContext"

export const useLogout = () => {
    const {dispatch} = useAuthContext()
    const {dispatch: tareasDispatch} = useTareasContext()
    const {dispatch: workersDispatch} = useWorkersContext()

    const logout = () => {
        // Remove user from Storage
        localStorage.removeItem('user')

        // Dispatch logout action
        dispatch({type:'LOGOUT'})
        tareasDispatch({ type: 'SET_TAREAS', payload: null })
        workersDispatch({ type: 'SET_WORKERS', payload: null })
    }

    return {logout}
}