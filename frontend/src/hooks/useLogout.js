import { useAuthContext } from "./useAuthContext"
import { useTareasContext } from "./useTareasContext"

export const useLogout = () => {
    const {dispatch} = useAuthContext()
    const {dispatch: tareasDispatch} = useTareasContext()

    const logout = () => {
        // Remove user from Storage
        localStorage.removeItem('user')

        // Dispatch logout action
        dispatch({type:'LOGOUT'})
        tareasDispatch({ type: 'SET_TAREAS', payload: null })
    }

    return {logout}
}